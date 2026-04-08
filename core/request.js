const { URL } = require('url');

/**
 * Extends the native http.IncomingMessage with developer-friendly properties.
 */
function extendRequest(req, params = {}) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // Query params as plain object
  const query = {};
  url.searchParams.forEach((value, key) => {
    // Support repeated keys as arrays  ?tag=a&tag=b → { tag: ['a','b'] }
    if (query[key] !== undefined) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  });

  req.query    = query;
  req.params   = params;
  req.pathname = url.pathname;
  req.path     = url.pathname;
  req.search   = url.search;
  req.hostname = url.hostname;
  req.protocol = req.socket.encrypted ? 'https' : 'http';
  req.secure   = req.protocol === 'https';
  req.body     = req.body || null;

  // Convenience: req.get(headerName)
  req.get = function (name) {
    return req.headers[name.toLowerCase()];
  };

  // Content-type shorthand check: req.is('json') → true/false
  req.is = function (type) {
    const ct = req.headers['content-type'] || '';
    return ct.includes(type);
  };

  // IP address (trust first proxy)
  req.ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.socket.remoteAddress
    || '';

  return req;
}

module.exports = extendRequest;
