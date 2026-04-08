/**
 * Utility to parse request body streams.
 */
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    const MAX_SIZE = 1 * 1024 * 1024; // 1MB limit

    req.on('data', (chunk) => {
      body += chunk.toString();
      if (body.length > MAX_SIZE) {
        reject(new Error('Payload too large'));
      }
    });

    req.on('end', () => {
      resolve(body);
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
}

module.exports = { parseBody };
