const path = require('path');
const fs = require('fs');

/**
 * Extends the native http.ServerResponse with developer-friendly methods.
 */
function extendResponse(res) {
  // Track whether headers/body have been sent to avoid double-send issues
  res._headersSent = false;

  /**
   * Set HTTP status code.  Chainable.
   */
  res.status = function (code) {
    res.statusCode = code;
    return res;
  };

  /**
   * Set a response header.  Chainable.
   */
  res.header = function (name, value) {
    res.setHeader(name, value);
    return res;
  };

  /**
   * Send JSON response.
   */
  res.json = function (data) {
    const body = JSON.stringify(data);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Length', Buffer.byteLength(body));
    res.end(body);
  };

  /**
   * Send HTML / plain text / object.
   */
  res.send = function (data) {
    if (data === undefined || data === null) {
      return res.end();
    }
    if (typeof data === 'object' && !Buffer.isBuffer(data)) {
      return res.json(data);
    }
    if (Buffer.isBuffer(data)) {
      if (!res.getHeader('Content-Type')) {
        res.setHeader('Content-Type', 'application/octet-stream');
      }
      res.setHeader('Content-Length', data.length);
      return res.end(data);
    }
    // string
    if (!res.getHeader('Content-Type')) {
      const ct = data.trimStart().startsWith('<') ? 'text/html' : 'text/plain';
      res.setHeader('Content-Type', `${ct}; charset=utf-8`);
    }
    res.setHeader('Content-Length', Buffer.byteLength(data));
    res.end(data);
  };

  /**
   * HTTP redirect.
   * @param {string} url
   * @param {number} code  301 | 302 (default)
   */
  res.redirect = function (url, code = 302) {
    res.statusCode = code;
    res.setHeader('Location', url);
    res.end();
  };

  /**
   * Set a cookie on the response.
   * @param {string} name
   * @param {string} value
   * @param {object} opts  { maxAge, path, httpOnly, secure, sameSite }
   */
  res.cookie = function (name, value, opts = {}) {
    let str = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    if (opts.maxAge)   str += `; Max-Age=${opts.maxAge}`;
    if (opts.path)     str += `; Path=${opts.path}`;
    if (opts.domain)   str += `; Domain=${opts.domain}`;
    if (opts.httpOnly) str += '; HttpOnly';
    if (opts.secure)   str += '; Secure';
    if (opts.sameSite) str += `; SameSite=${opts.sameSite}`;

    // Support multiple Set-Cookie headers
    const existing = res.getHeader('Set-Cookie') || [];
    const cookies = Array.isArray(existing) ? existing : [existing];
    cookies.push(str);
    res.setHeader('Set-Cookie', cookies);
    return res;
  };

  /**
   * Clear a cookie.
   */
  res.clearCookie = function (name, opts = {}) {
    return res.cookie(name, '', { ...opts, maxAge: 0 });
  };

  /**
   * Send a file as a download.
   * @param {string} filePath  Absolute path to file
   * @param {string} filename  Name to suggest to browser
   */
  res.download = function (filePath, filename) {
    const name = filename || path.basename(filePath);
    res.setHeader('Content-Disposition', `attachment; filename="${name}"`);

    const stream = fs.createReadStream(filePath);
    stream.on('error', (err) => {
      res.status(404).json({ error: 'File not found' });
    });
    stream.pipe(res);
  };

  /**
   * Simple template rendering.
   * Replaces {{ key }} placeholders in a template file.
   */
  res.render = function (templatePath, data = {}) {
    fs.readFile(templatePath, 'utf-8', (err, content) => {
      if (err) {
        return res.status(500).json({ error: 'Template not found', path: templatePath });
      }
      const rendered = content.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
        return data[key] !== undefined ? String(data[key]) : '';
      });
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(rendered);
    });
  };

  /**
   * Send 204 No Content.
   */
  res.noContent = function () {
    res.statusCode = 204;
    res.end();
  };

  return res;
}

module.exports = extendResponse;
