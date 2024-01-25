import basicTemplate from './basic';
import { reactViteTailwind } from './react-vite-tailwind';

export const templates = {
  basic: basicTemplate,
  "react-vite-tailwind": reactViteTailwind
} as const;

export type TemplatesName = keyof typeof templates;

export const getTemplateConfig = (template: TemplatesName) =>
  templates[template];
