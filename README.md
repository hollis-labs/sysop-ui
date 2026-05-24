# @hollis-labs/sysop-ui

**Sysop UI** — the System Operations React kit. A shared package of generic
shell components, shadcn/ui primitives, the canonical `[data-theme]` palette,
and data hooks, extracted from the most-evolved app frontends (Torque's GUI and
Fragments Engine's Sysop).

- React 19 · Vite 5 · Tailwind v4 · shadcn/ui (`base-nova` style)
- The `[data-theme]` + Tailwind `@theme` token system is **canonical** — the
  single styling lineage every Hollis Labs app converges to. The hand-rolled
  "HUD" CSS in older apps is retired in favour of it.

## What's in the kit

| Area | Exports |
| --- | --- |
| Theme | `theme.css` (4 palettes + tokens), `applyTheme`, `THEME_OPTIONS`, `ThemeSwitcher`, … |
| Shell | `NavRail`, `PageHeader`, `SummaryCards`, `EmptyState`, `DetailDialog`/`DetailSection` |
| Layout | `ListPageLayout`, `DetailPageLayout`, `DetailHeader`, `TabStrip`, `OperationsTablePage` preset, `CollapsibleSection` |
| Data table | `DataTable<T>` + `ColumnDef<T>` (sortable, windowed, selectable), `RowActionMenu` |
| Filters | `FilterBar` shell + `FilterSearchInput`, `FilterCycleToggle`, `FilterChipGroup`, `FilterEntityCombobox` |
| Primitives | `CopyableId`, `CopyButton`, `StatusBadge`, `Pill`, `LiveDot`, `Callout`, `Combobox`, `MetaList`, `Metric`, `ProgressBar` (`indeterminate`), `JsonViewer`, `FormDialog`, `ConfirmDialog`, + shadcn `ui/` (table, button, badge, card, checkbox, input, textarea, label, dialog, alert-dialog, dropdown-menu, popover, command, input-group, scroll-area, select, separator, sheet, switch, tabs, tooltip, skeleton, sonner) |
| Widgets | `TimeSeriesChart` (stacked bar/area, day-bucketed), `DonutChart`, `BarMeter`, `ActivityHeatmap` (calendar heatmap), `HourlyPulse` (last-24h strip), `RecentList` |
| Hooks / API | `usePoll`, `useCopy`, `useElapsed` (seconds-elapsed ticker), `useArrowNav` (window ←/→ nav), `useSSE` (`EventSource` subscription), `createApiContext`, `createApiClient`, `normalizeKeys`, … |
| Utils / toasts | `formatDuration` (seconds → `1h 03m`), `formatRelativeTime`, `formatShortDate`, `formatCount`, `notifySuccess` / `notifyError` (`sonner` toast helpers — mount a `<Toaster />`) |
| Storage / cursor | `createScopedStorage` (namespaced, fault-tolerant `localStorage`), `createListCursor` + `listCursorNeighbors` (list-cursor pagination — prev/next neighbors) |

App-specific domain code (fragment/route/task models, app dialogs) is **not**
in the kit — it stays in each app. The kit is the generic shell.

The dashboard widgets pull in **`recharts`** (a bundled dependency) — it backs
`TimeSeriesChart`'s stacked bar/area rendering. The other widgets
(`DonutChart`, `BarMeter`, `ActivityHeatmap`, `HourlyPulse`, `RecentList`) are
dependency-free hand-rolled SVG/markup.

## Import surfaces

The root entrypoint is intentionally narrow and mirrors `ui`:

```ts
import { Button, PageHeader, applyTheme } from '@hollis-labs/sysop-ui'
```

Optional domains live behind explicit subpaths:

| Entry | Use for |
| --- | --- |
| `@hollis-labs/sysop-ui/ui` | Theme helpers, shell chrome, formatters, visual primitives, shadcn `ui/*` |
| `@hollis-labs/sysop-ui/api` | API client/context helpers, normalizers, polling/SSE hooks, storage/list cursor helpers |
| `@hollis-labs/sysop-ui/layout` | Page skeletons such as `ListPageLayout`, `DetailPageLayout`, `TabStrip` |
| `@hollis-labs/sysop-ui/data` | `DataTable`, `RowActionMenu`, filter-bar pieces |
| `@hollis-labs/sysop-ui/widgets` | Lightweight SVG/markup widgets that do not use `recharts` |
| `@hollis-labs/sysop-ui/charts` | `TimeSeriesChart` and any future charting components backed by `recharts` |

Recommended rule:

- treat the root entrypoint as `ui`
- import app transport/client plumbing from `api`
- import page layouts from `layout`
- import table/filter features from `data`
- import `charts` only inside pages that actually render charts
- import `widgets` explicitly for dashboard-only SVG widgets

## Consuming the kit

The package is npm-publishable but there is no private registry yet, so apps
depend on it as a **git dependency**, with a **`file:` link for local dev**.

### In an app

```jsonc
// package.json
"dependencies": {
  "@hollis-labs/sysop-ui": "github:hollis-labs/sysop-ui#v0.7.0"
}
```

**Pin a release tag, not `#main`.** Git dependencies have no semver
resolution — the ref is exact — so tracking `#main` means every `npm install`
can silently pull a different build. Depend on the current tag (`#v0.7.0`)
and bump it deliberately when adopting a new release.

The `prepare` script builds `dist/` automatically on install, so a git
dependency works without extra steps.

### Local development

When working on the kit and a consuming app together, link the working copy:

```bash
# from the consuming app
npm install file:../../libs/sysop-ui
```

Run `npm run build` in `libs/sysop-ui` after changes (or `npm run build --
--watch`) so the linked `dist/` stays fresh.

### Wire it up

```ts
// 1. Import the canonical theme once (e.g. in main.tsx)
import '@hollis-labs/sysop-ui/theme.css'

// 2. Apply the persisted palette before first paint
import { applyTheme, getInitialTheme } from '@hollis-labs/sysop-ui/ui'
applyTheme(getInitialTheme())
```

The kit's components rely on the theme's semantic Tailwind tokens
(`bg-panel`, `text-text-subtle`, `border-border-strong`, `text-status-*`, …),
so the consuming app's Tailwind build must process `theme.css`.

`theme.css` also locks the document shell — `html`, `body`, and `#root` are
pinned to the viewport with overflow disabled, so the fixed NavRail + PageHeader
chrome never scrolls. Apps mount into `#root` and let page regions scroll
internally; no per-app `index.css` reset is needed.

## App structure

Default Sysop app shape:

- eager shell: nav, page header, providers, theme boot, route state
- lazy routes: each page loaded through `React.lazy(() => import('./pages/...'))`
- page-local feature code: charts, dialogs, tables, and heavy inspectors stay with the page that uses them
- shared shell imports: `ui` and `layout`
- transport/client imports: `api`
- optional heavy domains: `charts` only where needed

Minimal shell example:

```tsx
import { Suspense, lazy } from 'react'
import { NavRail, PageHeader } from '@hollis-labs/sysop-ui/ui'

const OperationsPage = lazy(() =>
  import('./pages/operations').then((module) => ({ default: module.OperationsPage })),
)

export function AppShell() {
  return (
    <>
      <NavRail items={[]} />
      <PageHeader title="Operations" />
      <Suspense fallback={<div>Loading...</div>}>
        <OperationsPage />
      </Suspense>
    </>
  )
}
```

## Adding a page

A page is generic kit chrome + app-specific content:

```tsx
import {
  PageHeader, SummaryCards, EmptyState, StatusBadge,
} from '@hollis-labs/sysop-ui/ui'
import { DataTable, type ColumnDef } from '@hollis-labs/sysop-ui/data'

interface Widget { id: string; name: string; status: string }

const columns: ColumnDef<Widget>[] = [
  { key: 'name', header: 'Name', width: 'fill', cell: (w) => w.name,
    sortValue: (w) => w.name },
  { key: 'status', header: 'Status', cell: (w) => <StatusBadge status={w.status} /> },
]

export function WidgetsPage({ widgets }: { widgets: Widget[] }) {
  return (
    <>
      <PageHeader title="Widgets" />
      <SummaryCards cards={[{ label: 'Total', value: widgets.length }]} />
      {widgets.length === 0 ? (
        <EmptyState variant="empty" title="No widgets" description="Nothing here yet." />
      ) : (
        <DataTable items={widgets} columns={columns} getRowId={(w) => w.id} />
      )}
    </>
  )
}
```

### Page layouts are full-bleed — chrome divides, content blocks frame

Reach for a layout component instead of hand-assembling the skeleton:

- `OperationsTablePage` — the whole list/operations page (header + summary +
  filters + table) as one preset.
- `ListPageLayout` / `DetailPageLayout` — slot-based shells for bespoke pages.

These fill the viewport edge-to-edge. Their structure comes from the **pinned
region dividers** — `PageHeader`, `SummaryCards`, `FilterBar`, and `TabStrip`
each carry a bottom border — plus the `NavRail`'s edge. *That* is the frame.
Do **not** wrap a layout, or the `DataTable` inside it, in a bordered panel:
the scroll body and table sit flush, exactly as Torque's and Fragments
Engine's `/operations` routes do.

Borders belong to **content blocks** — a card, a callout, a grouped section
*inside* the scroll body. Those opt in via the `hud-panel` class
(`rounded-md border bg-panel`). Rule of thumb: page chrome *divides* with
bottom borders; content blocks *frame* with `hud-panel`.

For the API layer, build a concrete client on `createApiClient` and a typed
context with `createApiContext`:

```ts
import { createApiClient, createApiContext } from '@hollis-labs/sysop-ui/api'

const http = createApiClient({ baseUrl: '' })
export const apiClient = {
  listWidgets: () => http.get<Widget[]>('/v1/widgets'),
}
export const { ApiProvider, useApi } = createApiContext(apiClient)
```

## Bundle inspection

Use route-level lazy imports first. If a Sysop app still has a large initial
chunk, inspect the app build rather than guessing:

```bash
npm run analyze
```

Questions to answer in the report:

- which modules are in the entry chunk
- which pages moved into route chunks after `React.lazy`
- whether `recharts` appears only in the page chunks that import `@hollis-labs/sysop-ui/charts`

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run build` | Type-check + emit `dist/` (ES module + `.d.ts`) |
| `npm run demo` | Component gallery — every export, live theme switch (visual reference) |
| `npm run typecheck` | Type-check only |
| `npm run lint` | ESLint |
| `npm test` | Vitest (watch) |
| `npm run test:run` | Vitest (single run) |

## License

MIT — see [LICENSE](./LICENSE).
