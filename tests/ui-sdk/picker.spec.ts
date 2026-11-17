import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const browserErrors = new WeakMap<object, string[]>();

test.afterEach(async ({ page }) => {
  expect(browserErrors.get(page)).toEqual([]);
});

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  browserErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await expect(page.getByRole("combobox")).toHaveValue("React");
  // An interaction ensures hydration has completed before checking for errors.
  await page.getByRole("button", { name: "Set Vue externally" }).click();
  await expect(page.getByRole("combobox")).toHaveValue("Vue");
  expect(errors).toEqual([]);
});

test("filters, navigates with arrows, commits selection and submits the value", async ({
  page,
}) => {
  const input = page.getByRole("combobox");
  await input.fill("sve");
  await expect(page.getByRole("option", { name: "Svelte" })).toBeVisible();
  await expect(page.getByRole("option", { name: "React", exact: true })).toBeHidden();
  await input.press("ArrowDown");
  await expect(input).toHaveAttribute("aria-activedescendant", /.+/);
  await input.press("Enter");
  await expect(page.locator('p[role="status"]')).toHaveText("Selected: svelte");
  await expect(input).toBeFocused();
  await expect(input).toHaveAttribute("aria-expanded", "false");
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await expect(page.locator("output")).toHaveText("svelte");
});

test("pointer selection, clear and empty results", async ({ page }) => {
  const input = page.getByRole("combobox");
  await page.getByRole("button", { name: "Show frameworks" }).click();
  await page.getByRole("option", { name: "React", exact: true }).click();
  await expect(page.locator('p[role="status"]')).toHaveText("Selected: react");
  await page.getByRole("button", { name: "Clear framework" }).click();
  await expect(input).toHaveValue("");
  await expect(input).toBeFocused();
  await expect(page.locator('p[role="status"]')).toHaveText("Selected: none");
  await input.fill("zzzzzz");
  await expect(page.getByText("No frameworks found.")).toBeVisible();
});

test("Escape and outside click restore the selected label", async ({ page }) => {
  const input = page.getByRole("combobox");
  await input.fill("sve");
  await input.press("Escape");
  await expect(input).toHaveValue("Vue");
  await expect(input).toHaveAttribute("aria-expanded", "false");
  await input.fill("rea");
  await page.getByRole("heading").click();
  await expect(input).toHaveValue("Vue");
  await expect(input).toHaveAttribute("aria-expanded", "false");
});

test("disabled option is skipped and cannot be selected", async ({ page }) => {
  const input = page.getByRole("combobox");
  await input.fill("");
  await input.press("ArrowDown");
  const angular = page.getByRole("option", { name: "Angular" });
  await expect(angular).toHaveAttribute("aria-disabled", "true");
  const disabledId = await angular.getAttribute("id");
  for (let step = 0; step < 6; step++) {
    await input.press("ArrowDown");
    await expect(input).not.toHaveAttribute("aria-activedescendant", disabledId!);
  }
  await input.press("Enter");
  await expect(page.locator('p[role="status"]')).not.toHaveText("Selected: angular");
});

test("no automated accessibility violations while closed or open", async ({ page }) => {
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "Show frameworks" }).click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});
