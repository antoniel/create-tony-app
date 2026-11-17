import { test, expect } from "@playwright/test";

test("generated production gallery hydrates and selects with the keyboard", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(`${process.env.SDK_APP_URL}/components/combobox`);
  const input = page.getByRole("combobox", { name: "Framework (UI SDK)" });
  // SSR exposes inputs before the route has hydrated. Wait for React to attach.
  await expect
    .poll(() =>
      input.evaluate((element) =>
        Object.keys(element).some((key) => key.startsWith("__reactFiber")),
      ),
    )
    .toBe(true);
  await page.getByRole("button", { name: "Show frameworks", exact: true }).click();
  await expect(input).toHaveAttribute("aria-expanded", "true");
  await input.fill("sve");
  await expect(page.getByRole("option", { name: "Svelte", exact: true })).toBeVisible();
  await input.press("ArrowDown");
  await input.press("Enter");
  await expect(input).toHaveValue("Svelte");
  await expect(input).toHaveAttribute("aria-expanded", "false");
  expect(errors).toEqual([]);
});
