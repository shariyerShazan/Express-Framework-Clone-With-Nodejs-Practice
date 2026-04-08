const { createApp } = require('./core/app');
const jsonParser = require('./middlewares/jsonParser');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const errorHandler = require('./middlewares/errorHandler');
const serveStatic = require('./middlewares/static');
const { logger } = require('./utils/logger');

module.exports = {
  createApp,
  jsonParser,
  loggerMiddleware,
  errorHandler,
  serveStatic,
  logger,
};
