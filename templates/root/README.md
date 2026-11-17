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
