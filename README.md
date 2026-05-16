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
| Data table | `DataTable<T>` + `ColumnDef<T>` (sortable, windowed, selectable) |
| Filters | `FilterBar` shell + `FilterSearchInput`, `FilterCycleToggle`, `FilterEntityCombobox` |
| Primitives | `CopyableId`, `StatusBadge`, + shadcn `ui/` (table, button, badge, input, textarea, dialog, popover, command, input-group, scroll-area, tooltip, skeleton, sonner) |
| Hooks / API | `usePoll`, `createApiContext`, `createApiClient`, `normalizeKeys`, … |

App-specific domain code (fragment/route/task models, app dialogs) is **not**
in the kit — it stays in each app. The kit is the generic shell.

## Consuming the kit

The package is npm-publishable but there is no private registry yet, so apps
depend on it as a **git dependency**, with a **`file:` link for local dev**.

### In an app

```jsonc
// package.json
"dependencies": {
  "@hollis-labs/sysop-ui": "github:hollis-labs/sysop-ui#main"
}
```

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
import { applyTheme, getInitialTheme } from '@hollis-labs/sysop-ui'
applyTheme(getInitialTheme())
```

The kit's components rely on the theme's semantic Tailwind tokens
(`bg-panel`, `text-text-subtle`, `border-border-strong`, `text-status-*`, …),
so the consuming app's Tailwind build must process `theme.css`.

## Adding a page to an app

A page is generic kit chrome + app-specific content:

```tsx
import {
  PageHeader, SummaryCards, DataTable, EmptyState,
  type ColumnDef,
} from '@hollis-labs/sysop-ui'

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

For the API layer, build a concrete client on `createApiClient` and a typed
context with `createApiContext`:

```ts
import { createApiClient, createApiContext } from '@hollis-labs/sysop-ui'

const http = createApiClient({ baseUrl: '' })
export const apiClient = {
  listWidgets: () => http.get<Widget[]>('/v1/widgets'),
}
export const { ApiProvider, useApi } = createApiContext(apiClient)
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run build` | Type-check + emit `dist/` (ES module + `.d.ts`) |
| `npm run typecheck` | Type-check only |
| `npm run lint` | ESLint |
| `npm test` | Vitest (watch) |
| `npm run test:run` | Vitest (single run) |

## License

UNLICENSED — internal to Hollis Labs.
