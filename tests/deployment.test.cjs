const assert = require("node:assert/strict");
const { mkdtemp, readFile, access, rm } = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");
const { generateProject } = require("../dist/command/create");

test("Cloudflare deployment follows all eight feature selections", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "tony-deploy-"));
  const features = ["web", "api", "database"];
  try {
    for (let mask = 0; mask < 8; mask++) {
      const selected = features.filter((_, index) => mask & (1 << index));
      const destination = path.join(root, String(mask));
      await generateProject(destination, { projectName: `app-${mask}`, features: selected });
      const stack = await readFile(path.join(destination, "alchemy.run.ts"), "utf8");
      for (const [feature, declaration] of [
        ["web", "Cloudflare.Website.Vite"],
        ["api", "Cloudflare.Worker("],
        ["database", "Cloudflare.D1.Database"],
      ]) {
        assert.equal(
          stack.includes(declaration),
          selected.includes(feature),
          `${mask}: ${feature}`,
        );
      }
      assert.equal(
        stack.includes("VITE_API_URL"),
        selected.includes("web") && selected.includes("api"),
      );
      assert.equal(
        stack.includes("env: { DB: database }"),
        selected.includes("api") && selected.includes("database"),
      );
      if (selected.includes("api")) {
        const worker = await readFile(path.join(destination, "apps/api/src/worker.ts"), "utf8");
        assert.equal(worker.includes("createDatabase"), selected.includes("database"));
        await assert.rejects(
          access(path.join(destination, "apps/api/src/worker.with-database.ts")),
        );
        await assert.rejects(access(path.join(destination, "apps/api/src/worker.standalone.ts")));
      }
      const pkg = JSON.parse(await readFile(path.join(destination, "package.json"), "utf8"));
      assert.match(pkg.scripts.deploy, /--stage prod$/);
      assert.equal(pkg.devDependencies.alchemy, pkg.devDependencies["@alchemy.run/cloudflare"]);
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
