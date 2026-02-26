const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const logger = require('./config/logger');
const { assertJwtSecret, getAllowedOrigins } = require('./config/env');
const { initSentry } = require('./config/sentry');
const { pool, initDB } = require('./config/db');
const { uploadsDir } = require('./middleware/upload');
const { createErrorHandler, attachGlobalProcessHandlers } = require('./middleware/errorMiddleware');
const { createProjectController } = require('./controllers/projectController');
const { createAuthController } = require('./controllers/authController');
const { uploadImage } = require('./controllers/uploadController');
const { createProjectRoutes } = require('./routes/projectRoutes');
const { createAuthRoutes } = require('./routes/authRoutes');
const { createUploadRoutes } = require('./routes/uploadRoutes');

assertJwtSecret();

const { enabled: sentryEnabled, Sentry } = initSentry(logger);
attachGlobalProcessHandlers({ logger, sentryEnabled, Sentry });

const app = express();
const allowedOrigins = getAllowedOrigins();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS: origin '${origin}' not allowed`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) },
}));
app.use('/uploads', express.static(uploadsDir));

const projectController = createProjectController(pool, logger);
const authController = createAuthController(pool, logger);
const uploadController = { uploadImage };

app.use('/api', createProjectRoutes(projectController));
app.use('/api', createAuthRoutes(authController));
app.use('/api', createUploadRoutes(uploadController));

app.use(createErrorHandler({ logger, sentryEnabled, Sentry }));

initDB(logger);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
