# Tony App

A Bun monorepo composed with Create Tony App.

```bash
bun install
bun dev
```

## Commands

- `bun dev` — run all selected apps
- `bun run build` — build the workspace
- `bun run lint` — lint with Oxlint
- `bun run format` — format with Oxfmt
- `bun run typecheck` — type-check the workspace

## Design Studio (web projects)

Open `/studio` to browse the component hierarchy, pan/zoom, isolate components, and edit brand/accent/font tokens or component appearance. Changes save in your browser; Undo/Redo also covers moved and hidden nodes.

Use Export to download a JSON backup, `design-tokens.ts` (replace `apps/web/src/theme/design-tokens.ts`), and `component-overrides.css` (replace `apps/web/src/studio/component-overrides.css`). Commit exported source files to make the design the default for new users. Reset design returns an existing local draft to the shipped defaults. This version edits appearance; it does not generate arbitrary JSX or native mobile widgets.

## Production (Cloudflare + Alchemy)

The root `alchemy.run.ts` defines the selected resources with [Alchemy](https://alchemy.run/): a TanStack Start Worker for web, an Elysia Worker for API, and D1 for database. The web build receives the deployed API URL automatically. Alchemy and its provider packages are pinned together because the integration currently uses Alchemy v2 beta.

From the workspace root, connect your Cloudflare account and review the production plan:

```bash
bun run deploy:login
bun run typecheck
bun run deploy:plan
bun run deploy
```

`deploy` targets the `prod` stage and prints the deployed URLs. Configure a Workers subdomain in your Cloudflare account for the default `workers.dev` URLs. Alchemy stores deployment state in Cloudflare; use the same account when updating the stack. See the [setup guide](https://alchemy.run/getting-started/) and [stage documentation](https://alchemy.run/environments/stages/).

For a separate staging environment, run:

```bash
TONY_CLOUDFLARE=1 bun alchemy deploy --stage staging
```

`TONY_CLOUDFLARE=1` selects Alchemy's Cloudflare build integration for web; the regular local build uses Nitro. Local `.env` values are not uploaded automatically. Declare runtime bindings and secrets in `alchemy.run.ts`, and keep browser-visible `VITE_` values public.
