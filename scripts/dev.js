#!/usr/bin/env node

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

const dev = spawnSync('bun', ['dev'], {
  cwd: projectPath,
  stdio: 'inherit',
});

process.exit(dev.status ?? 1);
