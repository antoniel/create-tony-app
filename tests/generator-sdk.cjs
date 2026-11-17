const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { generateProject } = require('../dist/command/create.js');

for (let mask = 1; mask < 8; mask++) {
  const features = ['web', 'api', 'database'].filter((_, bit) => mask & (1 << bit));
  test(`SDK packaging: ${features.join('+')}`, async () => {
    const destination = await fs.mkdtemp(path.join(os.tmpdir(), 'tony-sdk-'));
    try {
      await generateProject(destination, { projectName: 'sdk-check', features });
      const root = JSON.parse(await fs.readFile(path.join(destination, 'package.json')));
      assert.equal(root.devDependencies['@ui-sdk/react'], undefined);
      if (features.includes('web')) {
        const web = path.join(destination, 'apps/web');
        const pkg = JSON.parse(await fs.readFile(path.join(web, 'package.json')));
        assert.equal(pkg.dependencies['@ui-sdk/react'], '0.1.0-beta.6');
        assert.equal(pkg.dependencies['@ui-sdk/core'], '0.1.0-beta.6');
        assert.equal(pkg.devDependencies['@types/react'], '^19.2.10');
        for (const file of ['sdk-framework-picker.tsx', 'sdk-framework-picker.css']) {
          assert.equal(await fs.readFile(path.join(web, 'src/components/ui', file), 'utf8'), await fs.readFile(path.join(__dirname, '../templates/web/src/components/ui', file), 'utf8'));
        }
        await fs.access(path.join(web, 'src/lib/pages.ts'));
      } else {
        await assert.rejects(fs.access(path.join(destination, 'apps/web')));
      }
    } finally {
      await fs.rm(destination, { recursive: true, force: true });
    }
  });
}
