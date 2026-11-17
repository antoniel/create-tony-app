# UI SDK assessment and proof of concept

Assessed 2026-11-17. Recommendation: keep experimental; do not adopt as the default kit yet.

## What it solves

[UI SDK](https://ui-sdk.dev/docs) splits DOM interaction into reusable, framework-independent behaviors, with adapters for React, Vue, Svelte, Solid and Web Components. It also supplies assembled headless components. Focus, keyboard navigation, selection, dismissal and ARIA are implemented once, while applications own markup and styles. It is not an AI inference service or a replacement for backend contracts. Agent observation/action APIs are optional; this experiment does not enable them.

Research used the [upstream repository](https://github.com/vercel-labs/ui) at commit `10b3b6c0eccfd176a6d60ce4efaccf0d1584da08`, the public docs, and the release-specific docs/types shipped in npm. npm published `@ui-sdk/core` and `@ui-sdk/react` **0.1.0-beta.6**; the repository already declared beta.7. Both dependencies are pinned together. The upstream project is Apache-2.0 licensed. Its beta status and moving APIs matter for a generator that distributes templates to other projects.

## Hardest relevant problem in this application

The application's primary UI is the terminal compose tree (`src/command/compose-tree.ts`). UI SDK depends on the DOM and does not address that terminal state machine, project generation, database setup or Eden contracts. Among browser interactions, the searchable combobox is the strongest existing fit: text/query versus selected value, focus/highlight versus selection, disabled options, keyboard and pointer input, dismissal, ARIA and hidden form inputs must agree. The current gallery labels it “search” but maps the unfiltered collection without an input-change filter.

Other candidates were popup components, file upload and the color picker. Their existing Chakra implementations already delegate behavior; there is no demonstrated custom workflow here that requires new behavior composition. The combobox gives a focused way to exercise many interaction boundaries without inventing a product feature.

The experiment adds `SdkFrameworkPicker` alongside the Chakra example at `/components/combobox`, with a controlled literal-union value, built-in filtering, clear action, disabled Angular option, a label and form field. It preserves the existing kit. The wrapper exposes only value, onValueChange and disabled; it neither casts values nor reimplements keyboard handling. A generator regression fix preserves `lib/pages.ts` when API files are removed from web-only projects.

## Grades

Scores run from 1 (poor fit) to 5 (strong fit). For API nuance, a higher score means fewer choices/better constraints. These are evidence-based judgments for this repository, not universal library rankings.

| Criterion | Score | Evidence and tradeoff |
| --- | --- | --- |
| API nuance | 2/5 | Ten imported parts for this small picker; separate query/value/highlight state; a renderless root that rejects className; declarative items versus items-as-data, controllers, custom primitives and behaviors create many valid implementation paths. The narrow application wrapper improves local agent ergonomics, but Chakra already supplies that approach. |
| Type safety | 4/5 | Explicit generic preserves the Framework union and nullable clearing callback. Compile-negative fixtures reject invalid SDK values, wrapper values and callbacks that omit null. No casts or any in the wrapper. Types cannot enforce valid part nesting, value membership for every item, accessible labels, or semantic CSS selectors. |
| Testability | 4/5 | Real DOM roles make Playwright tests straightforward; no module mocks. SSR/hydration works in three engines. Upstream also documents core fixtures/controllers. Native popup behavior benefits from real browsers, adding test setup beyond a unit runner. Automated axe checks do not replace screen-reader testing. |
| Cyclomatic complexity | 4/5 | Local component function is 1; maximum nested callback is 3. Four functions total 6 with the documented AST metric; current Chakra wrapper has six functions totaling 7, max 2. Those modules have different scope, so this is not a reduction claim. Keeping both adds code and a second behavioral system. Complexity inside the dependency is not eliminated. |
| Documentation | 4/5 | Strong examples, API tables, SSR guides, testing guides, and release-specific Markdown/llms.txt packaged with npm. Docs cover more customization paths than agents need here; public main can lead a released version. No agent-speed benchmark was independently reproduced. |
| Deployment | 3/5 | No new service, key, provider or network call. React 19 is already present; generated React types minimum rises to 19.2.10. Install both pinned packages, bundle CSS and ship the resulting client assets through existing Vite/Nitro. Current experiment adds roughly 59 KB gzip client JavaScript. Browser test tooling is development-only. |

## Verification and measured cost

- CLI compiler and npm package dry-run pass on the isolated candidate containing only these changes.
- Seven nonempty feature combinations pass generator tests. SDK dependencies appear only in generated web packages; TSX and CSS survive generation; pages.ts survives API omission.
- All four web combinations (web; web+API; web+database; web+API+database) freshly install with Bun 1.3.14, typecheck and production-build successfully.
- Strict TypeScript 5.9.3 harness checks with skipLibCheck disabled pass, including three expected compile errors.
- Fifteen Playwright cases pass: five cases each in Chromium, Firefox and WebKit. They cover server render/hydration without console errors, externally controlled state, filtering, arrows/Enter, active descendant, focus retention, hidden form value, pointer selection, clear, empty results, Escape/outside dismissal, skipping disabled options, and axe with popup open/closed.
- Three additional browser smoke tests pass against the actual generated Nitro production gallery. The test waits for route hydration before interaction; WebKit exposed an early-input/hydration race in the first test attempt. No arbitrary sleep was added.
- Production build emits module-directive warnings for both existing Chakra/Ark and SDK modules; it succeeds. No deployment provider configuration was changed by this PR.

For bundle comparison, the same full-stack generated workspace/dependency installation was built with the original catalog and with the additive SDK example. Summing `.output/public/assets/*.js` gives **1,436,276 → 1,603,049 bytes** uncompressed and **402,365 → 461,800 bytes** individually gzipped: **+166,773 raw / +59,435 gzip bytes (14.8%)**. This is total emitted JS, not a measurement of a single navigation's transferred bytes. It retains Chakra and measures this additive POC, not a hypothetical migration. Harness build separately confirms the component can be bundled without Chakra providers.

`node tests/sdk-complexity.cjs` counts one base path per function plus if/ternary/loop/case/catch, logical operators and optional access. Nested functions are scored separately; destructuring defaults are excluded. It is a transparent local metric, not a whole-dependency complexity audit.

Reproduce from the repository root:

```sh
yarn install --frozen-lockfile
yarn build
node --test tests/generator-sdk.cjs
node tests/verify-sdk-generated.cjs
npm ci --prefix tests/ui-sdk
cd tests/ui-sdk
npx playwright install --with-deps chromium firefox webkit
npm run typecheck
npm run build
npm test
# Optional: against an already-running generated production app
SDK_APP_URL=http://127.0.0.1:3000 npm test
```

CI includes the generator/build matrix and the cross-browser harness. Production gallery smoke testing was performed locally. Native screen readers, touch devices, IME, large/remote datasets and every SDK component were not evaluated; production deployment itself was not performed.

## Recommendation

Do not merge this POC as a default dependency. The existing Chakra/Ark kit already solves the selected interaction problem, and fixing its gallery filtering would be smaller than shipping a second headless system. The SDK earns further evaluation if a real browser workflow requires behavior combinations the current kit cannot express (for example a keyboard-accessible canvas/tree editor), or agent-observable actions become a product requirement. At that point compare equivalent implementations, keep the domain wrapper, pin releases, and retain cross-browser regression tests. Do not migrate the terminal UI to it.

Useful primary references: [combobox](https://ui-sdk.dev/docs/react/components/combobox), [server rendering](https://ui-sdk.dev/docs/react/server-rendering), [testing](https://ui-sdk.dev/docs/core/testing), [npm release](https://www.npmjs.com/package/@ui-sdk/react/v/0.1.0-beta.6).
