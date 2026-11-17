import type { ComponentIndex } from "../lib/pages";

// Functional clusters complement atomic levels; they do not invent dependency edges.
export const componentClusters = {
  Actions: [
    "button",
    "close-button",
    "icon-button",
    "link-button",
    "toggle",
    "action-bar",
    "clipboard",
  ],
  Inputs: [
    "input",
    "textarea",
    "native-select",
    "number-input",
    "password-input",
    "pin-input",
    "stepper-input",
    "tags-input",
    "field",
    "input-group",
    "slider",
    "rating",
    "color-picker",
    "file-upload",
  ],
  Selection: [
    "checkbox",
    "checkbox-card",
    "radio",
    "radio-card",
    "switch",
    "segmented-control",
    "select",
    "combobox",
  ],
  Feedback: [
    "alert",
    "badge",
    "progress",
    "progress-circle",
    "spinner",
    "skeleton",
    "empty-state",
    "toaster",
    "status",
    "stat",
  ],
  Content: ["avatar", "code", "heading", "kbd", "prose", "blockquote", "tag", "qr-code"],
  Navigation: ["accordion", "breadcrumb", "tabs", "pagination", "steps"],
  Layout: [
    "card",
    "separator",
    "splitter",
    "data-list",
    "table",
    "timeline",
    "carousel",
    "floating-panel",
  ],
  Overlays: ["dialog", "drawer", "popover", "hover-card", "menu", "tooltip", "toggle-tip"],
} satisfies Record<string, readonly ComponentIndex[]>;
export function clusterOf(id: ComponentIndex): string {
  return (
    Object.entries(componentClusters).find(([, members]) =>
      (members as readonly string[]).includes(id),
    )?.[0] ?? "Content"
  );
}
