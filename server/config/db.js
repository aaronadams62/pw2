const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'portfolio',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function initDB(logger) {
  let retries = 5;
  while (retries) {
    try {
      await pool.query('SELECT NOW()');
      logger.info('Database connected.');

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

      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL
        );
      `);

      const adminUsername = process.env.ADMIN_USERNAME;
      const adminPassword = process.env.ADMIN_PASSWORD;
      if (adminUsername && adminPassword) {
        const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [adminUsername]);
        if (userCheck.rows.length === 0) {
          const hashedPassword = await bcrypt.hash(adminPassword, 12);
          await pool.query('INSERT INTO users (username, password_hash) VALUES ($1, $2)', [adminUsername, hashedPassword]);
          logger.info(`Admin user "${adminUsername}" created from environment variables.`);
        }
      } else {
        logger.warn('ADMIN_USERNAME or ADMIN_PASSWORD not set — skipping admin seed.');
      }

      return;
    } catch (err) {
      logger.warn(`Database not ready, retrying... (${retries} attempts left)`);
      retries -= 1;
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
}

module.exports = {
  pool,
  initDB,
};
