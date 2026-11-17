# Design Studio

The generated web template now includes `/studio`: a desktop-first, infinite workspace for changing a new project's design language. This builds on the UI SDK evaluation, with a concrete use for its viewport behavior. The existing component kit still uses Chakra; the editor's gestures and action buttons use UI SDK. This is an incremental integration, not a completed replacement of all 67 components.

## Working in the studio

Open **plate → studio** in the sidebar. The board contains 67 real component previews plus foundations, a detail template and a gallery page, organized into Foundations → Atoms → Molecules → Organisms → Templates → Pages. Atomic categories are curated in `src/studio/registry.ts`; they are architectural guidance, not automatically inferred from import depth.

Connections run from dependency to consumer. Local component connections come from relative imports in the actual TSX files, read by Vite at build time. The gallery consumes the catalog, and the detail template imports Code. SDK and Chakra internals are not expanded. Tokens are inherited through the theme provider, not represented as imaginary direct imports from every component.

- Drag empty space or scroll to pan. Ctrl/Command + scroll zooms around the pointer; the UI SDK also handles touch pinch. Keyboard focus on the board supports arrows, +, − and 0. The toolbar offers Fit all and zoom controls.
- Select a layer to center it and highlight its connections. Search and collapse the layer groups, or hide individual nodes.
- Drag a card header to move it; focused headers support arrow keys, with Shift for larger steps. Movement participates in undo/redo.
- Isolate a component to work on it. Select mode makes previews inert so their controls cannot steal input. Interact mode activates the selected preview. Escape exits isolation and interaction.
- Edit brand seed, accent and font globally; the changes apply throughout the app. Edit radius, padding, background and text color for a component. Text fields commit on blur/Enter so history records edits rather than every keystroke. These are visual overrides, not arbitrary JSX editing.
- Undo/redo uses buttons or Command/Ctrl+Z / Shift+Command/Ctrl+Z outside text inputs. Reset is undoable. History retains up to 50 snapshots for the current session.

State is stored under `tony.design-studio.v1` in localStorage for the current origin. Tokens, appearance, positions and hidden nodes survive reload; selection, camera and undo history do not. Storage failures are visible. Invalid stored documents are not overwritten until a user makes an edit. An imported backup is validated and is itself undoable.

## Exporting a design into a project

The browser does not silently write source files. Export provides separate downloads:

1. **Design backup (.json)** contains tokens, appearance and canvas layout; import it to resume work or move the design to another app.
2. **Tokens (.ts)** replaces `apps/web/src/theme/design-tokens.ts`. The generated provider already reads its `projectDraft`. This is the shipped default for a fresh browser; an existing local draft remains an explicit override. Use Reset design to return to the shipped default.
3. **Component styles (.css)** replaces `apps/web/src/studio/component-overrides.css`, which is already imported globally. Commit it with the token file.

Component overrides use Chakra component classes and `data-design-component` boundaries. Catalog previews and isolated pages have boundaries; shared close-button, link-button and toggle-tip surfaces are also tagged so changes propagate into their consumers and portalled content. A new custom component should expose a stable boundary on its styled root. Complex components can later add semantic controls to the inspector rather than relying on generic surface CSS. Active local overrides take precedence over the exported stylesheet.

## Rendering and UI SDK

`createViewport` from the pinned `@ui-sdk/core` beta owns viewport state, pan, pinch, zoom and coordinate conversion. A small primitive instance is created in an effect and destroyed on unmount. Viewport updates change one DOM transform and schedule GPU work without rerendering the React catalog on every pointer move. SDK Buttons provide the editor actions.

WebGPU draws the dot grid and curved dependency connections. Components remain live DOM, retaining focus, accessibility, text rendering and their existing behaviors. This is a hybrid renderer; it does not rasterize HTML or JSX to GPU textures. Geometry buffers are reused across camera changes and recomputed when nodes/connections change. Frames render on demand, not in an idle animation loop. Resize, unmount and device loss release resources. Missing WebGPU, adapter/pipeline failures or device loss switch to Canvas 2D.

WebGPU requires a supporting browser and a secure context (HTTPS or localhost). No backend, API key, database migration or deployment service is introduced. `@webgpu/types` is a development-only type dependency. No physical-device performance claim is made from headless browser tests.

The SDK supports web framework adapters, not React Native or automatic native iOS/Android widgets. Desktop/mobile reuse would be through a web shell/WebView with browser-specific GPU support. Native shells, native rendering and mobile interaction tuning remain separate work. The initial workspace is optimized for desktop editing.

## Verification

```sh
yarn build
bun test tests/studio-model.test.ts
node --test tests/generator-sdk.cjs
npm ci --prefix tests/ui-sdk
cd tests/ui-sdk && npx playwright install --with-deps chromium firefox webkit
cd ../..
node tests/verify-studio.cjs
```

The final command generates a fresh web-only app, installs it, typechecks, production-builds, starts the built server, runs the studio browser suite in three engines, and cleans up the server and temporary project. CI runs it alongside the existing four-configuration generator build matrix and SDK picker tests.

The WebGPU test reads back actual texture pixels (1024 opaque grid pixels), rather than accepting a transparent headless screenshot as evidence, and checks recovery after device destruction. Headless Chromium screenshot compositing is not used as a GPU visual-quality claim.

For the WebGPU-specific pipeline/device-loss test, start a generated app and run:

```sh
SDK_STUDIO_URL=http://localhost:3000 SDK_GPU_TEST=1 npm test --prefix tests/ui-sdk -- --project=chromium --workers=1
```

This opts the test browser into WebGPU; it does not change the application or require users to enable unsafe browser flags. A machine/runner without a WebGPU adapter should use the normal cross-browser suite to verify the fallback, rather than silently passing the GPU-specific test.

Future work: migrate remaining kit behaviors to UI SDK where the integration is useful, semantic per-component prop editors, creating compositions/JSX by dragging, custom node creation, collaborative persistence and native shells. None of these is presented as part of this version.

Local verification completed: 27 studio browser cases passed against a freshly generated production app across Chromium, Firefox and WebKit; the WebGPU readback/device-loss test passed in Chromium; three model/history tests and all seven generator packaging cases passed; all four generated web feature combinations typechecked and production-built; the existing 15 picker browser cases and strict type fixtures still passed. The CLI build, focused studio lint and npm package dry-run also passed. CI repeats the platform-independent suites; the explicit GPU test remains opt-in because runner GPU support varies.
