#!/usr/bin/env node

const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { startPlaygroundSync } = require('./sync-playground');

const root = path.resolve(__dirname, '..');
const playground = path.join(root, '.playground');
const projectName = process.argv[2] || 'dev-app';
const projectPath = path.join(playground, projectName);

const build = spawnSync('npx', ['tsc', '-p', 'tsconfig.json'], {
  cwd: root,
  stdio: 'inherit',
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

fs.rmSync(playground, { recursive: true, force: true });
fs.mkdirSync(playground, { recursive: true });

const create = spawnSync(process.execPath, [path.join(root, 'dist/index.js'), projectName], {
  cwd: playground,
  stdio: 'inherit',
});

if (create.status !== 0) {
  process.exit(create.status ?? 1);
}

console.log(`\n  Playground ${projectPath}\n`);

const stopSync = startPlaygroundSync(root, projectPath);
const dev = spawn('bun', ['dev'], {
  cwd: projectPath,
  stdio: 'inherit',
});

const shutdown = (code = 0) => {
  stopSync();
  if (dev.exitCode === null) {
    dev.kill('SIGINT');
  }
  process.exit(code);
};

dev.on('exit', (code) => {
  stopSync();
  process.exit(code ?? 0);
});

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
