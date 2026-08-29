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

- `apps/web` — TanStack Start · React Query · Chakra UI
- `apps/api` — Elysia · typed HTTP API
- `packages/database` — Drizzle · PGlite

Selecting `packages/database` adds an in-process PGlite database. Create starts it once, applies the starter `users` table, and writes a root `.env` from `.env.example`. Data lives in `packages/database/data` and does not need Docker or PostgreSQL. Use `bun run db:ensure`, `bun run db:generate`, `bun run db:migrate`, `bun run db:push`, and `bun run db:studio` for Drizzle. No seed command is generated.

Every folder is optional. The generated integrations adapt to the selected tree: the API only imports the database package when both are selected. When web and API are selected together, the web app receives a fully typed Eden Treaty client inferred directly from the Elysia application.

API features are organized as lightweight vertical modules with colocated `*.models.ts`, `*.service.ts`, `*.route.ts`, and `index.ts` files. The database-backed `users` module is only generated when both API and database are selected.

Matching web modules expose React Query options from `*.service.ts` files. Request, response, and error types are inferred from Eden Treaty with `Parameters`, `Treaty.Data`, and `Treaty.Error`, so the frontend does not duplicate API contracts.

Web styling uses Chakra UI with a generated provider and customizable system theme. Brand tokens, semantic surface tokens, global styles, and light/dark color values live in `apps/web/src/theme/index.ts`.

Web projects also include nuqs for type-safe URL state. Its TanStack Router adapter is mounted in the shared provider, with a small generated example showing query-string state alongside Chakra components.
