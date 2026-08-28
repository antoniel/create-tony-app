import chalk from 'chalk';
import readline from 'readline';

export const FEATURES = ['web', 'api', 'database'] as const;
export type Feature = (typeof FEATURES)[number];

interface FeatureNode {
  kind: 'feature';
  feature: Feature;
  label: string;
  path: string;
  description: string;
}

interface GroupNode {
  kind: 'group';
  label: string;
  path: string;
  description: string;
  children: TreeNode[];
}

type TreeNode = FeatureNode | GroupNode;

interface DisplayRow {
  id: string;
  focusable: boolean;
  feature?: Feature;
  label: string;
  connector: string;
  path: string;
  description: string;
}

function buildTree(projectName: string): GroupNode {
  return {
    kind: 'group',
    label: `${projectName}/`,
    path: projectName,
    description: 'Bun + Turborepo workspace',
    children: [
      {
        kind: 'group',
        label: 'apps/',
        path: 'apps',
        description: 'Runnable applications',
        children: [
          {
            kind: 'feature',
            feature: 'web',
            label: 'web/',
            path: 'apps/web',
            description: 'TanStack Start · React Query · Chakra UI',
          },
          {
            kind: 'feature',
            feature: 'api',
            label: 'api/',
            path: 'apps/api',
            description: 'Elysia · typed HTTP API',
          },
        ],
      },
      {
        kind: 'group',
        label: 'packages/',
        path: 'packages',
        description: 'Shared workspace packages',
        children: [
          {
            kind: 'feature',
            feature: 'database',
            label: 'database/',
            path: 'packages/database',
            description: 'Drizzle · PostgreSQL',
          },
        ],
      },
    ],
  };
}

function flattenTree(node: TreeNode, prefix = '', isLast = true, isRoot = true): DisplayRow[] {
  const row: DisplayRow = {
    id: node.path,
    focusable: node.kind === 'feature',
    feature: node.kind === 'feature' ? node.feature : undefined,
    label: node.label,
    connector: isRoot ? '' : `${prefix}${isLast ? '└─ ' : '├─ '}`,
    path: node.path,
    description: node.description,
  };

  if (node.kind === 'feature') {
    return [row];
  }

  const childPrefix = isRoot ? '' : `${prefix}${isLast ? '   ' : '│  '}`;
  return [
    row,
    ...node.children.flatMap((child, index) =>
      flattenTree(child, childPrefix, index === node.children.length - 1, false)
    ),
  ];
}

function renderRow(row: DisplayRow, focused: boolean, selected: Set<Feature>) {
  const pointer = row.focusable ? (focused ? chalk.cyan('❯') : ' ') : ' ';
  const mark =
    row.feature === undefined
      ? ''
      : `${selected.has(row.feature) ? chalk.green('●') : chalk.dim('○')} `;
  const label = focused && row.focusable
    ? chalk.cyan(row.label)
    : row.focusable
      ? row.label
      : chalk.dim(row.label);

  return `   ${pointer} ${row.connector}${mark}${label}`;
}

function renderPanel(row: DisplayRow) {
  const bodyWidth = Math.max(39, row.description.length);
  const width = bodyWidth + 4;
  const title = `─ ${row.path} `;
  const top = `╭${title}${'─'.repeat(Math.max(0, width - 2 - title.length))}╮`;
  const body = `│ ${row.description.padEnd(bodyWidth)} │`;
  const bottom = `╰${'─'.repeat(width - 2)}╯`;

  return [top, body, bottom].map((line) => `     ${chalk.dim(line)}`);
}

export function renderComposeTree(options: {
  projectName: string;
  selected: Iterable<Feature>;
  focusedFeature: Feature;
  error?: string;
  submitted?: boolean;
}) {
  const selected = new Set(options.selected);
  const rows = flattenTree(buildTree(options.projectName));
  const focused = rows.find((row) => row.feature === options.focusedFeature) ?? rows.find((row) => row.focusable);

  const header = options.submitted
    ? `   ${chalk.green('✔')} Compose ${chalk.bold(options.projectName)}`
    : `   ${chalk.green('?')} Compose ${chalk.bold(options.projectName)}`;

  const tree = rows.map((row) =>
    renderRow(row, !options.submitted && row.id === focused?.id, selected)
  );

  const lines = ['', header, '', ...tree];

  if (!options.submitted && focused) {
    lines.push('', ...renderPanel(focused));
  }

  const count = selected.size;
  const total = FEATURES.length;
  lines.push('');
  lines.push(`     ${chalk.dim(`${count} of ${total} folders selected`)}`);

  if (!options.submitted) {
    lines.push(
      options.error
        ? `     ${chalk.red(options.error)}`
        : `     ${chalk.dim('Space toggle · Enter create')}`
    );
  }

  return lines.join('\n');
}

export async function promptComposeTree(projectName: string): Promise<Feature[]> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error('Interactive compose tree requires a TTY.');
  }

  const rows = flattenTree(buildTree(projectName)).filter((row) => row.focusable);
  let focusIndex = 0;
  const selected = new Set<Feature>(FEATURES);
  let error = '';
  let renderedLines = 0;

  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdout.write('\x1B[?25l');

  const paint = (submitted = false) => {
    const output = renderComposeTree({
      projectName,
      selected,
      focusedFeature: rows[focusIndex].feature!,
      error,
      submitted,
    });
    const nextLines = output.split('\n').length;

    if (renderedLines > 0) {
      process.stdout.write(`\x1B[${renderedLines}A\x1B[0J`);
    }

    process.stdout.write(`${output}\n`);
    renderedLines = nextLines;
  };

  const restoreTerminal = () => {
    process.stdout.write('\x1B[?25h');
    process.stdin.setRawMode(false);
    process.stdin.pause();
  };

  paint();

  return new Promise((resolve, reject) => {
    let settled = false;

    const finish = (callback: () => void) => {
      if (settled) {
        return;
      }
      settled = true;
      process.stdin.off('keypress', onKeypress);
      restoreTerminal();
      callback();
    };

    const onKeypress = (_input: string, key: readline.Key) => {
      if ((key.ctrl && key.name === 'c') || key.name === 'escape') {
        finish(() => {
          process.stdout.write('\n');
          reject(new Error('Cancelled'));
        });
        return;
      }

      if (key.name === 'up' || key.name === 'k') {
        focusIndex = (focusIndex - 1 + rows.length) % rows.length;
        error = '';
        paint();
        return;
      }

      if (key.name === 'down' || key.name === 'j') {
        focusIndex = (focusIndex + 1) % rows.length;
        error = '';
        paint();
        return;
      }

      if (key.name === 'space') {
        const feature = rows[focusIndex].feature!;
        if (selected.has(feature)) {
          selected.delete(feature);
        } else {
          selected.add(feature);
        }
        error = '';
        paint();
        return;
      }

      if (key.name === 'return') {
        if (selected.size === 0) {
          error = 'Select at least one folder';
          paint();
          return;
        }

        finish(() => {
          paint(true);
          resolve(FEATURES.filter((feature) => selected.has(feature)));
        });
      }
    };

    process.stdin.on('keypress', onKeypress);
  });
}
