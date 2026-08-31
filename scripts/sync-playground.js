const fs = require('fs');
const path = require('path');

const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', '.output', '.turbo', 'data', 'fixtures']);
const IGNORED_FILES = new Set([
  'package.json',
  'routeTree.gen.ts',
  '.env',
  'bun.lock',
  'bun.lockb',
  'package-lock.json',
  'README.md',
]);

// App-only playground files. They map onto templates but must not become the starter.
const APP_ONLY_PREFIXES = [
  'apps/api/src/modules/bundles/',
  'apps/web/src/modules/bundles/',
  'apps/web/src/routes/bundles/',
];
const APP_ONLY_FILES = new Set([
  'apps/api/src/app.ts',
  'apps/web/src/routes/-app-sidebar.tsx',
  'packages/database/src/index.ts',
  'packages/database/src/schema.ts',
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
  return (
    !base ||
    IGNORED_FILES.has(base) ||
    APP_ONLY_FILES.has(relative) ||
    APP_ONLY_PREFIXES.some((prefix) => relative.startsWith(prefix)) ||
    base.endsWith('.log') ||
    base.endsWith('.tsbuildinfo') ||
    /\.db(?:-|$)/.test(base)
  );
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
    if (!rest || rest === 'data' || rest.startsWith('data/') || /\.db(?:-|$)/.test(rest)) {
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

function walkFiles(dir, relativePrefix, visit) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const relative = relativePrefix ? `${relativePrefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) {
        continue;
      }
      walkFiles(path.join(dir, entry.name), relative, visit);
      continue;
    }
    visit(relative);
  }
}

function syncPlayground(root, projectPath) {
  const features = inferFeatures(projectPath);
  walkFiles(projectPath, '', (relative) => {
    syncFile(root, projectPath, relative, features);
  });
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

function resolvePlayground(root, projectName) {
  const playground = path.join(root, '.playground');
  const projectPath = path.join(playground, projectName);

  if (!fs.existsSync(projectPath)) {
    throw new Error(`Playground not found: ${projectPath}`);
  }

  return projectPath;
}

function main() {
  const root = path.resolve(__dirname, '..');
  const args = process.argv.slice(2).filter((arg) => arg !== '--');
  const watch = args.includes('--watch');
  const projectName = args.find((arg) => !arg.startsWith('--')) || 'tony-pipelines';
  const projectPath = resolvePlayground(root, projectName);

  console.log(`  Sync ${projectPath} → templates\n`);
  syncPlayground(root, projectPath);

  if (!watch) {
    return;
  }

  const stop = startPlaygroundSync(root, projectPath);
  process.on('SIGINT', () => {
    stop();
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    stop();
    process.exit(0);
  });
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`  ${error.message}`);
    process.exit(1);
  }
}

module.exports = { startPlaygroundSync, syncPlayground, templateTarget };
