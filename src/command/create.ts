import chalk from 'chalk';
import { Input, Select } from 'enquirer';
import { $ } from 'execa';
import * as fs from 'fs-extra';
import ora, { Ora } from 'ora';
import path from 'path';
import shell from 'shelljs';
import getInstallArgs from '../getInstallArgs';
import getInstallCmd from '../getInstallCmd';
import logError from '../logError';
import * as Messages from '../messages';
import { getTemplateConfig, templates, TemplatesName } from '../templates';
import { Template } from '../templates/template';
import { composePackageJson } from '../templates/utils';
import { safePackageName } from '../utils';

const $$ = $({stdio: 'inherit'});
export const create = async (pkg: string) => {
  logBrand();
  const template = await askSelectTemplate();
  const templateConfig = getTemplateConfig(template);
  await copyTemplates(template, templateConfig, pkg);
  await installDependencies(templateConfig, pkg);
};

async function copyTemplates(
  template: string,
  templateConfig: Template,
  pkg: string
) {
  const bootSpinner = ora(`Creating ${chalk.bold.green(pkg)}...`);
  const projectPath = await getProjectPath(pkg, bootSpinner);
  try {
    bootSpinner.start();
    await fs.copy(
      path.resolve(__dirname, `../../templates/${template}`),
      projectPath,
      {
        overwrite: true,
      }
    );
    await fixGitIgnore(projectPath);
    let { author } = await updateLicenseYearAndAuthor(projectPath, bootSpinner);

    await writePackageJson(templateConfig, projectPath, pkg, author);
    bootSpinner.succeed(`Created ${chalk.bold.green(pkg)}`);
    await Messages.start(pkg);
  } catch (error) {
    bootSpinner.fail(`Failed to create ${chalk.bold.red(pkg)}`);
    logError(error);
    process.exit(1);
  }
}

async function installDependencies(templateConfig: Template, pkg: string) {
  const installSpinner = ora(
    Messages.installing(templateConfig.dependencies.sort())
  ).start();
  try {
    const cmd = await getInstallCmd();
    await $$`${cmd} ${getInstallArgs(cmd, templateConfig.dependencies)}`;
    installSpinner.succeed('Installed dependencies');
    console.log(await Messages.start(pkg));
  } catch (error) {
    installSpinner.fail('Failed to install dependencies');
    logError(error);
    process.exit(1);
  }
}

async function writePackageJson(
  templateConfig: Template,
  projectPath: string,
  pkg: string,
  author: string
) {
  const generatePackageJson = composePackageJson(templateConfig);
  changeNodeProcessDirectory(projectPath);
  const pkgJson = generatePackageJson({ name: safePackageName(pkg), author });
  await fs.outputJSON(path.resolve(projectPath, 'package.json'), pkgJson);
}

function changeNodeProcessDirectory(projectPath: string) {
  process.chdir(projectPath);
}

async function updateLicenseYearAndAuthor(
  projectPath: string,
  bootSpinner: Ora
) {
  let license: string = await fs.readFile(
    path.resolve(projectPath, 'LICENSE'),
    { encoding: 'utf-8' }
  );

  license = license.replace(/<year>/, `${new Date().getFullYear()}`);

  // attempt to automatically derive author name
  let author = getAuthorName();

  if (!author) {
    bootSpinner.stop();
    const licenseInput = new Input({
      name: 'author',
      message: 'Who is the package author?',
    });
    author = await licenseInput.run();
    setAuthorName(author);
    bootSpinner.start();
  }

  license = license.replace(/<author>/, author.trim());

  await fs.writeFile(path.resolve(projectPath, 'LICENSE'), license, {
    encoding: 'utf-8',
  });
  return { license, author };
}
async function fixGitIgnore(projectPath: string) {
  await fs.move(
    path.resolve(projectPath, './gitignore'),
    path.resolve(projectPath, './.gitignore')
  );
}

async function askSelectTemplate(): Promise<TemplatesName> {
  return await new Select({
    message: 'Choose a template',
    choices: Object.keys(templates),
  }).run();
}

function getAuthorName() {
  let author = '';

  author = shell
    .exec('npm config get init-author-name', { silent: true })
    .stdout.trim();
  if (author) return author;

  author = shell
    .exec('git config --global user.name', { silent: true })
    .stdout.trim();
  if (author) {
    setAuthorName(author);
    return author;
  }

  author = shell
    .exec('npm config get init-author-email', { silent: true })
    .stdout.trim();
  if (author) return author;

  author = shell
    .exec('git config --global user.email', { silent: true })
    .stdout.trim();
  if (author) return author;

  return author;
}
function setAuthorName(author: string) {
  shell.exec(`npm config set init-author-name "${author}"`, { silent: true });
}

const logBrand = () =>
  console.log(
    chalk.blue(`
:::::::::   ::::::::  :::     :::  ::      :::
  :+:     :+:    :+:  :+:+    :+:  :+:    :+:
  +:+     +:+    +:+  +:+ +:  +:+   +:+  +:+
  +#+     +#+    +:+  +#:  :+:+#+    +#++:+    😁 
  +#+     +#+    +#+  +#+     +#+     +#+
  #+#     #+#    #+#  #+#     #+#     #+#
  ###     #########   ###     ###    ###
`)
  );

const getProjectPath = async (pkg: string, bootSpinner: Ora) => {
  const realPath = await fs.realpath(process.cwd());
  async function getProjectPathUtil(projectPath: string): Promise<string> {
    const exists = await fs.pathExists(projectPath);
    if (!exists) {
      return projectPath;
    }

    bootSpinner.fail(`Failed to create ${chalk.bold.red(pkg)}`);
    const prompt = new Input({
      message: `A folder named ${chalk.bold.red(
        pkg
      )} already exists! ${chalk.bold('Choose a different name')}`,
      initial: pkg + '-1',
      result: (v: string) => v.trim(),
    });

    pkg = await prompt.run();
    projectPath = (await fs.realpath(process.cwd())) + '/' + pkg;
    bootSpinner.start(`Creating ${chalk.bold.green(pkg)}...`);
    return await getProjectPathUtil(projectPath); // recursion!
  }
  return await getProjectPathUtil(realPath + '/' + pkg);
};
