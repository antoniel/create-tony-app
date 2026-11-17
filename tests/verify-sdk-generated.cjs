// Run from the repository root after building the CLI. Requires Bun.
const { generateProject } = require('../dist/command/create.js');
const { mkdtemp, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
(async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'tony-sdk-builds-'));
  try {
    for (const mask of [1, 3, 5, 7]) {
      const features = ['web', 'api', 'database'].filter((_, bit) => mask & (1 << bit));
      const cwd = path.join(root, String(mask));
      await generateProject(cwd, { projectName: 'sdk-verification', features });
      for (const args of [['install'], ['run', 'typecheck'], ['run', 'build']]) {
        execFileSync('bun', args, { cwd, stdio: 'inherit' });
      }
      console.log(`PASS generated ${features.join('+')}`);
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
