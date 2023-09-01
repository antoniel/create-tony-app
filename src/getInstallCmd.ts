import execa from 'execa';

let cachedCmd: InstallCommand;

export type InstallCommand = 'yarn' | 'npm' | 'pnpm';

export default async function getInstallCmd(): Promise<InstallCommand> {
  if (cachedCmd) {
    return cachedCmd;
  }

  if (await checkPnpm()) {
    cachedCmd = 'pnpm';
    return cachedCmd;
  }

  if (await checkYarn()) {
    cachedCmd = 'yarn';
    return cachedCmd;
  }

  cachedCmd = 'npm';
  return cachedCmd;
}
const checkYarn = async () => {
  try {
    await execa('yarnpkg', ['--version']);
    return true;
  } catch (e) {}
  return false;
};

const checkPnpm = async () => {
  try {
    await execa('pnpm', ['--version']);
    return true;
  } catch (e) {}
  return false;
};
