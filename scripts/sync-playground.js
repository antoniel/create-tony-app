const fs = require('fs');
const path = require('path');

const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', '.output', '.turbo', 'data']);
const IGNORED_FILES = new Set([
  'package.json',
  'routeTree.gen.ts',
  '.env',
  'bun.lock',
  'bun.lockb',
  'package-lock.json',
  'README.md',
]);

function inferFeatures(projectPath) {
  return {
    web: fs.existsSync(path.join(projectPath, 'apps/web')),
    api: fs.existsSync(path.join(projectPath, 'apps/api')),
    database: fs.existsSync(path.join(projectPath, 'packages/database')),
  };
}

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function shouldIgnore(relative) {
  const parts = relative.split('/');
  if (parts.some((part) => IGNORED_DIRS.has(part))) {
    return true;
  }

  const base = parts[parts.length - 1];
  return !base || IGNORED_FILES.has(base) || base.endsWith('.log') || base.endsWith('.tsbuildinfo');
}

function templateTarget(relative, features) {
  if (relative === '.gitignore') {
    return 'templates/root/gitignore';
  }

  if (relative === '.env.example') {
    return features.database ? 'templates/database/.env.example' : null;
  }

  if (
    relative === 'turbo.json' ||
    relative === 'tsconfig.json' ||
    relative === '.oxfmtrc.json' ||
    relative === '.oxlintrc.json'
  ) {
    return `templates/root/${relative}`;
  }

  if (relative.startsWith('tools/oxlint/')) {
    return `templates/root/${relative}`;
  }

  if (relative.startsWith('apps/web/')) {
    const rest = relative.slice('apps/web/'.length);
    if (rest === 'src/routes/index.tsx') {
      return features.api
        ? 'templates/web/src/routes/index.with-api.tsx'
        : 'templates/web/src/routes/index.standalone.tsx';
    }
    return `templates/web/${rest}`;
  }

  if (relative.startsWith('apps/api/')) {
    const rest = relative.slice('apps/api/'.length);
    if (rest === 'src/app.ts') {
      return features.database
        ? 'templates/api/src/app.with-database.ts'
        : 'templates/api/src/app.standalone.ts';
    }
    if (rest === 'src/env.ts') {
      return features.database
        ? 'templates/api/src/env.with-database.ts'
        : 'templates/api/src/env.standalone.ts';
    }
    return `templates/api/${rest}`;
  }

  if (relative.startsWith('packages/database/')) {
    const rest = relative.slice('packages/database/'.length);
    if (!rest || rest === 'data' || rest.startsWith('data/')) {
      return null;
    }
    return `templates/database/${rest}`;
  }

  return null;
}

function sameContents(left, right) {
  try {
    return fs.readFileSync(left).equals(fs.readFileSync(right));
  } catch {
    return false;
  }
}

function syncFile(root, projectPath, relative, features) {
  if (shouldIgnore(relative)) {
    return;
  }

  const target = templateTarget(relative, features);
  if (!target) {
    return;
  }

  const from = path.join(projectPath, ...relative.split('/'));
  const to = path.join(root, ...target.split('/'));

  if (!fs.existsSync(from)) {
    if (fs.existsSync(to) && fs.statSync(to).isFile()) {
      fs.rmSync(to);
      console.log(`  − ${relative} → ${target}`);
    }
    return;
  }

  if (fs.statSync(from).isDirectory()) {
    return;
  }

  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (sameContents(from, to)) {
    return;
  }

  fs.copyFileSync(from, to);
  console.log(`  ↺ ${relative} → ${target}`);
}

function startPlaygroundSync(root, projectPath) {
  const features = inferFeatures(projectPath);
  const pending = new Map();

  console.log('  Watching playground → templates');
  console.log('  package.json and README stay in src/command/create.ts\n');

  const watcher = fs.watch(projectPath, { recursive: true }, (_event, filename) => {
    if (!filename) {
      return;
    }

    const relative = toPosix(filename);
    clearTimeout(pending.get(relative));
    pending.set(
      relative,
      setTimeout(() => {
        pending.delete(relative);
        try {
          syncFile(root, projectPath, relative, features);
        } catch (error) {
          console.error(`  Failed to sync ${relative}: ${error.message}`);
        }
      }, 120)
    );
  });

  return () => {
    watcher.close();
    for (const timer of pending.values()) {
      clearTimeout(timer);
    }
  };
}

module.exports = { startPlaygroundSync, templateTarget };
