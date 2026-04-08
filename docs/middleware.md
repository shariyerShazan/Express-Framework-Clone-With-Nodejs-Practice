# Middleware System

Middleware functions are functions that have access to the request object (`req`), the response object (`res`), and the `next` function in the application’s request-response cycle.

## Concept

Middleware can:
- Execute any code.
- Make changes to the request and the response objects.
- End the request-response cycle.
- Call the next middleware in the stack.

## `next()` behavior

The `next()` function is a callback that, when invoked, executes the middleware succeeding the current middleware. 

- **Control Flow**: If a middleware does not call `next()`, the request is left hanging, and no subsequent middleware or route handlers will be executed (unless `res.end()` was already called).
- **Error Propagation**: Calling `next(err)` with an argument tells the framework that an error occurred. It will skip all remaining non-error middlewares and jump directly to the Error Handling Middleware.

## Types of Middleware

### Global Middleware
Registered using `app.use(fn)`. Applies to every request.

```javascript
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});
```

### Route Middleware
Applied to specific routes.

```javascript
app.get('/user', (req, res, next) => {
  console.log('Route specific');
  next();
}, (req, res) => {
  res.send('Done');
});
```

### Error Handling Middleware
Registered using a function with 4 arguments: `(err, req, res, next)`.

```javascript
app.use((err, req, res, next) => {
  res.status(500).send('Internal Server Error');
});
```

## Execution Order
Middleware is executed in the order it is defined/registered using `app.use()` and then following the route definition.
