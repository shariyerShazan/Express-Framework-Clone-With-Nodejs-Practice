const { parseBody } = require('../utils/parser');

/**
 * Middleware to parse JSON request bodies.
 */
async function jsonParser(req, res, next) {
  const contentType = req.headers['content-type'];
  
  if (contentType === 'application/json') {
    try {
      const body = await parseBody(req);
      if (body) {
        req.body = JSON.parse(body);
      } else {
        req.body = {};
      }
      next();
    } catch (err) {
      err.status = 400; // Bad Request
      next(err);
    }
  } else {
    // Skip if not JSON
    // We can still try to parse if there's data, or just set it to empty
    req.body = {};
    next();
  }
}

module.exports = jsonParser;
