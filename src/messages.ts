import chalk from 'chalk';
import getInstallCmd from './getInstallCmd';
import * as Output from './output';

export const installing = function (packages: string[]) {
  const pkgText = packages
    .map(function (pkg) {
      return `    ${chalk.cyan(chalk.bold(pkg))}`;
    })
    .join('\n');

  return `Installing npm modules:
${pkgText}
`;
};

export const start = async function (projectName: string) {
  const cmd = await getInstallCmd();

  const commands = {
    install: cmd === 'npm' ? `${cmd} run install` : 'yarn install',
    build: cmd === 'npm' ? `${cmd} run build` : 'yarn build',
    start: cmd === 'npm' ? `${cmd} run start` : 'yarn start',
    test: cmd === 'npm' ? `${cmd} run test` : 'yarn test',
  };

  return `
  ${chalk.green('Awesome!')} You're now ready to start coding.
  
  I already ran ${Output.cmd(commands.install)} for you, so your next steps are:
    ${Output.cmd(`cd ${projectName}`)}
  
  To start developing (rebuilds on changes):
    ${Output.cmd(commands.start)}
  
  To build for production:
    ${Output.cmd(commands.build)}

  To test your library with Jest:
    ${Output.cmd(commands.test)}
    
  Questions? Feedback? Please let me know!
  ${chalk.green('https://github.com/formium/tsdx/issues')}
`;
};
