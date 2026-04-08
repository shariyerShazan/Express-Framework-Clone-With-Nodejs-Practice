/**
 * MiddlewareManager — Manages the execution stack for a single request.
 *
 * Features:
 *  - Linear execution via recursive next()
 *  - Automatic async/promise error catching
 *  - Supports error-first middleware with 4 args (err, req, res, next)
 *  - Error short-circuit: next(err) jumps to the nearest error middleware
 */
class MiddlewareManager {
  constructor() {
    this.stack = [];
  }

  use(fn) {
    this.stack.push(fn);
  }

  /**
   * Execute the middleware stack + route handlers for a single request.
   *
   * @param {object}   req               Extended request
   * @param {object}   res               Extended response
   * @param {Function[]} routeHandlers   Route-specific handlers
   * @param {Function} fallbackError     Default error handler
   * @param {Function} finalAction       Called if nothing sent a response (404)
   */
  run(req, res, routeHandlers, fallbackError, finalAction) {
    // Build a combined stack:  global middlewares → route-level handlers
    const combined = [...this.stack, ...routeHandlers];
    let index = 0;

    const next = (err) => {
      // If response already finished, bail
      if (res.writableEnded) return;

      // Walk forward to the next middleware
      const layer = combined[index++];

      // No more layers
      if (!layer) {
        if (err) return fallbackError(err, req, res, next);
        return finalAction();
      }

      try {
        if (err) {
          // Look for error-handling middleware (arity === 4)
          if (layer.length === 4) {
            const result = layer(err, req, res, next);
            if (result && typeof result.catch === 'function') result.catch(next);
          } else {
            // Skip non-error middleware when an error is propagating
            next(err);
          }
        } else {
          // Normal middleware
          if (layer.length === 4) {
            // Skip error middleware when there's no error
            next();
          } else {
            const result = layer(req, res, next);
            if (result && typeof result.catch === 'function') result.catch(next);
          }
        }
      } catch (e) {
        next(e);
      }
    };

    next();
  }
}

module.exports = MiddlewareManager;
