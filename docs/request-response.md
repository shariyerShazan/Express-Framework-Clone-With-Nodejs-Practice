# Request & Response Extensions

To provide a developer-friendly API, the framework extends the native Node.js `http` objects.

## Request Object (`req`)

The `req` object is an instance of `http.IncomingMessage`. In addition to native properties like `req.headers` and `req.method`, the framework adds:

- **`req.params`**: An object containing properties mapped to the named route “parameters”. For example, if you have the route `/user/:name`, the “name” property is available as `req.params.name`.
- **`req.query`**: An object containing a property for each query string parameter in the route.
- **`req.body`**: The parsed body. Populated by the `jsonParser` middleware.
- **`req.pathname`**: The path part of the URL (without query string).

## Response Object (`res`)

The `res` object is an instance of `http.ServerResponse`. The framework adds several chainable helper methods:

- **`res.status(code)`**: Sets the HTTP status for the response. It is a chainable alias of Node’s `response.statusCode`.
  ```javascript
  res.status(404).send('Not Found');
  ```
- **`res.json(data)`**: Sends a JSON response. This method sends a response (with the correct content-type) that is the parameter converted to a JSON string using `JSON.stringify()`.
- **`res.send(data)`**: Sends the HTTP response. The `data` parameter can be a String, an Object, or a Buffer.
  - If it's a string, it defaults to `text/plain` or `text/html`.
  - If it's an object, it calls `res.json()`.
- **`res.end([data])`**: The native Node method to end the response process. Used internally by `res.send()` and `res.json()`.
