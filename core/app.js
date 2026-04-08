const http = require('http');
const Router = require('./router');
const MiddlewareManager = require('./middleware');
const extendRequest = require('./request');
const extendResponse = require('./response');

class App {
  constructor() {
    this.router = new Router();
    this.middlewareManager = new MiddlewareManager();
    this.globalErrorHandler = this._defaultErrorHandler.bind(this);
  }

  use(fn) {
    if (typeof fn !== 'function') {
      throw new Error('Middleware must be a function');
    }
    // Check if it's an error handler (4 arguments)
    if (fn.length === 4) {
      this.globalErrorHandler = fn;
    } else {
      this.middlewareManager.use(fn);
    }
  }

  get(path, ...handlers) {
    this.router.addRoute('GET', path, handlers);
  }

  post(path, ...handlers) {
    this.router.addRoute('POST', path, handlers);
  }

  put(path, ...handlers) {
    this.router.addRoute('PUT', path, handlers);
  }

  delete(path, ...handlers) {
    this.router.addRoute('DELETE', path, handlers);
  }

  patch(path, ...handlers) {
    this.router.addRoute('PATCH', path, handlers);
  }

  /**
   * Default error handler
   */
  _defaultErrorHandler(err, req, res, next) {
    console.error('Internal Server Error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message,
    });
  }

  /**
   * The core handler for all incoming HTTP requests
   */
  handleRequest(req, res) {
    // 1. Find matching route
    const route = this.router.findRoute(req.method, req.url);

    // 2. Extend req and res
    extendRequest(req, route ? route.params : {});
    extendResponse(res);

    const routeHandlers = route ? route.handlers : [];

    // 3. Run middleware + route handlers
    this.middlewareManager.run(
      req,
      res,
      routeHandlers,
      this.globalErrorHandler,
      () => {
        // Final action if no middleware/route sent a response
        if (!res.writableEnded) {
          res.status(404).json({ error: 'Not Found', path: req.url });
        }
      }
    );
  }

  listen(port, callback) {
    const server = http.createServer((req, res) => this.handleRequest(req, res));
    return server.listen(port, callback);
  }
}

function createApp() {
  return new App();
}

module.exports = { createApp, App };
