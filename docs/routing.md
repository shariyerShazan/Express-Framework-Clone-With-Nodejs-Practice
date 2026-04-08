# Routing Mechanism

The framework provides a robust routing system that matches incoming URLs to specific handlers.

## Defining Routes

Routes are defined using methods on the `app` instance:

```javascript
app.get('/path', (req, res) => { ... });
app.post('/path', (req, res) => { ... });
app.put('/path', (req, res) => { ... });
app.delete('/path', (req, res) => { ... });
app.patch('/path', (req, res) => { ... });
```

## Dynamic Parameters

Parameters allow you to capture segments of the URL. They are defined with a colon `:` prefix.

```javascript
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`User ID is ${userId}`);
});
```

You can define multiple parameters:

```javascript
app.get('/posts/:postId/comments/:commentId', (req, res) => {
  const { postId, commentId } = req.params;
  res.json({ postId, commentId });
});
```

## Matching Algorithm

Every path string is internaly transformed into a Regular Expression.

1. `/users/:id` becomes `/^\/users\/([^/]+)\/?$/`.
2. Slashes are escaped.
3. Groups capture the values between slashes.
4. Trailing slashes are handled optionally.

## Route-Level Middleware

You can pass multiple handlers to a route. Handlers are executed in order.

```javascript
const checkAuth = (req, res, next) => {
  if (req.headers.authorization) next();
  else res.status(401).send('Forbidden');
};

app.get('/dashboard', checkAuth, (req, res) => {
  res.send('Welcome to Dashboard');
});
```
