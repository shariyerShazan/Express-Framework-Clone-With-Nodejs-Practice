# Error Handling

The framework provides a robust way to catch and process errors that occur during the request-response cycle.

## Synchronous Errors

Errors that occur in synchronous code within route handlers and middleware are automatically caught by the middleware manager and passed to the error handler.

```javascript
app.get('/', (req, res) => {
  throw new Error('Something went wrong!'); // Automatically caught
});
```

## Asynchronous Errors

For errors occurring in `async` functions or promised-based code, you must catch them and pass them to `next()`.

```javascript
app.get('/data', async (req, res, next) => {
  try {
    const data = await fetchFromDB();
    res.json(data);
  } catch (err) {
    next(err); // Pass to error handler
  }
});
```

The framework also includes a safety wrapper for async middlewares that will automatically catch rejected promises.

## Custom Error Handler

You can define a custom error handler by registering a middleware with 4 arguments. It should be the last `app.use()` call in your application.

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message
  });
});
```

## Default Behavior

If no custom error handler is provided, the framework uses a built-in default handler that:
1. Logs the error to standard error output.
2. Returns a 500 status code.
3. Sends a JSON response with the error message.
