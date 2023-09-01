#!/usr/bin/env node

import sade from 'sade';
import { create } from './command/create';
import logError from './logError';
const pkg = require('../package.json');

sade('tsdx [packageName]')
  .version(pkg.version)
  .describe('Create a new package with TSDX')
  .example('create mypackage')
  .example('create --template react mypackage')
  .action((packageName) => {
    if (!packageName) {
      logError('You must provide a package name.');
    } else {
      create(packageName);
    }
  })
  .parse(process.argv);
