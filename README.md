# Create Tony App 🚀

Compose a Bun + Turborepo monorepo by selecting its file tree.

```bash
bun create tony-app
# or
npm create tony-app
# or
yarn create tony-app
```

The interactive tree currently offers:

```text
? Compose my-app

  my-app/
  ├─ apps/
  │  ├─ ● web/
❯ │  └─ ○ api/
  └─ packages/
     └─ ● database/

  ╭─ apps/api ─────────────────────────────╮
  │ Elysia · typed HTTP API                │
  ╰────────────────────────────────────────╯

  2 of 3 folders selected
  Space toggle · Enter create
```

The details panel follows the focused folder:

- `apps/web` — Vite with TanStack Start, React Query and Chakra UI, or [Native Shell](https://nsh.dev/) for web, desktop and mobile. Choose the runtime after selecting Web.
- `apps/api` — Elysia · typed HTTP API
- `packages/database` — Drizzle · SQLite

Selecting `packages/database` adds an embedded SQLite database. Create prepares the file once, applies the starter `users` table, and writes a root `.env` from `.env.example`. Data lives in `packages/database/data.db` and does not need Docker. Use `bun run db:ensure`, `bun run db:generate`, `bun run db:migrate`, `bun run db:push`, and `bun run db:studio` for Drizzle. No seed command is generated.

Every folder is optional. The generated integrations adapt to the selected tree: the API only imports the database package when both are selected. When Vite and API are selected together, the web app receives a fully typed Eden Treaty client inferred directly from the Elysia application.

API features are organized as lightweight vertical modules with colocated `*.models.ts`, `*.service.ts`, `*.route.ts`, and `index.ts` files. The database-backed `users` module is only generated when both API and database are selected.

Matching web modules expose React Query options from `*.service.ts` files. Request, response, and error types are inferred from Eden Treaty with `Parameters`, `Treaty.Data`, and `Treaty.Error`, so the frontend does not duplicate API contracts.

Vite's UI kit uses Chakra and lives in `apps/web/src/components/ui`. The NSH Web kit uses UI SDK primitives and semantic HTML in `apps/web/browser/catalog/components/ui`. Each kit has one source file per component and a component gallery.

Web projects include [Code Inspector](https://inspector.fe-dev.cn/en/) in Vite. In `bun dev`, hold Option+Shift (Mac) or Alt+Shift (Windows) and click a DOM node to open the source file in the editor.

Web projects also include nuqs for type-safe URL state. Its TanStack Router adapter is mounted in the shared provider.

Vite projects include a visual design-system editor at `/studio`: an infinite canvas with UI SDK pan/zoom, WebGPU connections (with a Canvas 2D fallback), atomic-design layers, real component previews, token/style editing, undo/redo and local persistence. Export theme tokens and component CSS to customize the next project. See [Design Studio](docs/design-studio.md).

NSH Web opens the infinite Studio at `/` with 70 nodes: 67 component previews, design tokens, a template, and a gallery page. The Native Shell web host uses the [Vercel UI SDK](https://ui-sdk.dev/) for canvas navigation and component interactions. It shares the renderer, layout and editor with the Vite template. See the [Native Shell template commands](templates/nsh/README.md).

Generated projects include [Alchemy](https://alchemy.run/) configured for production on Cloudflare. Vite and API deploy as Workers, and database deploys as D1. A Vite build receives the API URL. An NSH build produces a static site in `apps/web/dist/Tony Studio` for a static host. Local development keeps Bun and SQLite, and production applies the database package's SQL migrations to D1. The generated README covers setup and stages.

## Run this repository locally

```bash
yarn install
yarn dev
```

Open http://localhost:3000/studio. `yarn dev` starts the local app without the project-creation prompts. On the first run it prepares a web-only workspace at `.playground/studio`; later runs reuse it and preserve its files. Other playground projects are not deleted. Node 22+ and Bun are required for development.

`yarn dev <folder>` starts an existing web playground under `.playground`. The existing playground-to-template file watcher remains active while the server runs; `src/command/create.ts` remains the source for generated package manifests. To create a separate new project interactively, use the published `bun create tony-app` CLI.

With [Native Shell](https://nsh.dev/docs/installation/) on your PATH, run `yarn dev --runtime nsh` and open the URL printed by NSH. This command regenerates its managed workspace at `.playground/.nsh-web` and bundles the current Studio from the web template. Restart it after editing the templates. Use `yarn dev --runtime vite` to select Vite explicitly.
