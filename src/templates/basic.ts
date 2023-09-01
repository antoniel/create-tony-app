import { Template } from './template';

const basicTemplate: Template = {
  name: 'basic',
  dependencies: ['tsup', 'tsx', 'vite', 'vitest', 'typescript'],
  packageJson: {
    // name: safeName,
    version: '0.1.0',
    license: 'MIT',
    // author: author,
    main: './dist/index.cjs',
    module: './dist/index.mjs',
    exports: {
      './package.json': './package.json',
      '.': {
        import: './dist/index.mjs',
        require: './dist/index.cjs',
      },
    },
    // module: `dist/${safeName}.mjs`,
    typings: `dist/index.d.ts`,
    files: ['dist', 'src'],
    engines: {
      node: '>=14',
    },
    scripts: {
      start: 'tsx watch src/index.ts',
      build: 'tsup src/index.ts --format=esm',
      test: 'vitest',
      prepare: 'build',
    },
    peerDependencies: {},
    prettier: {
      printWidth: 80,
      semi: false,
      singleQuote: true,
      trailingComma: 'es5',
    },
  },
};

export default basicTemplate;
