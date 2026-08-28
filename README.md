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
apps/
  web/       TanStack Start + React Query
  api/       Elysia
packages/
  database/  Drizzle + PostgreSQL
```

Every folder is optional. The generated integrations adapt to the selected tree: the API only imports the database package when both are selected, and the web starter only calls the API when it exists.
