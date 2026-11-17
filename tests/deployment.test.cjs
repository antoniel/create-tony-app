const assert = require("node:assert/strict");
const { mkdtemp, readFile, readdir, access, rm } = require("node:fs/promises");
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

test("Native Shell scaffolds a standalone web runtime and keeps the selected Cloudflare backend", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "tony-nsh-"));
  try {
    await generateProject(root, { projectName: "studio-nsh", features: ["web", "api", "database"], webRuntime: "nsh" });
    const web = path.join(root, "apps/web");
    const pkg = JSON.parse(await readFile(path.join(web, "package.json"), "utf8"));
    assert.equal(pkg.scripts.dev, "bun run build:host && nsh run --target web");
    assert.equal(pkg.scripts["dev:native"], "nsh run");
    assert.equal(pkg.scripts.build, "bun run build:host && nsh package --target web -o dist");
    assert.equal(pkg.dependencies["@ui-sdk/react"], pkg.dependencies["@ui-sdk/core"]);
    assert.equal(pkg.dependencies["@chakra-ui/react"], undefined);
    assert.equal(pkg.devDependencies["@chakra-ui/cli"], undefined);
    await access(path.join(web, "App.tsx"));
    await access(path.join(web, "browser/host.tsx"));
    await access(path.join(web, "browser/catalog/studio/registry.ts"));
    await access(path.join(web, "browser/catalog/routes/components/-catalog.tsx"));
    const cards = await readdir(path.join(web, "browser/catalog/components/ui"));
    assert.equal(cards.filter((file) => file.endsWith(".tsx")).length, 67);
    assert.match(await readFile(path.join(web, "browser/catalog/components/ui/drawer.tsx"), "utf8"), /@ui-sdk\/react\/drawer/);
    await assert.rejects(access(path.join(web, "vite.config.ts")));
    await assert.rejects(access(path.join(web, ".nsh")));
    const stack = await readFile(path.join(root, "alchemy.run.ts"), "utf8");
    assert.match(stack, /Cloudflare\.D1\.Database/);
    assert.match(stack, /Cloudflare\.Worker\(/);
    assert.doesNotMatch(stack, /Cloudflare\.Website\.Vite|VITE_API_URL/);
    assert.match(await readFile(path.join(root, "README.md"), "utf8"), /Design Studio · Native Shell/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
