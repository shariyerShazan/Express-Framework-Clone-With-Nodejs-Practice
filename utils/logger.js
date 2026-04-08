/**
 * Utility logger with colored output and timestamps.
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

function timestamp() {
  return new Date().toISOString();
}

const logger = {
  info(msg) {
    console.log(`${colors.cyan}[INFO]${colors.reset} ${colors.dim}${timestamp()}${colors.reset} ${msg}`);
  },
  success(msg) {
    console.log(`${colors.green}[SUCCESS]${colors.reset} ${colors.dim}${timestamp()}${colors.reset} ${msg}`);
  },
  warn(msg) {
    console.warn(`${colors.yellow}[WARN]${colors.reset} ${colors.dim}${timestamp()}${colors.reset} ${msg}`);
  },
  error(msg) {
    console.error(`${colors.red}[ERROR]${colors.reset} ${colors.dim}${timestamp()}${colors.reset} ${msg}`);
  },
  debug(msg) {
    if (process.env.DEBUG) {
      console.log(`${colors.magenta}[DEBUG]${colors.reset} ${colors.dim}${timestamp()}${colors.reset} ${msg}`);
    }
  },
};

module.exports = { logger, colors };
