import { expect, test } from "@playwright/test";

const origin = process.env.SDK_STUDIO_URL ?? "http://127.0.0.1:4183";
const errors = new WeakMap<object, string[]>();
test.beforeEach(async ({ page }) => {
  errors.set(page, []);
  page.on("pageerror", (error) => errors.get(page)!.push(error.message));
  await page.route("https://**/*", (route) => route.abort());
  await page.goto(`${origin}/studio`, { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("status")).toContainText("Saved locally");
  await expect(page.locator("[data-render-mode]")).not.toHaveText("Starting");
});
test.afterEach(async ({ page }) => {
  expect(errors.get(page)).toEqual([]);
});

test("renders all components, pans and zooms, selects and isolates a real component", async ({
  page,
}) => {
  await expect(page.locator("[data-node]")).toHaveCount(70);
  const world = page.locator(".studio-world");
  const before = await world.getAttribute("style");
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect(world).not.toHaveAttribute("style", before!);
  const canvas = page.getByRole("region", { name: "Infinite design canvas" });
  await canvas.focus();
  const zoomed = await world.getAttribute("style");
  await canvas.press("ArrowRight");
  await expect(world).not.toHaveAttribute("style", zoomed!);
  await page
    .getByRole("complementary", { name: "Layers" })
    .getByRole("button", { name: "button", exact: true })
    .click();
  await expect(page.locator('[data-node="button"]')).toHaveAttribute("data-selected", "true");
  await page.locator('[data-node="button"]').getByRole("button", { name: "Isolate" }).click();
  await expect(page.locator("[data-node]")).toHaveCount(1);
  await expect(page.locator('[data-node="button"] .studio-node-content')).not.toHaveAttribute(
    "inert",
  );
  await page.getByRole("button", { name: "Show all", exact: true }).click();
  await expect(page.locator("[data-node]")).toHaveCount(70);
});

test("edits global tokens, undo/redo, persists across reload and exports validated backup", async ({
  page,
}) => {
  const seed = page.getByRole("textbox", { name: "Brand seed", exact: true });
  await seed.fill("#235588");
  await seed.press("Enter");
  await expect(seed).toHaveValue("#235588");
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(seed).toHaveValue("#434343");
  await page.getByRole("button", { name: "Redo", exact: true }).click();
  await expect(seed).toHaveValue("#235588");
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(seed).toHaveValue("#235588");
  await page.getByRole("button", { name: "Export ↗", exact: true }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Design backup (.json)", exact: true }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe("design-system.json");
  const fs = await import("node:fs/promises");
  const backup = JSON.parse(await fs.readFile((await file.path())!, "utf8"));
  expect(backup.seed).toBe("#235588");
  expect(backup.version).toBe(1);
  const tokenDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Tokens (.ts)", exact: true }).click();
  const tokens = await tokenDownload;
  expect(await fs.readFile((await tokens.path())!, "utf8")).toContain('draftFromSeed("#235588"');
  const imported = { ...backup, seed: "#334466" };
  await page
    .getByLabel("Import design backup")
    .setInputFiles({
      name: "valid.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(imported)),
    });
  await expect(seed).toHaveValue("#334466");
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(seed).toHaveValue("#235588");
  await page.getByLabel("Import design backup").setInputFiles({
    name: "broken.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":99}'),
  });
  await expect(page.getByRole("status")).toContainText("Invalid backup");
  await expect(seed).toHaveValue("#235588");
});

test("component appearance reaches real controls, isolated page and CSS export", async ({
  page,
}) => {
  await page
    .getByRole("complementary", { name: "Layers" })
    .getByRole("button", { name: "button", exact: true })
    .click();
  const radius = page.getByRole("spinbutton", { name: "Corner radius", exact: true });
  await radius.fill("24");
  await radius.press("Enter");
  await page.getByRole("textbox", { name: "Background", exact: true }).fill("#ffcc88");
  await page.getByRole("textbox", { name: "Background", exact: true }).press("Enter");
  const button = page
    .locator('[data-node="button"] [data-design-component="button"] button')
    .first();
  await expect(button).toHaveCSS("border-radius", "24px");
  await expect(button).toHaveCSS("background-color", "rgb(255, 204, 136)");
  await page.getByRole("button", { name: "Export ↗", exact: true }).click();
  const cssDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: "Component styles (.css)", exact: true }).click();
  const cssFile = await cssDownload;
  const fs = await import("node:fs/promises");
  const css = await fs.readFile((await cssFile.path())!, "utf8");
  expect(css).toContain("border-radius: 24px");
  expect(css).toContain("background: #ffcc88");
  await page.getByRole("link", { name: "Open component page" }).click();
  await expect(page).toHaveURL(/\/components\/button/);
  await expect(page.locator('[data-design-component="button"] button').first()).toHaveCSS(
    "border-radius",
    "24px",
  );
});

test("keyboard move, layer visibility and undo preserve positions", async ({ page }) => {
  await page
    .getByRole("complementary", { name: "Layers" })
    .getByRole("button", { name: "button", exact: true })
    .click();
  const handle = page.getByRole("button", { name: "Move button", exact: true });
  const node = page.locator('[data-node="button"]');
  const left = await node.evaluate((el) => Number.parseFloat((el as HTMLElement).style.left));
  await handle.focus();
  await handle.press("ArrowRight");
  await expect(node).toHaveCSS("left", `${left + 10}px`);
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(node).toHaveCSS("left", `${left}px`);
  await page.getByRole("button", { name: "Hide button", exact: true }).click();
  await expect(node).toHaveCount(0);
  await page.getByRole("button", { name: "Show button", exact: true }).click();
  await expect(node).toHaveCount(1);
});

test("falls back without WebGPU and keeps editing operational", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "gpu", { value: undefined }));
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("[data-render-mode]")).toHaveText("Canvas 2D");
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect(page.getByLabel("Zoom level")).not.toHaveText("55%");
});

test("captures the workspace and reports its renderer", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.getByRole("button", { name: "Fit all", exact: true }).click();
  await page.screenshot({ path: testInfo.outputPath("studio.png") });
  testInfo.annotations.push({
    type: "renderer",
    description: await page.locator("[data-render-mode]").innerText(),
  });
});

test("source dependencies and shared atom appearance stay linked", async ({ page }) => {
  const layers = page.getByRole("complementary", { name: "Layers" });
  await layers.getByRole("button", { name: "dialog", exact: true }).click();
  await expect(
    page
      .getByRole("complementary", { name: "Design inspector" })
      .getByRole("button", { name: "close-button ↗", exact: true }),
  ).toBeVisible();
  await layers.getByRole("button", { name: "close button", exact: true }).click();
  const radius = page.getByRole("spinbutton", { name: "Corner radius", exact: true });
  await radius.fill("23");
  await radius.press("Enter");
  await layers.getByRole("button", { name: "dialog", exact: true }).click();
  await page.locator('[data-node="dialog"]').getByRole("button", { name: "Isolate" }).click();
  await page
    .locator('[data-node="dialog"] .studio-node-content')
    .getByRole("button")
    .first()
    .click();
  await expect(
    page.getByRole("dialog").locator('[data-design-component="close-button"]'),
  ).toHaveCSS("border-radius", "23px");
});

test("pointer dragging uses canvas coordinates and can be undone", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page
    .getByRole("complementary", { name: "Layers" })
    .getByRole("button", { name: "button", exact: true })
    .click();
  const card = page.locator('[data-node="button"]');
  const before = await card.evaluate((el) => Number.parseFloat((el as HTMLElement).style.left));
  const handle = await page.getByRole("button", { name: "Move button", exact: true }).boundingBox();
  if (!handle) throw new Error("Missing drag handle");
  await page.mouse.move(handle.x + 30, handle.y + 18);
  await page.mouse.down();
  await page.mouse.move(handle.x + 90, handle.y + 48, { steps: 8 });
  await page.mouse.up();
  await expect
    .poll(() => card.evaluate((el) => Number.parseFloat((el as HTMLElement).style.left)))
    .toBeGreaterThan(before + 40);
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(card).toHaveCSS("left", `${before}px`);
});

test("storage failures are visible without breaking edits or undo", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException("Blocked", "QuotaExceededError");
    };
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByRole("status")).toContainText("Local storage unavailable");
  const seed = page.getByRole("textbox", { name: "Brand seed", exact: true });
  await seed.fill("#112233");
  await seed.press("Enter");
  await expect(seed).toHaveValue("#112233");
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(seed).toHaveValue("#434343");
});
