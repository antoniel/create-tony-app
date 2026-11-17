import { expect, test } from "bun:test";
import {
  appearanceCSS,
  commit,
  initialDocument,
  parseDocument,
  redo,
  undo,
  type History,
} from "../templates/web/src/studio/model";

test("backup round-trips all persisted data and rejects untrusted styling/coordinates", () => {
  const document = {
    ...initialDocument,
    positions: { button: { x: -120, y: 70 } },
    appearance: { button: { radius: 12, padding: 8, color: "#123456", background: "#ffffff" } },
  };
  expect(parseDocument(JSON.stringify(document))).toEqual(document);
  for (const bad of [
    { ...document, version: 99 },
    { ...document, seed: "</style><script>alert(1)</script>" },
    { ...document, positions: { button: { x: "12", y: 20 } } },
    { ...document, positions: { button: { x: 100001, y: 20 } } },
    { ...document, appearance: { button: { ...document.appearance.button, radius: -1 } } },
    {
      ...document,
      appearance: {
        button: { ...document.appearance.button, background: "url(https://example.com)" },
      },
    },
  ])
    expect(() => parseDocument(JSON.stringify(bad))).toThrow();
  expect(appearanceCSS(document.appearance)).toContain("border-radius: 12px");
});

test("history supports undo, redo, branch edits, no-op edits and bounded memory", () => {
  let history: History<number> = { past: [], present: 0, future: [] };
  expect(undo(history)).toBe(history);
  expect(commit(history, 0)).toBe(history);
  history = commit(commit(history, 1), 2);
  expect(undo(history)).toEqual({ past: [0], present: 1, future: [2] });
  expect(redo(undo(history))).toEqual(history);
  expect(commit(undo(history), 3)).toEqual({ past: [0, 1], present: 3, future: [] });
  for (let i = 3; i < 100; i++) history = commit(history, i);
  expect(history.past).toHaveLength(50);
});

test("changing one property does not replace unrelated component styles", () => {
  const doc = { ...initialDocument, appearance: { button: { radius: 24 } } };
  expect(parseDocument(JSON.stringify(doc))).toEqual(doc);
  const css = appearanceCSS(doc.appearance);
  expect(css).toContain("border-radius: 24px");
  expect(css).not.toContain("background:");
  expect(css).not.toContain("padding:");
});
