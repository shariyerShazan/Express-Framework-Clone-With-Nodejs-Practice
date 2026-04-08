const pkg = require('../../package.json');

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

function showBanner() {
  console.log(`
${colors.cyan}${colors.bright}
  ██████╗ ██╗      █████╗ ███████╗███████╗██╗  ██╗██╗████████╗
  ██╔══██╗██║     ██╔══██╗╚══███╔╝██╔════╝██║ ██╔╝██║╚══██╔══╝
  ██████╔╝██║     ███████║  ███╔╝ █████╗  █████╔╝ ██║   ██║
  ██╔══██╗██║     ██╔══██║ ███╔╝  ██╔══╝  ██╔═██╗ ██║   ██║
  ██████╔╝███████╗██║  ██║███████╗███████╗██║  ██╗██║   ██║
  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝   ╚═╝
${colors.reset}
  ${colors.dim}A blazing-fast, lightweight Node.js framework${colors.reset}
  ${colors.dim}Version ${pkg.version}${colors.reset}
  `);
}

function showHelp() {
  console.log(`
${colors.yellow}Usage:${colors.reset}
  blazekit <command> [options]

${colors.yellow}Commands:${colors.reset}
  ${colors.green}create${colors.reset} <app-name>        Create a new BlazeKit project
  ${colors.green}start${colors.reset}  [port]            Start the development server (default: 3000)
  ${colors.green}generate${colors.reset} route <name>    Generate a new route file
  ${colors.green}generate${colors.reset} middleware <name> Generate a new middleware file

${colors.yellow}Options:${colors.reset}
  ${colors.cyan}-h, --help${colors.reset}                Show this help message
  ${colors.cyan}-v, --version${colors.reset}             Show CLI version

${colors.yellow}Examples:${colors.reset}
  ${colors.dim}$ blazekit create my-api${colors.reset}
  ${colors.dim}$ cd my-api && npm install && npm start${colors.reset}
  ${colors.dim}$ blazekit generate route users${colors.reset}
`);
}

function showVersion() {
  console.log(`blazekit v${pkg.version}`);
}

function log(msg, type = 'info') {
  const prefix = {
    info: `${colors.cyan}ℹ${colors.reset}`,
    success: `${colors.green}✔${colors.reset}`,
    warn: `${colors.yellow}⚠${colors.reset}`,
    error: `${colors.red}✖${colors.reset}`,
    step: `${colors.magenta}→${colors.reset}`,
  };
  console.log(`  ${prefix[type] || prefix.info} ${msg}`);
}

module.exports = { showBanner, showHelp, showVersion, log, colors };
