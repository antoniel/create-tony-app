import basicTemplate from './basic';
import { reactTailwind } from './react-tailwind';

export const templates = {
  basic: basicTemplate,
  "react-tailwind": reactTailwind
} as const;

export type TemplatesName = keyof typeof templates;

export const getTemplateConfig = (template: TemplatesName) =>
  templates[template];
