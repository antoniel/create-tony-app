import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: ".",
  testMatch: process.env.SDK_APP_URL ? "production.spec.ts" : "picker.spec.ts",
  fullyParallel: true,
  use: { baseURL: "http://127.0.0.1:4179" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: process.env.SDK_APP_URL
    ? undefined
    : {
        command: "npx vite --host 127.0.0.1 --port 4179",
        url: "http://127.0.0.1:4179",
        reuseExistingServer: false,
      },
});
