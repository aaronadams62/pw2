const Sentry = require('@sentry/node');

function parseSampleRate(rawValue) {
  const parsed = Number(rawValue);
  if (Number.isNaN(parsed) || parsed < 0 || parsed > 1) return 0;
  return parsed;
}

function initSentry(logger) {
  const enabled = Boolean(process.env.SENTRY_DSN);
  if (!enabled) {
    return { enabled, Sentry };
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
    tracesSampleRate: parseSampleRate(process.env.SENTRY_TRACES_SAMPLE_RATE),
    beforeSend(event) {
      if (event.request && event.request.data) {
        delete event.request.data;
      }
      return event;
    },
  });

  logger.info('Sentry monitoring enabled for backend.');
  return { enabled, Sentry };
}

module.exports = {
  initSentry,
};
