const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { preparePlayground } = require('../scripts/dev');

test('dev prepares a web-only Studio without prompts and preserves existing work on restart', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'tony-dev-'));
  try {
    const other = path.join(root, '.playground/another-project');
    await fs.mkdir(other, { recursive: true });
    await fs.writeFile(path.join(other, 'keep.txt'), 'existing work');
    const project = await preparePlayground(root);
    await fs.access(path.join(project, 'apps/web/src/routes/studio.tsx'));
    await assert.rejects(fs.access(path.join(project, 'apps/api')));
    const edited = path.join(project, 'apps/web/src/routes/index.tsx');
    await fs.writeFile(edited, 'local changes');
    assert.equal(await preparePlayground(root), project);
    assert.equal(await fs.readFile(edited, 'utf8'), 'local changes');
    assert.equal(await fs.readFile(path.join(other, 'keep.txt'), 'utf8'), 'existing work');
    await assert.rejects(preparePlayground(root, '../escape'), /single playground folder/);
    await assert.rejects(preparePlayground(root, 'another-project'), /left untouched/);
    assert.equal(await fs.readFile(path.join(other, 'keep.txt'), 'utf8'), 'existing work');
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});
