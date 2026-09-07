# sysop-ui

`@hollis-labs/sysop-ui` — the System Operations React kit: generic shell
components, shadcn/ui primitives, the canonical `[data-theme]` palette, layout
presets, `DataTable`, filters, widgets, charts and data hooks. It is the
generic shell only. App-specific domain code — fragment/route/task models, app
dialogs — stays in each app and does not belong here.

## Start Here

- `README.md`'s "What's in the kit" table is the export inventory by area.
- `SYSOP_V2_ROADMAP.md` tracks the next iteration and, usefully, records how
  each downstream app currently pins and imports the kit.
- `package.json` `exports` defines the subpath entrypoints; `src/index.ts`,
  `src/ui.ts`, `src/api.ts`, `src/layout.ts`, `src/data.ts`, `src/widgets.ts`
  and `src/charts.ts` are the corresponding barrels.
- `src/components/` holds the components; `src/hooks/`, `src/lib/` and
  `src/contexts/` hold hooks, helpers and context.
- `src/styles/` holds `theme.css`, the canonical token system.
- `demo/` is a runnable gallery; `src/__tests__/` holds the tests.

## Commands

```bash
npm run typecheck
npm run lint
npm run test:run
npm run build
```

`npm run demo` serves the gallery. `npm test` starts vitest in watch mode — use
`test:run` for a single pass.

## Boundaries

The subpath entrypoints are a bundle-size contract, not organization. `charts`
carries `recharts`, and `widgets` carries the heavier visual components; both
sit behind their own entrypoints so an app that does not use them does not pay
for them. Re-exporting a heavy module from `src/index.ts` or from a lighter
barrel silently grows the initial chunk of every consuming app.

`react` and `react-dom` are peer dependencies and must stay that way — bundling
a second React copy into the kit breaks hooks in every consumer.

`sideEffects` is `["**/*.css"]`, which is what lets bundlers tree-shake the
unused exports. Adding a module with import-time side effects outside CSS
defeats that for everyone.

The `[data-theme]` plus Tailwind `@theme` token system is canonical across the
portfolio, and `theme.css` ships as raw CSS the app imports once. Apps converge
on it; the older hand-rolled HUD CSS is retired. Do not fork palette decisions
into a consumer.

This package is published to npm and consumed by Cerberus and Tether — one via
a local file link, one via a version pin (see the roadmap's table). A change to
an export's name or shape is a downstream break even when this repo's own build
is green.
