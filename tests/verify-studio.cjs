const { generateProject } = require("../dist/command/create.js");
const { mkdtemp, rm } = require("node:fs/promises");
const { tmpdir } = require("node:os");
const path = require("node:path");
const { spawn, execFileSync } = require("node:child_process");
const { once } = require("node:events");

(async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "tony-studio-"));
  let server;
  try {
    await generateProject(cwd, { projectName: "studio-verification", features: ["web"] });
    for (const args of [["install"], ["run", "typecheck"], ["run", "build"]])
      execFileSync("bun", args, { cwd, stdio: "inherit" });
    server = spawn("bun", ["apps/web/.output/server/index.mjs"], {
      cwd,
      env: { ...process.env, PORT: "4186" },
      stdio: ["ignore", "pipe", "inherit"],
    });
    await Promise.race([
      new Promise((resolve) => {
        server.stdout.on("data", (chunk) => {
          if (String(chunk).includes("Listening")) resolve();
        });
      }),
      once(server, "exit").then(([code]) => {
        throw new Error(`Studio server exited: ${code}`);
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Studio server startup timed out")), 30000).unref(),
      ),
    ]);
    execFileSync("npm", ["test", "--", "--workers=2"], {
      cwd: path.join(__dirname, "ui-sdk"),
      env: { ...process.env, SDK_STUDIO_URL: "http://127.0.0.1:4186" },
      stdio: "inherit",
    });
  } finally {
    if (server && server.exitCode === null) {
      server.kill("SIGTERM");
      await once(server, "exit");
    }
    await rm(cwd, { recursive: true, force: true });
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
