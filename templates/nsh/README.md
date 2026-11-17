## Design Studio · Native Shell

Install [Native Shell](https://nsh.dev/docs/installation/) v0.5.1 and put `nsh` on your PATH. Run `bun dev` from the workspace and open the URL printed by NSH. The Studio opens at `/`. Run `bun run --filter @app/web dev:native` for the desktop host, or run `nsh run --target ios` or `nsh run --target android` from `apps/web` with the appropriate simulator or device tooling.

The canvas groups interactive previews by atomic level. Click the title or a Layers entry to edit a component. Controls inside previews respond directly. Change the brand and base font size in the inspector, or set a component's color and corner radius. Undo and Redo track edits within the current session. Changes save on the device. **Copy design** exports JSON to the clipboard. To ship it, paste it over the contents of `apps/web/design-defaults.json` and commit the file.

`bun run --filter @app/web test` runs the Studio's headless interaction tests. `bun run build` packages a static web site in `apps/web/dist/Tony Studio` for any static host. For desktop or mobile packages, run `nsh package --target <platform>` from `apps/web`. Alchemy deploys any selected API and D1 resources. Connect your NSH app to the deployed API URL when adding API calls.
