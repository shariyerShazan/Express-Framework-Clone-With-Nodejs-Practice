const { createApp, jsonParser, loggerMiddleware, errorHandler } = require('../index');

const app = createApp();

// 1. Register global middleware
app.use(loggerMiddleware);
app.use(jsonParser);

// 2. Define routes
app.get('/', (req, res) => {
  res.send('<h1>Welcome to Mini-Express Clone</h1><p>Try /users/123 or /posts/45/comments/1</p>');
});

// Route with dynamic parameters
app.get('/users/:id', (req, res) => {
  res.json({
    message: 'User profile fetched',
    userId: req.params.id,
    query: req.query
  });
});

// Multiple dynamic parameters
app.get('/posts/:postId/comments/:commentId', (req, res) => {
  res.json({
    postId: req.params.postId,
    commentId: req.params.commentId
  });
});

// POST route with body parsing
app.post('/users', (req, res) => {
  res.status(201).json({
    message: 'User created successfully',
    data: req.body
  });
});

// 3. Simulating an async error
app.get('/error', async (req, res, next) => {
  // Simulate an async operation that fails
  try {
    throw new Error('This is a simulated async error');
  } catch (err) {
    next(err);
  }
});

// 4. Custom Middleware example for a specific route
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey === 'secret123') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid API Key' });
  }
};

app.get('/admin', authenticate, (req, res) => {
  res.json({ message: 'Welcome to the admin area' });
});

// 5. Global internal error handler (must be last or registered via app.use)
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Sample app listening on http://localhost:${PORT}`);
});
