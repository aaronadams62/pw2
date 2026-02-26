function createErrorHandler({ logger, sentryEnabled, Sentry }) {
  return (err, req, res, next) => {
    logger.error(err.message);
    if (sentryEnabled) Sentry.captureException(err);
    if (res.headersSent) return next(err);
    return res.status(500).json({ error: 'Unexpected server error' });
  };
}

function attachGlobalProcessHandlers({ logger, sentryEnabled, Sentry }) {
  process.on('unhandledRejection', (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    logger.error(`Unhandled Rejection: ${error.message}`);
    if (sentryEnabled) Sentry.captureException(error);
  });

  process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
    if (sentryEnabled) Sentry.captureException(error);
  });
}

module.exports = {
  createErrorHandler,
  attachGlobalProcessHandlers,
};
