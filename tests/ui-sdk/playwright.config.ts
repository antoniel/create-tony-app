import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: ".",
  testMatch: process.env.SDK_GPU_TEST
    ? "webgpu.spec.ts"
    : process.env.SDK_STUDIO_URL
      ? "studio.spec.ts"
      : process.env.SDK_APP_URL
        ? "production.spec.ts"
        : "picker.spec.ts",
  fullyParallel: true,
  timeout: process.env.CI ? 90_000 : 30_000,
  use: {
    baseURL: "http://127.0.0.1:4179",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: process.env.SDK_GPU_TEST ? { args: ["--enable-unsafe-webgpu"] } : undefined,
      },
    },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer:
    process.env.SDK_APP_URL || process.env.SDK_STUDIO_URL
      ? undefined
      : {
          command: "npx vite --host 127.0.0.1 --port 4179",
          url: "http://127.0.0.1:4179",
          reuseExistingServer: false,
        },
});
