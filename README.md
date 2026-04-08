# Mini-Express Clone

A lightweight, production-style Express.js-like framework built from scratch using raw Node.js. This project demonstrates the internal workings of modern web frameworks, including routing, middleware, and request/response lifecycles.

## 🚀 Features

- **Standard HTTP Methods**: Support for GET, POST, PUT, DELETE, and PATCH.
- **Regex-based Router**: High-performance routing with support for dynamic parameters (e.g., `/users/:id`).
- **Middleware System**: Global and route-level middleware with `next()` flow control.
- **Async Support**: Native handling of async/await in routes and middleware.
- **Enhanced API**: Convenient `res.json()`, `res.status()`, `res.send()`, and automatic path parameter extraction.
- **Global Error Handling**: Centralized error management for both synchronous and asynchronous errors.
- **Body Parsing**: Built-in JSON body parsing support.

## 📦 Installation

Since this is a standalone framework with no external dependencies, you can just copy the `core`, `middlewares`, and `utils` folders into your project.

```bash
# Clone or copy the files
git clone https://github.com/your-repo/express-clone.git
```

## 🛠️ Quick Start

```javascript
const { createApp, jsonParser, loggerMiddleware } = require('./index');

const app = createApp();

// Global Middlewares
app.use(loggerMiddleware);
app.use(jsonParser);

// Dynamic Routing
app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id, status: 'Active' });
});

// POST handling
app.post('/users', (req, res) => {
  res.status(201).json(req.body);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

## 📖 Documentation

Detailed documentation is available in the `/docs` folder:

- [Architecture](./docs/architecture.md)
- [Routing System](./docs/routing.md)
- [Middleware System](./docs/middleware.md)
- [Request & Response](./docs/request-response.md)
- [Error Handling](./docs/error-handling.md)
- [API Reference](./docs/api-reference.md)

## 📄 License

MIT
