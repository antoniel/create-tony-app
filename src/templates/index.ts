import basicTemplate from './basic';
import reactTemplate from './react';
import storybookTemplate from './react-with-storybook';

export const templates = {
  basic: basicTemplate,
  react: reactTemplate,
  'react-with-storybook': storybookTemplate,
} as const;

export type TemplatesName = keyof typeof templates;

export const getTemplateConfig = (template: TemplatesName) =>
  templates[template];
