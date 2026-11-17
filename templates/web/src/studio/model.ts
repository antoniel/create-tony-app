import { projectDraft } from "../theme/design-tokens";
import { componentIndexes, type ComponentIndex } from "../lib/pages";

export const levels = [
  "Foundations",
  "Atoms",
  "Molecules",
  "Organisms",
  "Templates",
  "Pages",
] as const;
export type Level = (typeof levels)[number];
export interface Appearance {
  radius: number;
  padding: number;
  background: string;
  color: string;
}
export interface Point {
  x: number;
  y: number;
}
export interface StudioDocument {
  version: 1;
  seed: string;
  accent: string;
  font: "Inter" | "Georgia" | "monospace";
  appearance: Partial<Record<ComponentIndex, Partial<Appearance>>>;
  positions: Record<string, Point>;
  hidden: string[];
}
export const initialDocument: StudioDocument = {
  version: 1,
  seed: projectDraft.seed,
  accent: projectDraft.accent,
  font: projectDraft.fonts.body.startsWith("Georgia")
    ? "Georgia"
    : projectDraft.fonts.body.includes("monospace")
      ? "monospace"
      : "Inter",
  appearance: {},
  positions: {},
  hidden: [],
};
export const initialAppearance: Appearance = {
  radius: 8,
  padding: 12,
  background: "#ffffff",
  color: "#222222",
};
export const storageKey = "tony.design-studio.v1";
export const cardWidth = 320;
export const cardHeight = 280;
export function isHex(value: unknown): value is string {
  return typeof value === "string" && /^#[\da-f]{6}$/i.test(value);
}
function object(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function bounded(value: unknown, min: number, max: number): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}
export function parseDocument(text: string): StudioDocument {
  const value: unknown = JSON.parse(text);
  if (
    !object(value) ||
    value.version !== 1 ||
    !isHex(value.seed) ||
    !isHex(value.accent) ||
    !["Inter", "Georgia", "monospace"].includes(String(value.font)) ||
    !object(value.appearance) ||
    !object(value.positions) ||
    !Array.isArray(value.hidden) ||
    !value.hidden.every((id) => typeof id === "string" && id.length < 100)
  )
    throw new Error("Invalid design document");
  const appearance: StudioDocument["appearance"] = {};
  for (const id of componentIndexes) {
    const entry = value.appearance[id];
    if (entry === undefined) continue;
    if (!object(entry)) throw new Error(`Invalid appearance: ${id}`);
    const style: Partial<Appearance> = {};
    for (const key of ["radius", "padding"] as const) {
      if (entry[key] === undefined) continue;
      if (!bounded(entry[key], 0, 64)) throw new Error(`Invalid appearance: ${id}`);
      style[key] = entry[key];
    }
    for (const key of ["background", "color"] as const) {
      if (entry[key] === undefined) continue;
      if (!isHex(entry[key])) throw new Error(`Invalid appearance: ${id}`);
      style[key] = entry[key];
    }
    appearance[id] = style;
  }
  const positions: Record<string, Point> = {};
  for (const [id, point] of Object.entries(value.positions)) {
    if (
      !/^[a-z][a-z0-9-]{0,99}$/.test(id) ||
      !object(point) ||
      !bounded(point.x, -100000, 100000) ||
      !bounded(point.y, -100000, 100000)
    )
      throw new Error("Invalid node position");
    positions[id] = { x: point.x, y: point.y };
  }
  return {
    version: 1,
    seed: value.seed,
    accent: value.accent,
    font: value.font === "Georgia" ? "Georgia" : value.font === "monospace" ? "monospace" : "Inter",
    appearance,
    positions,
    hidden: value.hidden,
  };
}
export interface History<T> {
  past: T[];
  present: T;
  future: T[];
}
export function commit<T>(history: History<T>, next: T): History<T> {
  if (JSON.stringify(next) === JSON.stringify(history.present)) return history;
  return { past: [...history.past.slice(-49), history.present], present: next, future: [] };
}
export function undo<T>(history: History<T>): History<T> {
  if (!history.past.length) return history;
  return {
    past: history.past.slice(0, -1),
    present: history.past[history.past.length - 1],
    future: [history.present, ...history.future],
  };
}
export function redo<T>(history: History<T>): History<T> {
  if (!history.future.length) return history;
  return {
    past: [...history.past, history.present],
    present: history.future[0],
    future: history.future.slice(1),
  };
}
export function appearanceCSS(appearance: StudioDocument["appearance"]) {
  return componentIndexes
    .flatMap((id) => {
      const style = appearance[id];
      if (!style) return [];
      const declarations = [
        style.radius === undefined ? "" : `border-radius: ${style.radius}px !important;`,
        style.padding === undefined ? "" : `padding: ${style.padding}px !important;`,
        style.background === undefined ? "" : `background: ${style.background} !important;`,
        style.color === undefined ? "" : `color: ${style.color} !important;`,
      ]
        .filter(Boolean)
        .join(" ");
      // Validated IDs and hex/numeric values only; no arbitrary CSS or code evaluation.
      return [
        `.chakra-${id}, .chakra-${id}__root, [data-design-component="${id}"], [data-design-component="${id}"] :is(button,input,textarea,select,[data-scope][data-part="root"]) { ${declarations} }`,
      ];
    })
    .join("\n");
}

export function fontStack(font: StudioDocument["font"]): string {
  if (font === "Georgia") return 'Georgia, "Times New Roman", serif';
  if (font === "monospace") return "ui-monospace, SFMono-Regular, monospace";
  return '"Inter", Helvetica, Arial, sans-serif';
}
