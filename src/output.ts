import chalk from 'chalk';

export const cmd = (cmd: string) => {
  return chalk.bold(chalk.cyan(cmd));
};
