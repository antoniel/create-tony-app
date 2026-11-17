import { createViewport, definePrimitive } from "@ui-sdk/core";

// SDK owns gesture state, coordinate conversion, pointer capture and teardown.
export const studioViewport = definePrimitive({
  name: "design-viewport",
  state: (_options: { surface: () => HTMLElement | null }) => ({
    viewport: { x: 32, y: 32, zoom: 0.55 },
  }),
  options: { surface: "callback" },
  live: ["viewport"],
  api: (context) => ({
    viewport: createViewport(context, {
      key: "viewport",
      surface: () => context.options().surface(),
      minZoom: () => 0.08,
      maxZoom: () => 2,
    }),
  }),
  slots: () => ({}),
});
export type StudioViewport = ReturnType<typeof studioViewport>;
