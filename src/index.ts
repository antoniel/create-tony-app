#!/usr/bin/env node

import sade from 'sade';
import { create } from './command/create';
import logError from './logError';

const pkg = require('../package.json');

sade('create-tony-app [projectName]')
  .version(pkg.version)
  .describe('Compose a Bun monorepo from a visual project tree')
  .example('my-app')
  .action(async (projectName?: string) => {
    try {
      await create(projectName);
    } catch (error) {
      logError(error);
      process.exitCode = 1;
    }
  })
  .parse(process.argv);
