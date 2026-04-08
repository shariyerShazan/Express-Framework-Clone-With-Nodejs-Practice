const path = require('path');
const fs = require('fs');

/**
 * Static file serving middleware.
 * Serves files from a given directory.
 *
 * Usage: app.use(serveStatic('./public'))
 */
function serveStatic(rootDir) {
  const absoluteRoot = path.resolve(rootDir);

  const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain',
    '.pdf': 'application/pdf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.webp': 'image/webp',
  };

  return function staticMiddleware(req, res, next) {
    // Only handle GET and HEAD requests
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next();
    }

    const urlPath = req.pathname || new URL(req.url, 'http://localhost').pathname;
    const filePath = path.join(absoluteRoot, urlPath);

    // Prevent directory traversal attacks
    if (!filePath.startsWith(absoluteRoot)) {
      return next();
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        return next();
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Length', stats.size);

      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
      stream.on('error', (streamErr) => {
        next(streamErr);
      });
    });
  };
}

module.exports = serveStatic;
