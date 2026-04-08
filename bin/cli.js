#!/usr/bin/env node

/**
 * BlazeKit CLI — Entry Point
 * Usage:
 *   blazekit create <app-name>
 *   blazekit start [port]
 *   blazekit generate route <name>
 */

const path = require('path');
const { createCommand } = require('../cli/commands/create');
const { startCommand } = require('../cli/commands/start');
const { generateCommand } = require('../cli/commands/generate');
const { showHelp, showVersion, showBanner } = require('../cli/helpers');

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === '--help' || command === '-h') {
  showBanner();
  showHelp();
  process.exit(0);
}

if (command === '--version' || command === '-v') {
  showVersion();
  process.exit(0);
}

(async () => {
  try {
    switch (command) {
      case 'create':
        await createCommand(args.slice(1));
        break;
      case 'start':
        await startCommand(args.slice(1));
        break;
      case 'generate':
      case 'g':
        await generateCommand(args.slice(1));
        break;
      default:
        console.error(`Unknown command: "${command}"`);
        showHelp();
        process.exit(1);
    }
  } catch (err) {
    console.error(`\x1b[31mError: ${err.message}\x1b[0m`);
    process.exit(1);
  }
})();
