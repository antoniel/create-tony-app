import * as fs from "fs-extra";
import path from "path";
import type { Feature } from "./compose-tree";
import type { WebRuntime } from "./create";

export async function writeDeployment(
  projectPath: string,
  selection: { projectName: string; features: Feature[]; webRuntime?: WebRuntime },
) {
  const selected = new Set(selection.features);
  const resources: string[] = [];
  const outputs: string[] = [];

  if (selected.has("database")) {
    resources.push(`    const database = yield* Cloudflare.D1.Database('Database', {
      migrations: './packages/database/drizzle',
    });`);
    outputs.push("databaseId: database.databaseId");
  }
  if (selected.has("api")) {
    resources.push(`    const api = yield* Cloudflare.Worker('Api', {
      main: './apps/api/src/worker.ts',
      ${selected.has("database") ? "env: { DB: database }," : ""}
    });`);
    outputs.push("apiUrl: api.url");
  }
  if (selected.has("web") && selection.webRuntime !== "nsh") {
    resources.push(`    const web = yield* Cloudflare.Website.Vite('Web', {
      rootDir: './apps/web',
      ${selected.has("api") ? "env: { VITE_API_URL: api.url.as<string>() }," : ""}
    });`);
    outputs.push("webUrl: web.url");
  }

  await fs.outputFile(
    path.join(projectPath, "alchemy.run.ts"),
    `import * as Alchemy from 'alchemy'
import * as Cloudflare from '@alchemy.run/cloudflare'
import * as Effect from 'effect/Effect'

export default Alchemy.Stack(
  '${selection.projectName}',
  { providers: Cloudflare.providers(), state: Cloudflare.state() },
  Effect.gen(function* () {
${resources.join("\n")}
    return { ${outputs.join(", ")} }
  }),
)
`,
  );
}
