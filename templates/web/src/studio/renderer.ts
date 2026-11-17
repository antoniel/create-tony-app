import type { Viewport } from "@ui-sdk/core";
import { type Point } from "./model";
import { nodes, positionOf } from "./registry";

import { sizeOf, type NodeSize } from "./layout";

export type RenderMode = "Starting" | "WebGPU" | "Canvas 2D";
export interface Scene {
  viewport: Viewport;
  positions: Record<string, Point>;
  sizes?: Record<string, NodeSize>;
  hidden: string[];
  selected: string | null;
}
export function connectionPoints(scene: Scene) {
  const points: number[] = [];
  const visible = nodes.filter((node) => !scene.hidden.includes(node.id));
  for (const target of visible)
    for (const id of target.dependencies) {
      if (scene.selected && target.id !== scene.selected && id !== scene.selected) continue;
      const source = visible.find((node) => node.id === id);
      if (!source) continue;
      const a = positionOf(source, scene.positions),
        b = positionOf(target, scene.positions);
      const sourceSize = sizeOf(source.id, scene.sizes ?? {}),
        targetSize = sizeOf(target.id, scene.sizes ?? {});
      const start = { x: a.x + sourceSize.width, y: a.y + sourceSize.height / 2 },
        end = { x: b.x, y: b.y + targetSize.height / 2 };
      const bend = Math.max(100, Math.abs(end.x - start.x) * 0.5);
      const curve = (t: number) => {
        const u = 1 - t;
        return {
          x:
            u ** 3 * start.x +
            3 * u ** 2 * t * (start.x + bend) +
            3 * u * t ** 2 * (end.x - bend) +
            t ** 3 * end.x,
          y: u ** 3 * start.y + 3 * u ** 2 * t * start.y + 3 * u * t ** 2 * end.y + t ** 3 * end.y,
        };
      };
      for (let i = 0; i < 24; i++) {
        const p = curve(i / 24),
          q = curve((i + 1) / 24);
        points.push(p.x, p.y, q.x, q.y);
      }
    }
  return new Float32Array(points);
}
const shader = `
struct View { offset: vec2f, zoom: f32, ratio: f32, size: vec2f, pad: vec2f }
@group(0) @binding(0) var<uniform> view: View;
@vertex fn grid(@builtin(vertex_index) id: u32) -> @builtin(position) vec4f {
  let p = array<vec2f,3>(vec2f(-1,-1),vec2f(3,-1),vec2f(-1,3)); return vec4f(p[id],0,1);
}
@fragment fn dots(@builtin(position) p: vec4f) -> @location(0) vec4f {
  let screen = p.xy / view.ratio;
  let spacing = 32.0 * max(view.zoom, 0.25);
  let d = abs((screen - view.offset) - floor((screen - view.offset) / spacing + 0.5) * spacing);
  let dot = 1.0 - smoothstep(0.5,1.2,length(d));
  return vec4f(mix(vec3f(0.945,0.95,0.96),vec3f(0.68,0.71,0.76),dot),1);
}
@vertex fn line(@location(0) point: vec2f) -> @builtin(position) vec4f {
  let p = (point * view.zoom + view.offset) / view.size;
  return vec4f(p.x * 2 - 1,1 - p.y * 2,0,1);
}
@fragment fn ink() -> @location(0) vec4f { return vec4f(0.36,0.40,0.70,1); }
`;

// The GPU draws the scene, while a sibling DOM world retains real component semantics.
// No animation loop runs when idle. Every resource belongs to this mounted renderer.
export function createSceneRenderer(host: HTMLElement, onMode: (mode: RenderMode) => void) {
  let canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  host.append(canvas);
  let disposed = false,
    frame = 0;
  let current: Scene = {
    viewport: { x: 0, y: 0, zoom: 1 },
    positions: {},
    hidden: [],
    selected: null,
  };
  let cachedScene: Scene | undefined;
  let cachedPoints = new Float32Array(0);
  const geometry = () => {
    if (
      !cachedScene ||
      cachedScene.positions !== current.positions ||
      cachedScene.sizes !== current.sizes ||
      cachedScene.hidden !== current.hidden ||
      cachedScene.selected !== current.selected
    ) {
      cachedPoints = connectionPoints(current);
      cachedScene = current;
    }
    return cachedPoints;
  };
  let device: GPUDevice | undefined;
  let cleanupGPU = () => {};
  let render: (() => void) | undefined;
  const dimensions = () => {
    const width = Math.max(1, host.clientWidth),
      height = Math.max(1, host.clientHeight);
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const max = device?.limits.maxTextureDimension2D ?? 8192;
    const nextWidth = Math.min(max, Math.round(width * ratio)),
      nextHeight = Math.min(max, Math.round(height * ratio));
    if (canvas.width !== nextWidth) canvas.width = nextWidth;
    if (canvas.height !== nextHeight) canvas.height = nextHeight;
    return { width, height, ratio: canvas.width / width };
  };
  const request = () => {
    if (!disposed && !frame)
      frame = requestAnimationFrame(() => {
        frame = 0;
        render?.();
      });
  };
  function fallback() {
    if (disposed) return;
    cleanupGPU();
    device?.destroy();
    device = undefined;
    const replacement = document.createElement("canvas");
    replacement.setAttribute("aria-hidden", "true");
    canvas.replaceWith(replacement);
    canvas = replacement;
    const ctx = canvas.getContext("2d");
    render = () => {
      if (!ctx) return;
      const { width, height, ratio } = dimensions(),
        { viewport } = current;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.fillStyle = "#f1f3f5";
      ctx.fillRect(0, 0, width, height);
      const gap = 32 * Math.max(viewport.zoom, 0.25);
      ctx.fillStyle = "#b0b5c2";
      for (let x = ((viewport.x % gap) + gap) % gap; x < width; x += gap)
        for (let y = ((viewport.y % gap) + gap) % gap; y < height; y += gap)
          ctx.fillRect(x, y, 1, 1);
      ctx.translate(viewport.x, viewport.y);
      ctx.scale(viewport.zoom, viewport.zoom);
      ctx.strokeStyle = "#6066b3";
      ctx.lineWidth = 1 / viewport.zoom;
      ctx.beginPath();
      const points = geometry();
      for (let i = 0; i < points.length; i += 4) {
        ctx.moveTo(points[i], points[i + 1]);
        ctx.lineTo(points[i + 2], points[i + 3]);
      }
      ctx.stroke();
    };
    onMode("Canvas 2D");
    request();
  }
  async function start() {
    try {
      const adapter = await navigator.gpu?.requestAdapter();
      if (!adapter || disposed) {
        fallback();
        return;
      }
      const acquired = await adapter.requestDevice();
      if (disposed) {
        acquired.destroy();
        return;
      }
      device = acquired;
      const context = canvas.getContext("webgpu");
      if (!context) {
        fallback();
        return;
      }
      const format = navigator.gpu.getPreferredCanvasFormat();
      device.pushErrorScope("validation");
      const module = device.createShaderModule({ code: shader });
      const grid = device.createRenderPipeline({
        layout: "auto",
        vertex: { module, entryPoint: "grid" },
        fragment: { module, entryPoint: "dots", targets: [{ format }] },
      });
      const lines = device.createRenderPipeline({
        layout: "auto",
        vertex: {
          module,
          entryPoint: "line",
          buffers: [
            { arrayStride: 8, attributes: [{ shaderLocation: 0, offset: 0, format: "float32x2" }] },
          ],
        },
        fragment: { module, entryPoint: "ink", targets: [{ format }] },
        primitive: { topology: "line-list" },
      });
      const error = await device.popErrorScope();
      if (disposed) return;
      if (error) {
        fallback();
        return;
      }
      const uniforms = device.createBuffer({
        size: 32,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      const bindings = [grid, lines].map((pipeline) =>
        acquired.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [{ binding: 0, resource: { buffer: uniforms } }],
        }),
      );
      let vertices: GPUBuffer | undefined;
      let uploaded: Float32Array | undefined;
      context.configure({ device, format, alphaMode: "opaque" });
      cleanupGPU = () => {
        vertices?.destroy();
        uniforms.destroy();
        context.unconfigure();
      };
      acquired.lost.then(() => {
        if (!disposed && device === acquired) fallback();
      });
      render = () => {
        try {
          const { width, height, ratio } = dimensions(),
            { viewport } = current;
          acquired.queue.writeBuffer(
            uniforms,
            0,
            new Float32Array([viewport.x, viewport.y, viewport.zoom, ratio, width, height, 0, 0]),
          );
          const points = geometry();
          if (uploaded !== points) {
            vertices?.destroy();
            vertices = acquired.createBuffer({
              size: Math.max(8, points.byteLength),
              usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            });
            if (points.length) acquired.queue.writeBuffer(vertices, 0, points);
            uploaded = points;
          }
          const encoder = acquired.createCommandEncoder();
          const pass = encoder.beginRenderPass({
            colorAttachments: [
              {
                view: context.getCurrentTexture().createView(),
                loadOp: "clear",
                storeOp: "store",
                clearValue: [0.95, 0.95, 0.96, 1],
              },
            ],
          });
          pass.setPipeline(grid);
          pass.setBindGroup(0, bindings[0]);
          pass.draw(3);
          if (points.length && vertices) {
            pass.setPipeline(lines);
            pass.setBindGroup(0, bindings[1]);
            pass.setVertexBuffer(0, vertices);
            pass.draw(points.length / 2);
          }
          pass.end();
          acquired.queue.submit([encoder.finish()]);
        } catch {
          fallback();
        }
      };
      onMode("WebGPU");
      request();
    } catch {
      fallback();
    }
  }
  const observer = new ResizeObserver(request);
  observer.observe(host);
  void start();
  return {
    draw(scene: Scene) {
      current = scene;
      request();
    },
    destroy() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      cleanupGPU();
      device?.destroy();
      canvas.remove();
    },
  };
}
