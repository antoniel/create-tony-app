import { createViewport, definePrimitive, type CanvasRect, type Viewport } from "@ui-sdk/core";

const fitDuration = 240;

// SDK owns gesture state, coordinate conversion, pointer capture and teardown.
export const studioViewport = definePrimitive({
  name: "design-viewport",
  state: (_options: { surface: () => HTMLElement | null; motion?: boolean }) => ({
    viewport: { x: 32, y: 32, zoom: 0.55 },
  }),
  options: { surface: "callback", motion: "boolean" },
  live: ["viewport"],
  api: (context) => {
    let animatedFit = false;
    let frame: number | undefined;
    const cancelFit = () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
    };
    context.onDestroy(cancelFit);

    const viewport = createViewport(context, {
      key: "viewport",
      surface: () => context.options().surface(),
      minZoom: () => 0.08,
      maxZoom: () => 2,
      set(next) {
        cancelFit();
        if (!animatedFit) {
          context.store.set({ viewport: next });
          return true;
        }
        const from = context.store.get().viewport;
        const start = performance.now();
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        const tick = (now: number) => {
          if (reduced.matches || now - start >= fitDuration) {
            frame = undefined;
            context.store.set({ viewport: next });
            return;
          }
          const progress = 1 - (1 - Math.max(0, now - start) / fitDuration) ** 3;
          context.store.set({ viewport: interpolate(from, next, progress) });
          frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return true;
      },
    });

    return {
      viewport,
      cancelFit,
      fitAll(rect: CanvasRect) {
        cancelFit();
        animatedFit = Boolean(context.options().motion) && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        try {
          viewport.fit(rect, { padding: 32 });
        } finally {
          animatedFit = false;
        }
      },
    };
  },
  slots: () => ({}),
});
export type StudioViewport = ReturnType<typeof studioViewport>;

function interpolate(from: Viewport, to: Viewport, progress: number): Viewport {
  return {
    x: from.x + (to.x - from.x) * progress,
    y: from.y + (to.y - from.y) * progress,
    zoom: from.zoom + (to.zoom - from.zoom) * progress,
  };
}
