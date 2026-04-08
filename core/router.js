/**
 * Router - Advanced URL routing with regex-based path matching
 *
 * Supports:
 *  - Dynamic params:    /users/:id
 *  - Nested params:     /posts/:postId/comments/:commentId
 *  - Wildcard (catch-all): /files/*
 *  - Optional trailing slash
 *  - Route grouping via sub-routers (Router instances as middleware)
 */
class Router {
  constructor(prefix = '') {
    this.routes = [];
    this.prefix = prefix.replace(/\/+$/, ''); // strip trailing slash
  }

  /**
   * Register a route.
   * @param {string} method  HTTP verb (GET, POST, etc.) or 'ALL'
   * @param {string} path    Path pattern
   * @param {Function[]} handlers  One or more handler / middleware functions
   */
  addRoute(method, path, handlers) {
    const fullPath = this.prefix + path;
    const { regex, keys, hasWildcard } = this._pathToRegex(fullPath);
    this.routes.push({
      method: method.toUpperCase(),
      path: fullPath,
      regex,
      keys,
      hasWildcard,
      handlers: Array.isArray(handlers) ? handlers : [handlers],
    });
  }

  // Convenience methods
  get(path, ...h)    { this.addRoute('GET', path, h); return this; }
  post(path, ...h)   { this.addRoute('POST', path, h); return this; }
  put(path, ...h)    { this.addRoute('PUT', path, h); return this; }
  delete(path, ...h) { this.addRoute('DELETE', path, h); return this; }
  patch(path, ...h)  { this.addRoute('PATCH', path, h); return this; }
  all(path, ...h)    { this.addRoute('ALL', path, h); return this; }

  /**
   * Create a chained route definition (like Express's app.route('/path'))
   */
  route(path) {
    const self = this;
    const chain = {};
    ['get', 'post', 'put', 'delete', 'patch'].forEach((m) => {
      chain[m] = (...handlers) => {
        self.addRoute(m.toUpperCase(), path, handlers);
        return chain;
      };
    });
    return chain;
  }

  /**
   * Mount a sub-router at a given prefix.
   * @param {string} prefix
   * @param {Router} subRouter
   */
  mount(prefix, subRouter) {
    subRouter.routes.forEach((route) => {
      const newPath = prefix + route.path;
      const { regex, keys, hasWildcard } = this._pathToRegex(this.prefix + newPath);
      this.routes.push({
        ...route,
        path: this.prefix + newPath,
        regex,
        keys,
        hasWildcard,
      });
    });
  }

  /**
   * Find the first matching route for a given method + URL.
   */
  findRoute(method, url) {
    const { pathname } = new URL(url, 'http://localhost');

    for (const route of this.routes) {
      if (route.method !== 'ALL' && route.method !== method.toUpperCase()) continue;
      const match = pathname.match(route.regex);
      if (!match) continue;

      const params = {};
      route.keys.forEach((key, i) => {
        params[key] = decodeURIComponent(match[i + 1]);
      });

      if (route.hasWildcard) {
        const wildcardIndex = route.keys.length;
        params['*'] = match[wildcardIndex + 1] ? decodeURIComponent(match[wildcardIndex + 1]) : '';
      }

      return { ...route, params };
    }

    return null;
  }

  /**
   * Converts a path string to a regex.
   *  /users/:id          → /^\/users\/([^/]+)\/?$/
   *  /files/*            → /^\/files\/?(.*)?$/
   */
  _pathToRegex(path) {
    const keys = [];
    let hasWildcard = false;

    let pattern = path
      .replace(/\/+$/, '')                     // Remove trailing slash
      .replace(/:([A-Za-z_][A-Za-z0-9_]*)/g, (_, key) => {
        keys.push(key);
        return '([^/]+)';
      });

    // Handle wildcard (catch-all)
    if (pattern.includes('*')) {
      hasWildcard = true;
      pattern = pattern.replace(/\/?\*/, '\\/?(.*)?');
    }

    pattern = pattern.replace(/\//g, '\\/');

    return {
      regex: new RegExp(`^${pattern || '\\/'}\\/?$`),
      keys,
      hasWildcard,
    };
  }
}

module.exports = Router;
