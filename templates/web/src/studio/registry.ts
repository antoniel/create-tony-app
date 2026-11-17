import { componentIndexes, type ComponentIndex } from "../lib/pages";
import { type Level, type Point } from "./model";

import { clusterOf } from "./clusters";
import { arrange } from "./layout";

export interface DesignNode {
  cluster: string;
  id: string;
  label: string;
  level: Level;
  dependencies: string[];
  component?: ComponentIndex;
  source: string;
}
// Read at build time. Connections describe local source imports, not inferred visual similarity.
const sources = import.meta.glob("../components/ui/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
});
const organisms: readonly ComponentIndex[] = [
  "dialog",
  "drawer",
  "file-upload",
  "floating-panel",
  "color-picker",
  "carousel",
  "table",
];
const molecules: readonly ComponentIndex[] = [
  "accordion",
  "action-bar",
  "alert",
  "breadcrumb",
  "card",
  "checkbox-card",
  "combobox",
  "data-list",
  "empty-state",
  "field",
  "hover-card",
  "input-group",
  "menu",
  "number-input",
  "pagination",
  "password-input",
  "popover",
  "radio-card",
  "select",
  "splitter",
  "stat",
  "stepper-input",
  "steps",
  "tabs",
  "tags-input",
  "timeline",
  "toaster",
  "toggle-tip",
  "tooltip",
];
export function sourceDependencies(source: string): ComponentIndex[] {
  const imports = [...source.matchAll(/from\s+['"]\.\/([^'"]+)['"]/g)].map((match) => match[1]);
  return componentIndexes.filter((id) => imports.includes(id));
}
export const nodes: DesignNode[] = [
  {
    id: "tokens",
    label: "Design tokens",
    level: "Foundations",
    cluster: "Tokens",
    dependencies: [],
    source: "src/theme/draft.ts",
  },
  ...componentIndexes.map((id): DesignNode => ({
    id,
    label: id.replaceAll("-", " "),
    component: id,
    cluster: clusterOf(id),
    level: organisms.includes(id) ? "Organisms" : molecules.includes(id) ? "Molecules" : "Atoms",
    dependencies: sourceDependencies(String(sources[`../components/ui/${id}.tsx`] ?? "")),
    source: `src/components/ui/${id}.tsx`,
  })),
  {
    id: "component-detail",
    label: "Component detail",
    level: "Templates",
    cluster: "Page structures",
    dependencies: ["code"],
    source: "src/routes/components/$index.tsx",
  },
  {
    id: "component-gallery",
    label: "Component gallery",
    level: "Pages",
    cluster: "Screens",
    dependencies: [...componentIndexes],
    source: "src/routes/components.tsx",
  },
];
export const layout = arrange(nodes, {}).positions;
export function positionOf(node: DesignNode, positions: Record<string, Point>): Point {
  return positions[node.id] ?? layout[node.id];
}
