/**
 * Format a Date object or ISO string into a readable string.
 * @param {Date|string} date
 * @param {string} [locale='en-US']
 * @returns {string}
 */
function formatDate(date, locale = 'en-US') {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Capitalize the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Lightweight fetch wrapper.
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
 */
async function apiRequest(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API error ${res.status}: ${error}`);
  }
  return res.json();
}

/**
 * Validate an email address format.
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
  if (typeof email !== 'string') return false;
  // RFC 5322-inspired, practical regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Generate a unique ID string (UUID v4).
 * Uses crypto.randomUUID when available (Node 14.17+, modern browsers),
 * falls back to a manual implementation.
 * @returns {string}
 */
function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback: manual UUID v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Simple structured logger.
 * Levels: info | warn | error | debug
 *
 * As middleware: app.use(logger())
 * As a standalone logger: logger.info('message', { meta })
 *
 * @returns {function} Express middleware
 */
function logger() {
  // Attach level helpers directly on the middleware function
  const levels = {
    info:  '\x1b[36m[INFO] \x1b[0m',
    warn:  '\x1b[33m[WARN] \x1b[0m',
    error: '\x1b[31m[ERROR]\x1b[0m',
    debug: '\x1b[35m[DEBUG]\x1b[0m',
  };

  function log(level, message, meta) {
    const ts = new Date().toISOString();
    const prefix = levels[level] ?? levels.info;
    const metaStr = meta ? ' ' + JSON.stringify(meta) : '';
    console.log(`${prefix} ${ts} ${message}${metaStr}`);
  }

  // Express request-logging middleware
  function middleware(req, res, next) {
    const start = Date.now();
    res.on('finish', () => {
      const ms = Date.now() - start;
      const statusColor =
        res.statusCode >= 500 ? '\x1b[31m' :
        res.statusCode >= 400 ? '\x1b[33m' :
        res.statusCode >= 300 ? '\x1b[36m' :
        '\x1b[32m';
      console.log(
        `${levels.info} ${new Date().toISOString()} ${req.method} ${req.originalUrl} ` +
        `${statusColor}${res.statusCode}\x1b[0m ${ms}ms`
      );
    });
    next();
  }

  // Expose level helpers on the middleware so callers can do:
  //   const log = logger();  log.info('hello');
  middleware.info  = (msg, meta) => log('info',  msg, meta);
  middleware.warn  = (msg, meta) => log('warn',  msg, meta);
  middleware.error = (msg, meta) => log('error', msg, meta);
  middleware.debug = (msg, meta) => log('debug', msg, meta);

  return middleware;
}

/**
 * Global Express error-handling middleware.
 * Must be registered LAST: app.use(errorHandler())
 *
 * Catches errors forwarded via next(err) and returns a
 * consistent JSON error response.
 *
 * @returns {function} Express error middleware (4-arg)
 */
function errorHandler() {
  // eslint-disable-next-line no-unused-vars
  return function (err, req, res, next) {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error
    const ts = new Date().toISOString();
    console.error(`\x1b[31m[ERROR]\x1b[0m ${ts} ${req.method} ${req.originalUrl} → ${status}: ${message}`);
    if (status >= 500 && err.stack) {
      console.error(err.stack);
    }

    res.status(status).json({
      error: {
        status,
        message,
        path: req.originalUrl,
        timestamp: ts,
      },
    });
  };
}

module.exports = {
  formatDate,
  capitalize,
  apiRequest,
  validateEmail,
  generateId,
  logger,
  errorHandler,
};
