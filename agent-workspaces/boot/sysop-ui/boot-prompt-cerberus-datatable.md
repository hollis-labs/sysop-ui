# Session Boot — sysop-ui — Cerberus DataTable Migration

**Last updated:** 2026-05-25 — end of sysop-ui v2 iteration 1 session.
**Scope:** This boot prompt covers the **next immediate task only**: migrating cerberus `resources.tsx` from its hand-rolled `ResourceTable` component to `DataTable` from `@hollis-labs/sysop-ui/data`. For the broader v2 roadmap see `SYSOP_V2_ROADMAP.md`.

> **Memory + knowledge:** Vanta-primary (`vanta-primary-since: 2026-04-19`). Recall Vanta first (`memory_recall`/`conduit_lookup`), file-based is legacy fallback. Writes → Vanta only via `capture-to-vanta`. See `~/.claude/CLAUDE.md` for full contract.

---

## Where we are

- **sysop-ui `main` tip at handoff:** `6f82fef` — "chore: ignore nanite workspace files". All session work is **uncommitted** (see §Critical state below).
- **cerberus `main`:** `web/src/pages/overview.tsx` modified — overview now imports Panel/Kpi/KpiGrid/MiniTrend/IntelligenceRow from sysop-ui instead of defining them locally. Uncommitted.
- **tether `main`:** `apps/sysop/frontend/package.json` + `package-lock.json` modified — switched from npm `0.7.2` to `file:../../../../../libs/sysop-ui` (local link). `src/pages/overview.tsx` modified — same panel import cleanup. Uncommitted.
- **Working trees:** All three repos have uncommitted changes. Commit sysop-ui first, then cerberus, then tether — in that order (downstream depends on lib).

---

## What was done the previous session (do not redo)

1. **Promoted 5 primitives to `@hollis-labs/sysop-ui/widgets`:**
   - `Panel`, `Kpi`, `KpiGrid`, `MiniTrend`, `IntelligenceRow`
   - Source: `src/components/widgets/overview-panels.tsx`
   - Exported from: `src/widgets.ts`
   - The canonical `Panel` has **no** `border-border` class — that was the visual drift between cerberus and tether. Cerberus panel had it; Tether (the target style) didn't.

2. **Added `createRouter` to `@hollis-labs/sysop-ui/api`:**
   - Source: `src/lib/router.ts` — ~100 lines, zero new peer deps
   - `createRouter({ routes, default, basePath?, paths? })` returns a `useRoute()` hook
   - Handles: pushState navigation (no page reload), popstate (back/forward), first-load URL normalisation, unknown-route fallback
   - Exported from: `src/api.ts`

3. **Demo overhaul** (`demo/`):
   - `demo/views/overview.tsx` — new default landing page showing all 5 panel primitives + widget charts
   - `demo/App.tsx` — uses `createRouter` instead of `useState`; URL routing live; task detail stays as local state (not a route)
   - `demo/demo.css` + App wrapper — fixed scroll: `html/body/#root { height: 100%; overflow: hidden }` + `flex flex-col overflow-hidden` on content wrapper
   - Fixed pre-existing breakage: gallery/operations/task-detail were still importing widgets/data/layout from root `../../src` after the entrypoint split. All corrected.

4. **Downstream app cleanup:**
   - Cerberus `overview.tsx`: removed 110 lines of local component definitions, now imports from sysop-ui
   - Tether `overview.tsx`: same cleanup; `package.json` switched to local file link

---

## This session's scope — cerberus DataTable migration

**Plan doc (authoritative):** `libs/sysop-ui/SYSOP_V2_ROADMAP.md` — section "Per-Project Update Checklist → cerberus"

**One-line summary:** Replace the hand-rolled `ResourceTable` component in `cerberus/web/src/pages/resources.tsx` with `DataTable` from `@hollis-labs/sysop-ui/data`. This eliminates the outside-border table style, picks up infinite-scroll windowing, and brings cerberus in line with the canonical pattern.

### Decisions already locked (do not reopen)

- **D1** `DataTable` is the canonical table component. Raw `<table>` elements in main content pages are migration targets, not acceptable patterns.
- **D2** Table style rule: no outside borders on main content area. `DataTable` already gets this right. `ResourceTable`'s current border treatment is incorrect.
- **D3** `RowActionMenu` from `@hollis-labs/sysop-ui/data` is the canonical action menu — 3-dot per-row actions go through this, not bespoke `DropdownMenu` compositions.
- **D4** sysop-ui uses local file link in cerberus (`file:../../../libs/sysop-ui`) — rebuilt dist is picked up immediately. No need to publish to npm for this work.
- **D5** `ResourceDetailDialog` (the large detail panel with log viewer + action footer in `resources.tsx`) is **out of scope** for this task — preserve it exactly as-is.

### Work breakdown

1. **Read `resources.tsx` in full** — understand the current `ResourceTable` props, columns, and the inline action pattern before touching anything.
2. **Audit `ResourceTable` columns** — map each column to a `ColumnDef<Resource>` entry (key, header, cell renderer, optional sortValue).
3. **Check if `Resource` type needs any changes** — `DataTable` is generic over `T`; the type must be importable or defined locally.
4. **Replace `ResourceTable` with `DataTable`** — import from `@hollis-labs/sysop-ui/data`, build the `columns` array, pass `items`, wire `RowActionMenu` for per-row actions.
5. **Typecheck + visual verify** — run `npm run typecheck` in `cerberus/web`, then run the cerberus dev server and confirm the resources page looks correct.
6. **Commit sysop-ui, then cerberus** — sysop-ui first (all the session's lib changes), then cerberus.

### Exit gate

- [ ] `npm run typecheck` passes in `cerberus/web/`
- [ ] Resources page renders in the cerberus dev server with correct column layout
- [ ] No outside border visible on the table container
- [ ] Row action menu (start/stop/restart/delete) still works
- [ ] `ResourceDetailDialog` still opens on row click
- [ ] No raw `<table>` elements remain in `resources.tsx` main content area

---

## Critical state notes (read before starting)

- **Commit order matters:** sysop-ui must be committed first (it's a local file link dep). Cerberus picks up the rebuilt dist from `libs/sysop-ui/dist/`. Tether similarly.
- **sysop-ui has no uncommitted build** — after committing, run `npm run build` in sysop-ui before cerberus consumes it, OR verify that `dist/` is gitignored and cerberus resolves via source via Vite. Check `cerberus/web/vite.config.ts` for how it resolves the local package.
- **`ResourceTable` is ~130 lines** (`resources.tsx` lines ~169–300) with columns: Name, Status, Kind, Image/Source, and an inline action button column. The action column uses a dropdown with Start/Stop/Restart/Delete — map this to `RowActionMenu`.
- **`ResourceDetailDialog` is ~160 lines** (lines ~504–665) — it's a separate component in the same file. Leave it completely untouched.
- **The `Resource` type** is defined in the cerberus API client (`web/src/api/client.ts`) — import it from there, don't redefine.
- **`DataTable` props to know:** `items: T[]`, `columns: ColumnDef<T>[]`, `onRowClick?: (item: T) => void`, `emptyState?: ReactNode`, `scrollRootRef?`. The `ColumnDef` shape: `{ key, header, cell: (item) => ReactNode, sortValue?, width?, align?, className? }`.
- **`RowActionMenu` props:** `actions: RowAction[]` where `RowAction = { label, icon?, onClick, destructive? }`. Import from `@hollis-labs/sysop-ui/data`.
- **Demo server** for cerberus: the Go server embeds the web/ directory. For frontend-only dev, check if there's a `vite dev` script in `cerberus/web/package.json`. If not, the full Go binary must run — check `cerberus/Makefile` or `README`.
- **The `resources.tsx` page is also the most complex page in cerberus** — it has filtering, status badges, and conditional action availability (can't start a running resource, etc.). Preserve all that logic; only swap the table rendering layer.
- **Do not migrate `projects.tsx`, `registry.tsx`, or `settings.tsx`** in this session — they already use `DataTable`. Only `resources.tsx` uses the raw table.

---

## Repo layout (for orientation)

```
libs/sysop-ui/           ← library (this repo)
  src/
    components/widgets/overview-panels.tsx   ← Panel/Kpi/KpiGrid/MiniTrend/IntelligenceRow (new)
    lib/router.ts                            ← createRouter (new)
    api.ts                                   ← exports createRouter
    widgets.ts                               ← exports Panel/Kpi/etc.
  demo/                                      ← demo app (all imports fixed)
  SYSOP_V2_ROADMAP.md                        ← full v2 plan + per-project checklists

apps/cerberus/web/       ← cerberus frontend
  src/
    pages/
      overview.tsx       ← ✅ already migrated to sysop-ui panel primitives (uncommitted)
      resources.tsx      ← 🎯 THIS SESSION — migrate ResourceTable → DataTable
      projects.tsx       ← already uses DataTable ✓
      registry.tsx       ← already uses DataTable ✓
      settings.tsx       ← already uses DataTable ✓
    api/client.ts        ← Resource type lives here

apps/tether/apps/sysop/frontend/   ← tether frontend
  package.json           ← switched to local file link (uncommitted)
  src/pages/overview.tsx ← ✅ already migrated (uncommitted)
```

---

## How to boot this session

1. `cd /Users/chrispian/dev/hollis-labs/libs/sysop-ui`
2. `git status` — confirm you see the uncommitted files listed above. They are all intentional.
3. **Vanta recall** — surface any prior follow-ups or decisions relevant to sysop-ui or cerberus:
   ```
   mcp__mux__memory_recall query="sysop-ui cerberus DataTable table migration"
   ```
4. Read `SYSOP_V2_ROADMAP.md` front-to-back (it's the plan doc).
5. Read `apps/cerberus/web/src/pages/resources.tsx` in full before writing any code.
6. Commit sysop-ui changes first, then proceed with the DataTable migration in cerberus.
7. After migration: commit cerberus, then address tether's uncommitted changes (overview.tsx + package.json/lock).
