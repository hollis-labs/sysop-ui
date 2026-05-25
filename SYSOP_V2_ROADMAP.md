# Sysop UI v2 Roadmap

Tracking doc for the next major iteration of `@hollis-labs/sysop-ui`. Goal: consolidate diverging patterns from all downstream apps, add missing primitives, and ship example implementations so humans and agents have a canonical starting point.

---

## Projects Using sysop-ui

| Project | Pin | Import style | Routing | Notes |
|---|---|---|---|---|
| **cerberus** | local file link | sub-paths `/ui /api /data /widgets` | `useState`-only, no URL | Refresh always resets to overview |
| **tether** | npm `0.7.2` | sub-paths `/ui /api /data /layout /widgets` | Custom `pushState` + `popstate` | Works on refresh; `/operations/` base |
| **tesseract** | github `#v0.7.2` | flat top-level imports | Hash-based `#page?params` | Partially migrated; most pages still on HUD CSS |
| **torque** | (check pkg) | flat top-level imports | `react-router-dom` v6 | Most complete routing; `:id` params |

Paths:
- `~/dev/hollis-labs/apps/cerberus/web/`
- `~/dev/hollis-labs/apps/tether/apps/sysop/frontend/`
- `~/dev/hollis-labs/apps/tesseract/frontend/`
- `~/dev/hollis-labs/apps/torque/apps/gui/`

---

## Issues to Fix in sysop-ui

### 1. Routing — No standard approach, 4 diverging patterns
**Problem:** cerberus has no URL routing (state-only, refresh resets). Tether uses custom pushState. Tesseract uses hash. Torque uses react-router-dom. None have the desired behavior (first load → default route; refresh → stay on current route).

**Target behavior:**
- First load: go to the app's default route
- Refresh: stay on the current route (URL must reflect current view)
- Action (modal submit, status transition): page must not navigate/refresh

**Recommendation:** Ship a lightweight `createRouter` utility in sysop-ui that does hash or pushState routing without pulling in react-router as a peer dep. Apps that already use react-router (torque) can ignore it. Document the expected integration pattern so agents don't reinvent it.

**Files to reference:**
- `apps/tether/apps/sysop/frontend/src/App.tsx` — pushState pattern with popstate listener
- `apps/tesseract/frontend/src/App.tsx` — hash router with PAGE_PARENT map for rail highlighting, keyboard shortcuts

---

### 2. Chart Styles — Cerberus chart containers diverge from Tether target
**Problem:** Cerberus overview chart panels have slightly different border/container styling vs Tether (the target). Both use the same widget components but wrap them in locally-defined `Panel`/`KpiGrid`/`Kpi`/`MiniTrend`/`IntelligenceRow` primitives that are copy-pasted between projects with small style drift.

**Evidence:** `Panel`, `Kpi`, `KpiGrid`, `MiniTrend`, `IntelligenceRow` are defined identically in:
- `apps/cerberus/web/src/pages/overview.tsx`
- `apps/tether/apps/sysop/frontend/src/pages/overview.tsx`

**Fix:** Promote these 5 primitives into `@hollis-labs/sysop-ui/layout` or `/widgets`. One canonical source means style fixes propagate everywhere.

---

### 3. Table Style — Outside borders on main content area
**Problem:** Some pages show tables with outside borders, making them look like contained boxes rather than the target style (no outer border on main content, only bottom border on row dividers).

**Affected apps:** Cerberus `resources.tsx` (uses raw `<table>` with `ResourceTable` component instead of `DataTable`), Tesseract most pages (legacy `hud-table` CSS).

**Fix:** The `DataTable` component in sysop-ui already uses the correct style. The fix is adoption — migrate raw tables to `DataTable`. Document the "no outside border" rule clearly in the example implementations.

---

### 4. Data Pagination — Items capping at 500 (or hardcoded limits)
**Problem:** Tether was capping message thread queries at `limit: 200`. Several pages fetch a fixed list and render all of it. No standard pattern for dynamic pagination/infinite scroll.

**What exists:**
- `DataTable` in sysop-ui has internal infinite-scroll windowing (IntersectionObserver, renders 50 at a time client-side)
- Torque's `task-table.tsx` has a full `PAGE_SIZE = 50` IntersectionObserver pattern fetching from the API incrementally

**Fix:** Torque's incremental-fetch pattern (not just client-side windowing) needs to be a first-class concern. Add a `usePaginatedQuery` hook or document the API + DataTable integration pattern for server-side pagination. The `limit: 200` hardcode in Tether needs to become a dynamic scroll-based fetch.

---

### 5. SPA Bundle Size — Everything included on every route
**Problem:** Tether SPA includes all page code on every route load. Addressed per-app with `React.lazy` + `Suspense` on pages, but this is currently only in Tether.

**Fix:** Document `React.lazy` per-route as the required pattern. Add it to the example implementations so agents copy the right pattern. Consider whether sysop-ui's layout components should accept `React.lazy` children by default (they already do — `ListPageLayout` doesn't care).

---

### 6. Modal Actions — Page scrolls/refreshes after submit
**Problem:** On action menus (status transitions, modal submits), the main content area moves or re-fetches in a jarring way.

**Root cause:** `usePoll` continues fetching in background; after a mutation, the poll fires immediately and re-renders. Also, some action handlers don't call `e.preventDefault()` on form submissions.

**Fix:**
- `refreshPolledData()` should be the only trigger after a mutation (pause poll, mutate, then resume)
- FormDialog already wraps a `<form>` — make sure the submit handler pattern in examples always calls `e.preventDefault()` and uses the `busy` prop during in-flight requests
- Document this pattern in example implementations

---

## Components to Adopt from Downstream Apps

### High priority — identical code in 2+ apps

| Component | Source files | Target location |
|---|---|---|
| `Panel` | cerberus `overview.tsx`, tether `overview.tsx` | `/widgets` or `/layout` |
| `Kpi` | cerberus `overview.tsx`, tether `overview.tsx` | `/widgets` |
| `KpiGrid` | cerberus `overview.tsx`, tether `overview.tsx` | `/widgets` |
| `MiniTrend` | cerberus `overview.tsx`, tether `overview.tsx` | `/widgets` |
| `IntelligenceRow` | cerberus `overview.tsx`, tether `overview.tsx` | `/widgets` |

### Medium priority — useful, unique to one app

| Component | Source file | Notes |
|---|---|---|
| `ResourceDetailDialog` | cerberus `resources.tsx` | DetailDialog with tab switcher (stderr/stdout) + action footer — good pattern |
| `SessionDetailDialog` | tether `components/session-detail-dialog.tsx` | Fully-fledged session viewer; lifecycle labels, copy buttons, checkpoint viewer, send-input form, resize controls |
| `MarkdownViewer` | tesseract `components/ui/MarkdownViewer.tsx` | TipTap read-only renderer — unique, not in sysop-ui |

### Low priority — sysop-ui already has equivalents; evaluate/merge

| Component | Source file | Notes |
|---|---|---|
| Tesseract `ConfirmModal` | tesseract `components/ui/ConfirmModal.tsx` | Simpler API than sysop-ui `ConfirmDialog`; compare and possibly simplify |
| Tesseract `JsonViewer` | tesseract `components/ui/JsonViewer.tsx` | Compare with sysop-ui `JsonViewer` |
| Torque `task-table.tsx` | torque `components/domain/task-table.tsx` | Server-side incremental fetch pattern |

---

## Example Implementation Plan

Create a new `demo/views/` page (or dedicated `examples/` app) that shows:

1. **`ExampleListPage`** — `OperationsTablePage` or `ListPageLayout` + `FilterBar` + `DataTable` with:
   - Server-side pagination via IntersectionObserver
   - `RowActionMenu` with status transition (no page movement)
   - Correct table style (no outside borders)

2. **`ExampleDetailPage`** — `DetailPageLayout` with:
   - Tabbed sections
   - `MetaList` sidebar
   - `DetailDialog` drilldown triggered from a row action

3. **`ExampleOverviewPage`** — `KpiGrid` + `Panel` + widget charts (`SignalBars`, `ActivityHeatmap`, `Sparkbars`) using the new promoted primitives

4. **`ExampleSettingsPage`** — `SettingsPanel` + `SettingsGrid` + `SettingsField` + `FormDialog` + `ConfirmDialog`

5. **`ExampleModal`** — `FormDialog` with `busy` state, `e.preventDefault()` pattern, and no-scroll behavior

6. **Routing shell example** — `App.tsx` template showing hash or pushState router with default-route + refresh-persistence + lazy-loaded pages

---

## Per-Project Update Checklist (post v2 release)

### cerberus
- [ ] Switch from local file link to npm release
- [ ] Add URL routing (fix refresh-resets-to-overview)
- [ ] Replace `ResourceTable` raw table with `DataTable`
- [ ] Replace local `Panel`/`Kpi`/`KpiGrid`/`MiniTrend`/`IntelligenceRow` with sysop-ui promoted versions
- [ ] Add dynamic pagination to resource/pipeline lists

### tether
- [ ] Update to v2 npm release
- [ ] Replace local `Panel`/`Kpi`/`KpiGrid`/`MiniTrend`/`IntelligenceRow` with sysop-ui promoted versions
- [ ] Fix `limit: 200` cap on message threads → dynamic scroll-fetch
- [ ] Verify `React.lazy` is on all routes (already partly done)

### tesseract
- [ ] Migrate from github pin to npm release
- [ ] Migrate remaining HUD CSS pages to sysop-ui primitives (24 pages, most still on `hud-*` classes)
- [ ] Replace `ConfirmModal` with sysop-ui `ConfirmDialog`
- [ ] Replace `EmptyState`/`CopyButton`/`StatusBadge` local components with sysop-ui versions
- [ ] Add flat → sub-path import migration (performance: eliminates dead-code on each entrypoint)
- [ ] Add URL routing to remaining state-driven pages

### torque
- [ ] Update to v2 npm release
- [ ] Migrate raw tables (`TemplatesPage`, `CollectionsPage`, `ModelsPage`) to `DataTable`
- [ ] Replace task-table infinite scroll with sysop-ui pattern once available
- [ ] Switch flat imports to sub-path imports for bundle splitting

---

## Open Questions

1. **Router peer dep**: Should sysop-ui ship a `createRouter` utility, or just publish a canonical `App.tsx` template in the demo? Pulling in react-router as a peer dep adds weight; a thin hash/pushState util is ~50 lines.

2. **Chart wrapper components**: The promoted `Panel`/`Kpi`/`KpiGrid` primitives — should they live in `/widgets` (alongside `SignalBars` etc.) or `/layout` (alongside `ListPageLayout`)? They're presentational but data-agnostic.

3. **MarkdownViewer**: TipTap is a large dependency. Should this be a separate optional entrypoint (`/markdown`) or documented as a bring-your-own?

4. **Tesseract HUD CSS migration**: This is a large effort (~500 lines of custom CSS, 24 pages). Should it be tracked as a separate project rather than a v2 blocker?
