import { expect, test } from "@playwright/test";

test("WebGPU produces nonblank pixels and recovers from actual device loss", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && /GPU|shader|WGSL|validation/i.test(message.text()))
      errors.push(message.text());
  });
  await page.route("https://**/*", (route) => route.abort());
  await page.addInitScript(() => {
    // Test-only GPU readback: headless Chromium may return a transparent DOM screenshot
    // even when the GPU texture contains the completed frame. No application test hooks.
    const gpu = (navigator as any).gpu;
    if (!gpu) return;
    let texture: any;
    const contextPrototype = (window as any).GPUCanvasContext.prototype;
    const configure = contextPrototype.configure;
    contextPrototype.configure = function (options: any) {
      return configure.call(this, { ...options, usage: options.usage ?? 0x10 | 0x01 });
    };
    const getTexture = contextPrototype.getCurrentTexture;
    contextPrototype.getCurrentTexture = function () {
      texture = getTexture.call(this);
      return texture;
    };
    const requestAdapter = gpu.requestAdapter.bind(gpu);
    gpu.requestAdapter = async (...args: any[]) => {
      const adapter = await requestAdapter(...args);
      if (!adapter) return adapter;
      const requestDevice = adapter.requestDevice.bind(adapter);
      adapter.requestDevice = async (...options: any[]) => {
        const device = await requestDevice(...options);
        device.addEventListener("uncapturederror", (event: any) =>
          console.error("GPU validation: " + event.error.message),
        );
        const submit = device.queue.submit.bind(device.queue);
        let reading = false;
        device.queue.submit = (...commands: any[]) => {
          submit(...commands);
          if (!texture || reading) return;
          reading = true;
          const width = Math.min(32, texture.width),
            height = Math.min(32, texture.height);
          const buffer = device.createBuffer({ size: 256 * height, usage: 0x01 | 0x08 });
          const encoder = device.createCommandEncoder();
          encoder.copyTextureToBuffer({ texture }, { buffer, bytesPerRow: 256 }, { width, height });
          submit([encoder.finish()]);
          buffer.mapAsync(0x01).then(() => {
            const pixels = new Uint8Array(buffer.getMappedRange());
            let opaque = 0,
              colored = 0;
            for (let y = 0; y < height; y++)
              for (let x = 0; x < width; x++) {
                const i = y * 256 + x * 4;
                if (pixels[i + 3] === 255) opaque++;
                if (pixels[i] > 100 && pixels[i + 1] > 100 && pixels[i + 2] > 100) colored++;
              }
            Object.assign(window, { studioPixels: { opaque, colored, total: width * height } });
            buffer.unmap();
            buffer.destroy();
            reading = false;
          });
        };
        Object.assign(window, { loseStudioDevice: () => device.destroy() });
        return device;
      };
      return adapter;
    };
  });
  await page.goto(`${process.env.SDK_STUDIO_URL}/studio`, { waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-render-mode]")).toHaveText("WebGPU");
  await page.getByRole("button", { name: "Fit all", exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as any).studioPixels?.opaque)).toBe(1024);
  expect(await page.evaluate(() => (window as any).studioPixels.colored)).toBeGreaterThan(900);
  await page.evaluate(() => (window as any).loseStudioDevice());
  await expect(page.locator("[data-render-mode]")).toHaveText("Canvas 2D");
  await page.getByRole("button", { name: "Zoom out", exact: true }).click();
  expect(errors).toEqual([]);
});
