import chalk from 'chalk';
import { Input, MultiSelect } from 'enquirer';
import execa from 'execa';
import * as fs from 'fs-extra';
import ora from 'ora';
import path from 'path';

const FEATURES = ['web', 'api', 'database'] as const;
type Feature = (typeof FEATURES)[number];

interface ProjectSelection {
  projectName: string;
  features: Feature[];
}

export async function create(projectName?: string) {
  printBrand();

  const selection = await askProjectSelection(projectName);
  const projectPath = path.resolve(process.cwd(), selection.projectName);

  if (await fs.pathExists(projectPath)) {
    throw new Error(`The folder ${chalk.bold(selection.projectName)} already exists.`);
  }

  const spinner = ora(`Creating ${chalk.bold.green(selection.projectName)}...`).start();

  try {
    await generateProject(projectPath, selection);
    spinner.text = 'Installing dependencies with Bun...';
    await execa('bun', ['install'], { cwd: projectPath });
    spinner.text = 'Formatting the generated project...';
    await execa('bun', ['run', 'format'], { cwd: projectPath });
    spinner.succeed(`Created ${chalk.bold.green(selection.projectName)}`);
  } catch (error) {
    spinner.fail('Failed to create project');
    await fs.remove(projectPath);
    throw error;
  }

  printNextSteps(selection.projectName, selection.features);
}

async function askProjectSelection(projectName?: string): Promise<ProjectSelection> {
  const name = projectName?.trim() || (await new Input({
    name: 'projectName',
    message: 'Project name',
    initial: 'my-app',
    result: (value: string) => value.trim(),
    validate: (value: string) => value.trim().length > 0 || 'Enter a project name',
  }).run());

  const selectedFeatures = (await new MultiSelect({
    name: 'features',
    message: 'Select the folders to create',
    hint: 'Space to toggle · Enter to create',
    initial: ['web', 'api', 'database'],
    choices: [
      { role: 'separator', message: chalk.dim('apps/') },
      { name: 'web', message: '  web/       TanStack Start + React Query', enabled: true },
      { name: 'api', message: '  api/       Elysia', enabled: true },
      { role: 'separator', message: chalk.dim('packages/') },
      { name: 'database', message: '  database/  Drizzle + PostgreSQL', enabled: true },
    ],
    validate: (value: string[]) => value.length > 0 || 'Select at least one folder',
  }).run()) as string[];

  const safeName = toPackageName(name);
  if (!safeName) {
    throw new Error('Project name must contain letters or numbers.');
  }

  return {
    projectName: safeName,
    features: selectedFeatures.filter((feature): feature is Feature =>
      FEATURES.includes(feature as Feature)
    ),
  };
}

async function generateProject(projectPath: string, selection: ProjectSelection) {
  await fs.ensureDir(projectPath);
  await fs.copy(templatePath('root'), projectPath);

  for (const feature of selection.features) {
    const destination = feature === 'database'
      ? path.join(projectPath, 'packages/database')
      : path.join(projectPath, `apps/${feature}`);
    await fs.copy(templatePath(feature), destination);
  }

  await writeRootPackageJson(projectPath, selection);
  await writeFeaturePackageJson(projectPath, selection);
  await writeConditionalFiles(projectPath, selection.features);
  await renameGitIgnoreFiles(projectPath);
}

async function writeRootPackageJson(projectPath: string, selection: ProjectSelection) {
  await fs.outputJSON(path.join(projectPath, 'package.json'), {
    name: selection.projectName,
    private: true,
    packageManager: 'bun@1.3.14',
    workspaces: ['apps/*', 'packages/*'],
    scripts: {
      dev: 'turbo dev',
      build: 'turbo build',
      lint: 'turbo lint',
      format: 'oxfmt --write .',
      'format:check': 'oxfmt --check .',
      typecheck: 'turbo typecheck',
    },
    devDependencies: {
      '@types/bun': '^1.3.10',
      '@types/node': '^22.10.2',
      oxfmt: '^0.65.0',
      oxlint: '^1.80.0',
      turbo: '^2.10.12',
      typescript: '^5.7.3',
    },
  }, { spaces: 2 });
}

async function writeFeaturePackageJson(projectPath: string, selection: ProjectSelection) {
  const selected = new Set(selection.features);

  if (selected.has('web')) {
    await fs.outputJSON(path.join(projectPath, 'apps/web/package.json'), webPackageJson(), { spaces: 2 });
  }

  if (selected.has('api')) {
    await fs.outputJSON(path.join(projectPath, 'apps/api/package.json'), apiPackageJson(selected.has('database')), { spaces: 2 });
  }

  if (selected.has('database')) {
    await fs.outputJSON(path.join(projectPath, 'packages/database/package.json'), databasePackageJson(), { spaces: 2 });
  }
}

async function writeConditionalFiles(projectPath: string, features: Feature[]) {
  const selected = new Set(features);

  if (selected.has('database')) {
    await fs.move(
      path.join(projectPath, 'packages/database/.env.example'),
      path.join(projectPath, '.env.example')
    );
  }

  if (selected.has('api')) {
    const source = selected.has('database') ? 'index.with-database.ts' : 'index.standalone.ts';
    const sourcePath = path.join(projectPath, 'apps/api/src', source);
    await fs.move(sourcePath, path.join(projectPath, 'apps/api/src/index.ts'));
    await fs.remove(path.join(projectPath, 'apps/api/src', selected.has('database') ? 'index.standalone.ts' : 'index.with-database.ts'));
  }

  if (selected.has('web')) {
    const source = selected.has('api') ? 'index.with-api.tsx' : 'index.standalone.tsx';
    const routesPath = path.join(projectPath, 'apps/web/src/routes');
    await fs.move(path.join(routesPath, source), path.join(routesPath, 'index.tsx'));
    await fs.remove(path.join(routesPath, selected.has('api') ? 'index.standalone.tsx' : 'index.with-api.tsx'));
  }
}

async function renameGitIgnoreFiles(projectPath: string) {
  const files = await fs.readdir(projectPath);
  if (files.includes('gitignore')) {
    await fs.move(path.join(projectPath, 'gitignore'), path.join(projectPath, '.gitignore'));
  }
}

function templatePath(name: string) {
  return path.resolve(__dirname, `../../templates/${name}`);
}

function webPackageJson() {
  return {
    name: '@app/web',
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite dev --port 3000',
      build: 'vite build',
      'generate-routes': 'tsr generate',
      lint: 'oxlint .',
      typecheck: 'tsr generate && tsc --noEmit',
    },
    dependencies: {
      '@tanstack/react-query': '^5.102.8',
      '@tanstack/react-router': '^1.170.32',
      '@tanstack/react-router-with-query': '^1.130.17',
      '@tanstack/react-start': '^1.168.49',
      nitro: '3.0.260610-beta',
      react: '^19.2.0',
      'react-dom': '^19.2.0',
    },
    devDependencies: {
      '@tanstack/router-cli': '^1.167.33',
      '@types/react': '^19.2.0',
      '@types/react-dom': '^19.2.0',
      '@vitejs/plugin-react': '^6.1.0',
      vite: '^8.2.2',
    },
  };
}

function apiPackageJson(withDatabase: boolean) {
  return {
    name: '@app/api',
    private: true,
    type: 'module',
    scripts: {
      dev: 'bun --env-file=../../.env --watch src/index.ts',
      build: 'bun build src/index.ts --target bun --outdir dist',
      start: 'bun --env-file=../../.env dist/index.js',
      lint: 'oxlint .',
      typecheck: 'tsc --noEmit',
    },
    dependencies: {
      ...(withDatabase ? { '@app/database': 'workspace:*' } : {}),
      '@elysiajs/cors': '^1.4.1',
      elysia: '^1.4.30',
    },
    devDependencies: {},
  };
}

function databasePackageJson() {
  return {
    name: '@app/database',
    private: true,
    type: 'module',
    exports: { '.': './src/index.ts', './schema': './src/schema.ts' },
    scripts: {
      build: 'bun build src/index.ts --target bun --outdir dist',
      lint: 'oxlint .',
      typecheck: 'tsc --noEmit',
      'db:generate': 'bun --env-file=../../.env x drizzle-kit generate',
      'db:migrate': 'bun --env-file=../../.env x drizzle-kit migrate',
      'db:push': 'bun --env-file=../../.env x drizzle-kit push',
      'db:studio': 'bun --env-file=../../.env x drizzle-kit studio',
    },
    dependencies: {
      'drizzle-orm': '^0.45.2',
      postgres: '^3.4.8',
    },
    devDependencies: {
      'drizzle-kit': '^0.31.10',
    },
  };
}

function toPackageName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function printNextSteps(projectName: string, features: Feature[]) {
  console.log(`\n  ${chalk.dim('$')} cd ${projectName}`);
  console.log(`  ${chalk.dim('$')} bun dev`);
  if (features.includes('database')) {
    console.log(`\n  Copy ${chalk.cyan('.env.example')} to ${chalk.cyan('.env')} and set DATABASE_URL.`);
  }
  console.log();
}

function printBrand() {
  console.log(chalk.blue.bold('\n  Create Tony App\n'));
}
