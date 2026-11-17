"use client";

import { Button } from "@ui-sdk/react/button";
import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Code } from "../components/ui/code";
import { catalogPreview } from "../routes/components/-catalog";
import { brandSteps, draftFromSeed } from "../theme/draft";
import { useDesign } from "./design-provider";
import {
  appearanceCSS,
  fontStack,
  cardHeight,
  cardWidth,
  initialAppearance,
  initialDocument,
  isHex,
  levels,
  parseDocument,
  type Appearance,
} from "./model";
import { nodes, positionOf, type DesignNode } from "./registry";
import { createSceneRenderer, type RenderMode } from "./renderer";
import { studioViewport, type StudioViewport } from "./viewport";
import "./studio.css";

function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function ColorField({
  label,
  value,
  onCommit,
}: {
  label: string;
  value: string;
  onCommit: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <label className="studio-field">
      {label}
      <div className="studio-color">
        <span style={{ background: draft }} />
        <input
          aria-label={label}
          value={draft}
          maxLength={7}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
          onBlur={() => {
            if (isHex(draft)) onCommit(draft);
            else setDraft(value);
          }}
        />
      </div>
    </label>
  );
}
function NumberField({
  label,
  value,
  onCommit,
}: {
  label: string;
  value: number;
  onCommit: (value: number) => void;
}) {
  return (
    <label className="studio-field">
      {label}
      <input
        key={value}
        aria-label={label}
        type="number"
        min="0"
        max="64"
        defaultValue={value}
        onBlur={(event) => {
          const next = Number(event.target.value);
          if (Number.isFinite(next)) onCommit(Math.min(64, Math.max(0, next)));
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
      />
    </label>
  );
}
function NodeContent({ node }: { node: DesignNode }) {
  const { document } = useDesign();
  if (node.component) return catalogPreview(node.component);
  if (node.id === "tokens") {
    const draft = draftFromSeed(document.seed);
    return (
      <div className="studio-swatches">
        {brandSteps.map((step) => (
          <div
            key={step}
            style={{ background: draft.brand[step] }}
            title={`${step}: ${draft.brand[step]}`}
          />
        ))}
        <p>Brand · accent · typography</p>
      </div>
    );
  }
  if (node.id === "component-detail")
    return (
      <div className="studio-page-preview">
        <strong>Component detail</strong>
        <p>Title, source and an isolated interactive preview.</p>
        <Code>src/components/ui</Code>
      </div>
    );
  return (
    <div className="studio-page-preview">
      <strong>Your component library</strong>
      <p>{nodes.length - 3} components sharing one design language.</p>
      <Link to="/components">Open gallery ↗</Link>
    </div>
  );
}

export function DesignStudio() {
  const design = useDesign(),
    { document, update } = design;
  const [selected, setSelected] = useState<string | null>(null);
  const [measured, setMeasured] = useState(initialAppearance);
  const [query, setQuery] = useState("");
  const [isolated, setIsolated] = useState(false);
  const [interact, setInteract] = useState(false);
  const [mode, setMode] = useState<RenderMode>("Starting");
  const [zoom, setZoom] = useState(55);
  const [exportsOpen, setExportsOpen] = useState(false);
  const frame = useRef<HTMLDivElement>(null),
    world = useRef<HTMLDivElement>(null),
    sceneHost = useRef<HTMLDivElement>(null);
  const viewport = useRef<StudioViewport | null>(null);
  const renderer = useRef<ReturnType<typeof createSceneRenderer> | null>(null);
  const scene = useRef({ positions: document.positions, hidden: document.hidden, selected });
  const dragCleanup = useRef<(() => void) | null>(null);
  const picked = nodes.find((node) => node.id === selected);
  const filtered = nodes.filter((node) => node.label.toLowerCase().includes(query.toLowerCase()));
  const visible = nodes.filter(
    (node) => !document.hidden.includes(node.id) && (!isolated || node.id === selected),
  );
  const draw = useCallback(() => {
    const instance = viewport.current;
    if (!instance || !world.current) return;
    const view = instance.api.viewport.get();
    world.current.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`;
    renderer.current?.draw({ ...scene.current, viewport: view });
  }, []);
  useEffect(() => {
    const surface = frame.current,
      host = sceneHost.current;
    if (!surface || !host) return;
    const instance = studioViewport({ id: "studio-viewport", surface: () => surface });
    viewport.current = instance;
    renderer.current = createSceneRenderer(host, setMode);
    let zoomTimer: ReturnType<typeof setTimeout> | undefined;
    const unsubscribe = instance.subscribe(() => {
      draw();
      clearTimeout(zoomTimer);
      zoomTimer = setTimeout(
        () => setZoom(Math.round(instance.api.viewport.get().zoom * 100)),
        100,
      );
    });
    const wheel = (event: WheelEvent) => {
      if (
        event.target instanceof Element &&
        event.target.closest('[data-interactive="true"]') &&
        !event.ctrlKey &&
        !event.metaKey
      )
        return;
      instance.api.viewport.wheel(event);
    };
    surface.addEventListener("wheel", wheel, { passive: false });
    draw();
    return () => {
      dragCleanup.current?.();
      clearTimeout(zoomTimer);
      unsubscribe();
      surface.removeEventListener("wheel", wheel);
      instance.destroy();
      renderer.current?.destroy();
      viewport.current = null;
    };
  }, [draw]);
  useEffect(() => {
    scene.current = {
      positions: document.positions,
      hidden: isolated
        ? nodes.filter((node) => node.id !== selected).map((node) => node.id)
        : document.hidden,
      selected,
    };
    draw();
  }, [document.positions, document.hidden, isolated, selected, draw]);
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (
        event.target instanceof Element &&
        event.target.closest("input,textarea,select,[contenteditable]")
      )
        return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) design.redo();
        else design.undo();
      }
      if (event.key === "Escape") {
        setIsolated(false);
        setInteract(false);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [design.undo, design.redo]);
  useEffect(() => {
    const element = world.current?.querySelector(
      `[data-node="${selected}"] [data-design-component] :is(button,input,textarea,select,[data-part="root"])`,
    );
    if (!element) {
      setMeasured(initialAppearance);
      return;
    }
    const css = getComputedStyle(element);
    const hex = (value: string, fallback: string) => {
      const rgb = value.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      return rgb
        ? "#" +
            rgb
              .slice(1)
              .map((part) => Number(part).toString(16).padStart(2, "0"))
              .join("")
        : fallback;
    };
    setMeasured({
      radius: Math.min(64, parseFloat(css.borderRadius) || 0),
      padding: Math.min(64, parseFloat(css.padding) || 0),
      background: hex(css.backgroundColor, "#ffffff"),
      color: hex(css.color, "#222222"),
    });
  }, [selected, document.appearance, document.seed, document.accent, document.font]);
  function focus(node: DesignNode) {
    setSelected(node.id);
    if (document.hidden.includes(node.id))
      update((doc) => ({ ...doc, hidden: doc.hidden.filter((id) => id !== node.id) }));
    const p = positionOf(node, document.positions);
    viewport.current?.api.viewport.fit(
      { left: p.x - 60, top: p.y - 50, right: p.x + cardWidth + 60, bottom: p.y + cardHeight + 50 },
      { maxZoom: 1, padding: 40 },
    );
  }
  function fit() {
    const positions = visible.map((node) => positionOf(node, document.positions));
    if (!positions.length) return;
    viewport.current?.api.viewport.fit(
      {
        left: Math.min(...positions.map((p) => p.x)) - 30,
        top: 0,
        right: Math.max(...positions.map((p) => p.x)) + cardWidth + 30,
        bottom: Math.max(...positions.map((p) => p.y)) + cardHeight + 30,
      },
      { padding: 32 },
    );
  }
  function moveNode(event: React.PointerEvent<HTMLButtonElement>, node: DesignNode) {
    if (event.button !== 0) return;
    setSelected(node.id);
    const view = viewport.current?.api.viewport;
    if (!view) return;
    const button = event.currentTarget,
      card = button.closest<HTMLElement>("[data-node]");
    if (!card) return;
    const start = view.toCanvas(event.clientX, event.clientY),
      original = positionOf(node, document.positions);
    let next = original;
    const move = (pointer: PointerEvent) => {
      const current = view.toCanvas(pointer.clientX, pointer.clientY);
      next = {
        x: Math.max(-100000, Math.min(100000, original.x + current.x - start.x)),
        y: Math.max(-100000, Math.min(100000, original.y + current.y - start.y)),
      };
      card.style.left = `${next.x}px`;
      card.style.top = `${next.y}px`;
      scene.current = {
        ...scene.current,
        positions: { ...scene.current.positions, [node.id]: next },
      };
      draw();
    };
    const cleanup = () => {
      button.removeEventListener("pointermove", move);
      button.removeEventListener("pointerup", finish);
      button.removeEventListener("pointercancel", cancel);
      if (button.hasPointerCapture(event.pointerId)) button.releasePointerCapture(event.pointerId);
      dragCleanup.current = null;
    };
    const finish = () => {
      cleanup();
      update((doc) => ({ ...doc, positions: { ...doc.positions, [node.id]: next } }));
    };
    const cancel = () => {
      cleanup();
      card.style.left = `${original.x}px`;
      card.style.top = `${original.y}px`;
      scene.current = { ...scene.current, positions: document.positions };
      draw();
    };
    dragCleanup.current?.();
    dragCleanup.current = cancel;
    button.setPointerCapture(event.pointerId);
    button.addEventListener("pointermove", move);
    button.addEventListener("pointerup", finish);
    button.addEventListener("pointercancel", cancel);
  }
  function changeAppearance(patch: Partial<Appearance>) {
    if (!picked?.component) return;
    const component = picked.component;
    update((doc) => ({
      ...doc,
      appearance: {
        ...doc.appearance,
        [component]: { ...doc.appearance[component], ...patch },
      },
    }));
  }
  const appearance = picked?.component
    ? { ...measured, ...document.appearance[picked.component] }
    : initialAppearance;
  const theme = draftFromSeed(document.seed, {
    accent: document.accent,
    fonts: { heading: fontStack(document.font), body: fontStack(document.font), mono: "monospace" },
  });
  return (
    <section className="design-studio" aria-label="Design system studio">
      <header className="studio-toolbar">
        <div>
          <span className="studio-eyebrow">TONY / DESIGN WORKSPACE</span>
          <h1>
            Design studio
            <span className="studio-dot" />
          </h1>
        </div>
        <div className="studio-toolbar-actions">
          <span role="status" className="studio-save">
            {design.message}
          </span>
          <Button disabled={!design.canUndo} onClick={design.undo}>
            Undo
          </Button>
          <Button disabled={!design.canRedo} onClick={design.redo}>
            Redo
          </Button>
          <Button
            className="studio-primary"
            aria-expanded={exportsOpen}
            onClick={() => setExportsOpen(!exportsOpen)}
          >
            Export ↗
          </Button>
        </div>
      </header>
      {exportsOpen && (
        <div className="studio-export" aria-label="Export design">
          <p>
            Save a backup or export files into your project. Component styles apply inside{" "}
            <code>data-design-component</code> boundaries.
          </p>
          <Button
            onClick={() =>
              download("design-system.json", JSON.stringify(document, null, 2), "application/json")
            }
          >
            Design backup (.json)
          </Button>
          <Button
            onClick={() =>
              download(
                "design-tokens.ts",
                `import { draftFromSeed } from './draft'\n\nexport const projectDraft = draftFromSeed(${JSON.stringify(document.seed)}, ${JSON.stringify({ accent: document.accent, fonts: theme.fonts }, null, 2)})\n`,
                "text/plain",
              )
            }
          >
            Tokens (.ts)
          </Button>
          <Button
            onClick={() =>
              download("component-overrides.css", appearanceCSS(document.appearance), "text/css")
            }
          >
            Component styles (.css)
          </Button>
          <label className="studio-import">
            Import backup
            <input
              aria-label="Import design backup"
              type="file"
              accept="application/json,.json"
              onChange={async (event) => {
                const input = event.currentTarget,
                  file = input.files?.[0];
                if (!file) return;
                try {
                  if (file.size > 1000000) throw new Error("Backup exceeds 1 MB");
                  const imported = parseDocument(await file.text());
                  update(() => imported);
                } catch {
                  design.setMessage("Invalid backup. Your current design was kept.");
                }
                input.value = "";
              }}
            />
          </label>
        </div>
      )}
      <div className="studio-body">
        <aside className="studio-layers" aria-label="Layers">
          <div className="studio-panel-title">
            <strong>Layers</strong>
            <span>{nodes.length}</span>
          </div>
          <input
            className="studio-search"
            type="search"
            aria-label="Search layers"
            placeholder="Find a component…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="studio-layer-list">
            {levels.map((level) => (
              <details key={level} open>
                <summary>
                  {level}
                  <span>{filtered.filter((node) => node.level === level).length}</span>
                </summary>
                {filtered
                  .filter((node) => node.level === level)
                  .map((node) => (
                    <div
                      key={node.id}
                      className="studio-layer"
                      data-selected={selected === node.id}
                    >
                      <Button aria-pressed={selected === node.id} onClick={() => focus(node)}>
                        <span aria-hidden>◇</span> {node.label}
                      </Button>
                      <Button
                        aria-label={`${document.hidden.includes(node.id) ? "Show" : "Hide"} ${node.label}`}
                        onClick={() =>
                          update((doc) => ({
                            ...doc,
                            hidden: doc.hidden.includes(node.id)
                              ? doc.hidden.filter((id) => id !== node.id)
                              : [...doc.hidden, node.id],
                          }))
                        }
                      >
                        {document.hidden.includes(node.id) ? "○" : "●"}
                      </Button>
                    </div>
                  ))}
              </details>
            ))}
          </div>
          <div className="studio-layer-footer">
            Atomic categories are curated.
            <br />
            Connections follow source imports.
          </div>
        </aside>
        <div className="studio-board-wrap">
          <div
            className="studio-board"
            ref={frame}
            tabIndex={0}
            role="region"
            aria-label="Infinite design canvas"
            onPointerDown={(event) => {
              if (event.target === event.currentTarget) {
                event.currentTarget.focus();
                viewport.current?.api.viewport.pointerdown(event.nativeEvent);
              }
            }}
            onKeyDown={(event) => {
              if (event.target !== event.currentTarget) return;
              const api = viewport.current?.api.viewport;
              if (event.key.startsWith("Arrow")) {
                event.preventDefault();
                api?.panBy(
                  event.key === "ArrowLeft" ? 80 : event.key === "ArrowRight" ? -80 : 0,
                  event.key === "ArrowUp" ? 80 : event.key === "ArrowDown" ? -80 : 0,
                );
              } else api?.keydown(event.nativeEvent);
            }}
          >
            <div className="studio-scene" ref={sceneHost} />
            <div className="studio-world" ref={world}>
              {levels.map((level, i) => (
                <div className="studio-column" key={level} style={{ left: i * 780, top: 20 }}>
                  <span>0{i + 1}</span>
                  <h2>{level}</h2>
                  <p>
                    {level === "Foundations"
                      ? "The shared visual language"
                      : level === "Pages"
                        ? "Everything, composed"
                        : "Small parts. Larger possibilities."}
                  </p>
                </div>
              ))}
              {visible.map((node) => {
                const p = positionOf(node, document.positions);
                return (
                  <article
                    className="studio-node"
                    key={node.id}
                    data-node={node.id}
                    data-selected={selected === node.id}
                    style={
                      {
                        left: p.x,
                        top: p.y,
                        width: cardWidth,
                        height: cardHeight,
                      } satisfies CSSProperties
                    }
                  >
                    <button
                      className="studio-node-handle"
                      aria-label={`Move ${node.label}`}
                      onPointerDown={(event) => moveNode(event, node)}
                      onClick={() => setSelected(node.id)}
                      onKeyDown={(event) => {
                        if (!event.key.startsWith("Arrow")) return;
                        event.preventDefault();
                        const step = event.shiftKey ? 40 : 10;
                        update((doc) => ({
                          ...doc,
                          positions: {
                            ...doc.positions,
                            [node.id]: {
                              x:
                                p.x +
                                (event.key === "ArrowRight"
                                  ? step
                                  : event.key === "ArrowLeft"
                                    ? -step
                                    : 0),
                              y:
                                p.y +
                                (event.key === "ArrowDown"
                                  ? step
                                  : event.key === "ArrowUp"
                                    ? -step
                                    : 0),
                            },
                          },
                        }));
                      }}
                    >
                      <span>⠿</span>
                      {node.label}
                      <small>{node.level.slice(0, -1)}</small>
                    </button>
                    <div
                      className="studio-node-preview"
                      data-interactive={interact && selected === node.id}
                      onPointerDown={() => {
                        if (!interact) setSelected(node.id);
                      }}
                    >
                      <div
                        className="studio-node-content"
                        inert={!(interact && selected === node.id)}
                      >
                        <NodeContent node={node} />
                      </div>
                    </div>
                    <footer>
                      <span>{node.dependencies.length} dependencies</span>
                      <Button
                        onClick={() => {
                          focus(node);
                          setIsolated(true);
                          setInteract(true);
                        }}
                      >
                        Isolate ↗
                      </Button>
                    </footer>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="studio-canvas-tools">
            <Button
              onClick={() => viewport.current?.api.viewport.zoomBy(0.8)}
              aria-label="Zoom out"
            >
              −
            </Button>
            <span aria-label="Zoom level">{zoom}%</span>
            <Button
              onClick={() => viewport.current?.api.viewport.zoomBy(1.25)}
              aria-label="Zoom in"
            >
              +
            </Button>
            <Button onClick={fit}>Fit all</Button>
            <Button
              onClick={() => {
                setIsolated(false);
                setSelected(null);
              }}
            >
              Show all
            </Button>
            <Button aria-pressed={interact} onClick={() => setInteract(!interact)}>
              {interact ? "Interact" : "Select"}
            </Button>
          </div>
          <div className="studio-board-status">
            <span data-render-mode={mode}>{mode}</span>
            <span>Drag background to pan · ⌘/Ctrl + scroll to zoom</span>
          </div>
        </div>
        <aside className="studio-inspector" aria-label="Design inspector">
          <div className="studio-panel-title">
            <strong>Design</strong>
            <span>01</span>
          </div>
          <section>
            <h2>Global tokens</h2>
            <p>Shared by every component and page.</p>
            <ColorField
              label="Brand seed"
              value={document.seed}
              onCommit={(seed) => update((doc) => ({ ...doc, seed }))}
            />
            <ColorField
              label="Accent"
              value={document.accent}
              onCommit={(accent) => update((doc) => ({ ...doc, accent }))}
            />
            <label className="studio-field">
              Font family
              <select
                aria-label="Font family"
                value={document.font}
                onChange={(event) => {
                  const font = event.target.value;
                  if (font === "Inter" || font === "Georgia" || font === "monospace")
                    update((doc) => ({ ...doc, font }));
                }}
              >
                <option>Inter</option>
                <option>Georgia</option>
                <option>monospace</option>
              </select>
            </label>
          </section>
          <section>
            <h2>{picked?.label ?? "Select a component"}</h2>
            <p>{picked?.source ?? "Pick a layer or a card on the canvas."}</p>
            {picked?.component && (
              <>
                <div className="studio-field-grid">
                  <NumberField
                    label="Corner radius"
                    value={appearance.radius}
                    onCommit={(radius) => changeAppearance({ radius })}
                  />
                  <NumberField
                    label="Padding"
                    value={appearance.padding}
                    onCommit={(padding) => changeAppearance({ padding })}
                  />
                </div>
                <ColorField
                  label="Background"
                  value={appearance.background}
                  onCommit={(background) => changeAppearance({ background })}
                />
                <ColorField
                  label="Text color"
                  value={appearance.color}
                  onCommit={(color) => changeAppearance({ color })}
                />
                <Button
                  onClick={() => {
                    const component = picked.component;
                    if (component)
                      update((doc) => {
                        const appearance = { ...doc.appearance };
                        delete appearance[component];
                        return { ...doc, appearance };
                      });
                  }}
                >
                  Reset component style
                </Button>
                <Link
                  className="studio-detail-link"
                  to="/components/$index"
                  params={{ index: picked.component }}
                >
                  Open component page ↗
                </Link>
                <p>
                  Overrides target control surfaces. Component structure stays in its source file.
                </p>
              </>
            )}
          </section>
          {picked && (
            <section>
              <h2>Composed from</h2>
              {picked.dependencies.length ? (
                picked.dependencies.map((id) => (
                  <Button
                    key={id}
                    onClick={() => {
                      const node = nodes.find((entry) => entry.id === id);
                      if (node) focus(node);
                    }}
                  >
                    {id} ↗
                  </Button>
                ))
              ) : (
                <p>No local component imports.</p>
              )}
              <h2>Used by</h2>
              {nodes
                .filter((node) => node.dependencies.includes(picked.id))
                .map((node) => (
                  <Button key={node.id} onClick={() => focus(node)}>
                    {node.label} ↗
                  </Button>
                ))}
            </section>
          )}
          <section>
            <Button onClick={() => update(() => initialDocument)}>Reset design</Button>
            <p>Reset can be undone.</p>
          </section>
        </aside>
      </div>
    </section>
  );
}
