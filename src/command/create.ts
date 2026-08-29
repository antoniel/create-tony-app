import chalk from 'chalk';
import { Input } from 'enquirer';
import execa from 'execa';
import * as fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import { promptComposeTree, type Feature } from './compose-tree';

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
    await execa('git', ['init'], { cwd: projectPath });
    spinner.text = 'Formatting the generated project...';
    await execa('bun', ['run', 'format'], { cwd: projectPath });
    if (selection.features.includes('database')) {
      spinner.text = 'Starting PGlite...';
      await execa('bun', ['run', 'db:ensure'], { cwd: projectPath });
    }
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

  const safeName = toPackageName(name);
  if (!safeName) {
    throw new Error('Project name must contain letters or numbers.');
  }

  return {
    projectName: safeName,
    features: await promptComposeTree(safeName),
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
  const databaseScripts = selection.features.includes('database')
    ? {
        'db:ensure': 'bun run --filter @app/database db:ensure',
        'db:generate': 'bun run --filter @app/database db:generate',
        'db:migrate': 'bun run --filter @app/database db:migrate',
        'db:push': 'bun run --filter @app/database db:push',
        'db:studio': 'bun run --filter @app/database db:studio',
      }
    : {};

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
      ...databaseScripts,
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
    await fs.outputJSON(
      path.join(projectPath, 'apps/web/package.json'),
      webPackageJson(selected.has('api')),
      { spaces: 2 }
    );
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

  if (selected.has('api') || selected.has('database')) {
    const envFile = rootEnvFile(selected.has('database'));
    await fs.outputFile(path.join(projectPath, '.env.example'), envFile);
    await fs.outputFile(path.join(projectPath, '.env'), envFile);
    await fs.remove(path.join(projectPath, 'packages/database/.env.example')).catch(() => undefined);
  }

  if (selected.has('database')) {
    await appendDatabaseReadme(projectPath);
  }

  if (selected.has('api')) {
    const source = selected.has('database')
      ? 'app.with-database.ts'
      : 'app.standalone.ts';
    const envSource = selected.has('database')
      ? 'env.with-database.ts'
      : 'env.standalone.ts';
    const apiSourcePath = path.join(projectPath, 'apps/api/src');

    await fs.move(path.join(apiSourcePath, source), path.join(apiSourcePath, 'app.ts'), {
      overwrite: true,
    });
    await fs.move(path.join(apiSourcePath, envSource), path.join(apiSourcePath, 'env.ts'), {
      overwrite: true,
    });
    await fs.remove(
      path.join(
        apiSourcePath,
        selected.has('database')
          ? 'app.standalone.ts'
          : 'app.with-database.ts'
      )
    );
    await fs.remove(
      path.join(
        apiSourcePath,
        selected.has('database')
          ? 'env.standalone.ts'
          : 'env.with-database.ts'
      )
    );

    if (!selected.has('database')) {
      await fs.remove(path.join(apiSourcePath, 'modules/users'));
    }
  }

  if (selected.has('web')) {
    const source = selected.has('api') ? 'index.with-api.tsx' : 'index.standalone.tsx';
    const webSourcePath = path.join(projectPath, 'apps/web/src');
    const routesPath = path.join(webSourcePath, 'routes');
    await fs.move(path.join(routesPath, source), path.join(routesPath, 'index.tsx'), {
      overwrite: true,
    });
    await fs.remove(path.join(routesPath, selected.has('api') ? 'index.standalone.tsx' : 'index.with-api.tsx'));

    if (!selected.has('api')) {
      await fs.remove(path.join(webSourcePath, 'lib'));
      await fs.remove(path.join(webSourcePath, 'modules'));
    } else if (!selected.has('database')) {
      await fs.remove(path.join(webSourcePath, 'modules/users'));
    }
  }
}

async function appendDatabaseReadme(projectPath: string) {
  await fs.appendFile(
    path.join(projectPath, 'README.md'),
    `
## Database

The workspace uses PGlite, an in-process Postgres. It starts on first create and again whenever the API imports \`@app/database\`. Point \`DATABASE_URL\` in the root \`.env\` at \`packages/database/data\`. Change that one value when you move off PGlite.

Run Drizzle from the workspace root:

- \`bun run db:ensure\` — create the PGlite data directory and starter tables
- \`bun run db:generate\` — generate migrations from the schema
- \`bun run db:migrate\` — apply generated migrations
- \`bun run db:push\` — push schema changes directly
- \`bun run db:studio\` — open Drizzle Studio
`
  );
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

function webPackageJson(withApi: boolean) {
  return {
    name: '@app/web',
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite dev --port 3000',
      build: 'chakra typegen src/theme/index.ts && vite build',
      'generate-routes': 'tsr generate',
      typegen: 'chakra typegen src/theme/index.ts',
      postinstall: 'chakra typegen src/theme/index.ts',
      lint: 'oxlint .',
      typecheck: 'tsr generate && chakra typegen src/theme/index.ts && tsc --noEmit',
    },
    dependencies: {
      ...(withApi ? { '@elysia/eden': '^1.4.10' } : {}),
      '@chakra-ui/react': '^3.36.1',
      '@phosphor-icons/react': '^2.1.10',
      '@emotion/react': '^11.14.0',
      '@tanstack/react-query': '^5.102.8',
      '@tanstack/react-router': '^1.170.32',
      '@tanstack/react-router-ssr-query': '^1.167.2',
      '@tanstack/react-start': '^1.168.49',
      nitro: '3.0.260610-beta',
      'next-themes': '^0.4.6',
      nuqs: '^2.10.1',
      react: '^19.2.0',
      'react-dom': '^19.2.0',
    },
    devDependencies: {
      ...(withApi
        ? { '@app/api': 'workspace:*', elysia: '^1.4.30' }
        : {}),
      '@chakra-ui/cli': '^3.36.1',
      '@tanstack/router-cli': '^1.167.33',
      '@types/react': '^19.2.0',
      '@types/react-dom': '^19.2.0',
      '@vitejs/plugin-react': '^6.1.0',
      'code-inspector-plugin': '^2.0.8',
      vite: '^8.2.2',
    },
  };
}

function apiPackageJson(withDatabase: boolean) {
  return {
    name: '@app/api',
    private: true,
    type: 'module',
    exports: { '.': './src/app.ts' },
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
      'db:ensure': 'bun --env-file=../../.env src/index.ts',
      'db:generate': 'bun --env-file=../../.env x drizzle-kit generate',
      'db:migrate': 'bun --env-file=../../.env x drizzle-kit migrate',
      'db:push': 'bun --env-file=../../.env x drizzle-kit push',
      'db:studio': 'bun --env-file=../../.env x drizzle-kit studio',
    },
    dependencies: {
      '@electric-sql/pglite': '^0.5.8',
      'drizzle-orm': '^0.45.2',
    },
    devDependencies: {
      'drizzle-kit': '^0.31.10',
    },
  };
}

function rootEnvFile(withDatabase: boolean) {
  const lines = ['PORT=3001'];
  if (withDatabase) {
    lines.push('DATABASE_URL=packages/database/data');
  }
  return `${lines.join('\n')}\n`;
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
    console.log(`\n  PGlite is ready in ${chalk.cyan('packages/database/data')}.`);
    console.log(`  Use ${chalk.cyan('bun run db:studio')} to browse it.`);
  }
  console.log();
}

function printBrand() {
  console.log(chalk.blue.bold('\n  Create Tony App\n'));
}
