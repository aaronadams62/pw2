const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// #24 — Require JWT_SECRET at startup. Refuse to run without it.
if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET environment variable is not set. Refusing to start.');
    process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif|webp/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) {
            return cb(null, true);
        }
        cb(new Error('Only image files allowed'));
    }
});

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'portfolio',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

// Wait for DB to be ready and initialize schema
const initDB = async () => {
    let retries = 5;
    while (retries) {
        try {
            await pool.query('SELECT NOW()');
            console.log("Database Connected!");

            // Create Projects Table
            await pool.query(`
                CREATE TABLE IF NOT EXISTS projects (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    description TEXT,
                    image_url TEXT,
                    live_url TEXT,
                    category VARCHAR(50) DEFAULT 'web', 
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);

            // Create Users table
            await pool.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL
                );
            `);

            // #23 — Seed admin only from environment variables. Never use hardcoded credentials.
            const adminUsername = process.env.ADMIN_USERNAME;
            const adminPassword = process.env.ADMIN_PASSWORD;
            if (adminUsername && adminPassword) {
                const userCheck = await pool.query("SELECT * FROM users WHERE username = $1", [adminUsername]);
                if (userCheck.rows.length === 0) {
                    const hashedPassword = await bcrypt.hash(adminPassword, 12);
                    await pool.query("INSERT INTO users (username, password_hash) VALUES ($1, $2)", [adminUsername, hashedPassword]);
                    console.log(`Admin user "${adminUsername}" created from environment variables.`);
                }
            } else {
                console.warn('WARN: ADMIN_USERNAME or ADMIN_PASSWORD not set — skipping admin seed. Create an admin manually if needed.');
            }

            break;
        } catch (err) {
            console.log("Database not ready, retrying...", retries);
            retries -= 1;
            await new Promise(res => setTimeout(res, 5000));
        }
    }
};

initDB();

// -- ROUTES --

// GET All Projects
app.get('/api/projects', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
        // Format to match old Strapi structure for minimal frontend changes, or just nice JSON
        // Let's just return clean JSON, we will update frontend to match this simpler API
        res.json({ data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server bad' });
    }
});

// LOGIN
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (user.rows.length === 0) return res.status(401).json({ error: "Invalid creds" });

        const valid = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!valid) return res.status(401).json({ error: "Invalid creds" });

        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
});

// Middleware for protected routes
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// CREATE Project (Protected)
app.post('/api/projects', authenticateToken, async (req, res) => {
    const { title, description, image_url, live_url, category } = req.body;
    try {
        const newProject = await pool.query(
            "INSERT INTO projects (title, description, image_url, live_url, category) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [title, description, image_url, live_url, category]
        );
        res.json(newProject.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create project" });
    }
});

// DELETE Project (Protected)
app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
    try {
        await pool.query("DELETE FROM projects WHERE id = $1", [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete" });
    }
});

// UPDATE Project (Protected)
app.put('/api/projects/:id', authenticateToken, async (req, res) => {
    const { title, description, image_url, live_url, category } = req.body;
    try {
        const updated = await pool.query(
            "UPDATE projects SET title=$1, description=$2, image_url=$3, live_url=$4, category=$5 WHERE id=$6 RETURNING *",
            [title, description, image_url, live_url, category, req.params.id]
        );
        res.json(updated.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update project" });
    }
});

// UPLOAD Image (Protected)
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return the URL path to the uploaded file
    const imageUrl = `http://localhost:4000/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
