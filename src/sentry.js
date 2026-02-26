import * as Sentry from '@sentry/react';

const parseSampleRate = (rawValue) => {
  const parsed = Number(rawValue);
  if (Number.isNaN(parsed) || parsed < 0 || parsed > 1) {
    return 0;
  }
  return parsed;
};

export const initFrontendSentry = () => {
  const dsn = process.env.REACT_APP_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: process.env.REACT_APP_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
    tracesSampleRate: parseSampleRate(process.env.REACT_APP_SENTRY_TRACES_SAMPLE_RATE),
    beforeSend(event) {
      // Keep user-entered data out of events by default.
      if (event.request && event.request.data) {
        delete event.request.data;
      }
      return event;
    },
  });
};

export const captureFrontendException = (error, context) => {
  if (!process.env.REACT_APP_SENTRY_DSN) return;
  Sentry.captureException(error, context);
};
