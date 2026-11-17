## Design Studio · Native Shell

Install [Native Shell](https://nsh.dev/docs/installation/) v0.5.1 and put `nsh` on your PATH. Run `bun dev` from the workspace and open the URL printed by NSH. The Studio opens at `/`. The browser host builds the component catalog with the [Vercel UI SDK](https://ui-sdk.dev/) for interactive behaviors and semantic HTML for content. Edit component source files in `apps/web/browser/catalog/components/ui`.

Drag the canvas background to pan or use Ctrl + scroll to zoom. Layers groups the 67 component previews, design tokens, template and gallery under their atomic levels and functional clusters. Click a layer or card title to inspect or isolate it. Controls inside a preview respond directly. The Studio saves edits in your browser, supports Undo and Redo, and exports backups and source files.

**Fit all** eases the camera into place. Card selection, switch toggles and overlays provide short motion cues. The Studio follows your system's reduced-motion preference.

To ship a design, place the exported token and CSS files at `apps/web/browser/catalog/theme/design-tokens.ts` and `apps/web/browser/catalog/studio/component-overrides.css`. `bun run build` packages the site in `apps/web/dist/Tony Studio`. Alchemy deploys any selected API and D1 resources. Connect the NSH app to the deployed API URL when adding API calls.

`bun run --filter @app/web dev:native` opens the smaller native starter in the system host. `bun run --filter @app/web test` runs its headless tests.
