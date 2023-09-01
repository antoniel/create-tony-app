import basicTemplate from './basic';

export const templates = {
  basic: basicTemplate,
} as const;

export type TemplatesName = keyof typeof templates;

export const getTemplateConfig = (template: TemplatesName) =>
  templates[template];
