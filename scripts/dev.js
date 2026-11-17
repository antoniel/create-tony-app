#!/usr/bin/env node

const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { parseArgs } = require('node:util');
const { startPlaygroundSync } = require('./sync-playground');

async function preparePlayground(root, projectName = 'studio') {
  if (!/^[a-z0-9][a-z0-9_-]*$/i.test(projectName)) {
    throw new Error('Use a single playground folder name, such as studio.');
  }
  const projectPath = path.join(root, '.playground', projectName);
  if (!fs.existsSync(projectPath)) {
    const { generateProject } = require('../dist/command/create');
    console.log('\n  Preparing the local Studio workspace (first run only)...');
    await generateProject(projectPath, { projectName, features: ['web'] });
  }
  if (!fs.existsSync(path.join(projectPath, 'apps/web/package.json'))) {
    throw new Error(`This folder is not a web playground: ${projectPath}. Its files were left untouched.`);
  }
  if (fs.existsSync(path.join(projectPath, 'apps/web/nsh.json'))) {
    throw new Error(`Run bun dev in this Native Shell workspace: ${projectPath}.`);
  }
  return projectPath;
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} failed (${result.status}).`);
}

async function main() {
  const root = path.resolve(__dirname, '..');
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2).filter((arg) => arg !== '--'),
    allowPositionals: true,
    options: {
      runtime: { type: 'string', default: 'vite' },
      target: { type: 'string' },
    },
  });
  if (!['vite', 'nsh'].includes(values.runtime)) throw new Error('Choose --runtime vite or --runtime nsh.');
  if (values.runtime === 'nsh') {
    if (positionals.length) throw new Error('Run a generated NSH project with bun dev from its own workspace.');
    const result = spawnSync('nsh', ['run', '--target', values.target ?? 'web'], {
      cwd: path.join(root, 'templates/nsh'),
      stdio: 'inherit',
    });
    if (result.error?.code === 'ENOENT') {
      throw new Error('Install Native Shell from https://nsh.dev/docs/installation/ and add nsh to PATH.');
    }
    if (result.error) throw result.error;
    process.exitCode = result.status ?? (result.signal === 'SIGINT' ? 0 : 1);
    return;
  }
  if (values.target || positionals.length > 1) throw new Error('Use yarn dev [folder] for Vite.');
  const [projectName = 'studio'] = positionals;
  run(process.execPath, [require.resolve('typescript/bin/tsc'), '-p', 'tsconfig.json'], root);
  const projectPath = await preparePlayground(root, projectName);
  run('bun', ['install'], projectPath);

  console.log(`\n  Studio: http://localhost:3000/studio\n  Workspace: ${projectPath}\n`);
  const stopSync = startPlaygroundSync(root, projectPath);
  const dev = spawn('bun', ['dev'], {
    cwd: projectPath,
    stdio: 'inherit',
    detached: process.platform !== 'win32',
  });
  let stopping = false;
  const stop = () => {
    if (stopping) return;
    stopping = true;
    stopSync();
    if (dev.pid && dev.exitCode === null) {
      if (process.platform === 'win32') dev.kill('SIGTERM');
      else {
        try { process.kill(-dev.pid, 'SIGTERM'); }
        catch (error) { if (error.code !== 'ESRCH') throw error; }
      }
    }
  };
  dev.on('error', (error) => { stop(); console.error(error.message); process.exitCode = 1; });
  dev.on('exit', (code) => { stopSync(); process.exitCode = stopping ? 0 : code ?? 1; });
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}

if (require.main === module) {
  main().catch((error) => { console.error(`\n  ${error.message}`); process.exitCode = 1; });
}

module.exports = { preparePlayground };
