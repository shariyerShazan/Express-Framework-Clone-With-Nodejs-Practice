/**
 * Simple logging middleware that records request details and response time.
 */
function loggerMiddleware(req, res, next) {
  const start = Date.now();

  // Patch res.end to capture the response time
  const originalEnd = res.end;
  res.end = function (...args) {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    return originalEnd.apply(this, args);
  };

  next();
}

module.exports = loggerMiddleware;
