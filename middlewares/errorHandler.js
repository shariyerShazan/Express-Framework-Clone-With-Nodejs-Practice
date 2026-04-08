/**
 * Custom error handling middleware.
 * Signature: (err, req, res, next)
 */
function errorHandler(err, req, res, next) {
  const statusCode = err.status || 500;
  const message = err.message || 'Something went wrong';

  console.error(`[Error] ${req.method} ${req.url} : ${message}`);

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}

module.exports = errorHandler;
