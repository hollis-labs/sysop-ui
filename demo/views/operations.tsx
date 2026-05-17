import { useMemo, useState } from 'react'
import { Copy, ExternalLink, Trash2 } from 'lucide-react'
import {
  Button,
  ConfirmDialog,
  CopyableId,
  EmptyState,
  FilterChipGroup,
  OperationsTablePage,
  PriorityBadge,
  RowActionMenu,
  StatusBadge,
  formatRelativeTime,
  statusTone,
  type ColumnDef,
  type FilterChip,
} from '../../src'
import { TASKS, type DemoTask } from '../fixtures/tasks'

/**
 * Torque-shaped Operations route, rebuilt on the kit's `OperationsTablePage`.
 * This is the proof that the kit covers Torque's most-evolved page — and the
 * place rough edges surface first.
 */

const STATUS_FILTERS = [
  'backlog',
  'todo',
  'queued',
  'doing',
  'review',
  'done',
  'blocked',
  'paused',
  'archived',
] as const

const STATUS_CHIPS: FilterChip[] = STATUS_FILTERS.map((status) => {
  const tone = statusTone(status)
  return { value: status, activeClassName: `${tone.border} ${tone.bg} ${tone.text}` }
})

// Mirrors Torque's DEFAULT_ACTIVE_STATUSES — every status except archived is
// on by default, so the filter chips render lit (and archived rows hidden).
const DEFAULT_STATUSES = STATUS_FILTERS.filter((s) => s !== 'archived')

const baseColumns: ColumnDef<DemoTask>[] = [
  {
    key: 'title',
    header: 'Task',
    width: 'fill',
    sortValue: (t) => t.title,
    cell: (t) => (
      <div className="min-w-0">
        <div className="truncate tracking-[.01em] text-text">{t.title}</div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-[10px] text-text-subtle">{t.executor}</span>
          <span className="font-mono text-[10px] text-text-subtle">id:</span>
          <CopyableId id={t.id} />
          {t.tags.map((tag) => (
            <span key={tag.slug} className="font-mono text-[10px] text-text-subtle">
              #{tag.name}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    sortValue: (t) => t.status,
    cell: (t) => <StatusBadge status={t.status} />,
  },
  {
    key: 'priority',
    header: 'Pri',
    align: 'center',
    sortValue: (t) => t.priority,
    cell: (t) => <PriorityBadge priority={t.priority} />,
  },
  {
    key: 'usage',
    header: 'Usage',
    align: 'right',
    sortValue: (t) => t.stats.cost,
    cell: (t) => (
      <span className="font-mono text-[11px] text-text-subtle">
        {t.stats.cost > 0 ? `$${t.stats.cost.toFixed(2)}` : '—'}
      </span>
    ),
  },
  {
    key: 'updated',
    header: 'Updated',
    align: 'right',
    sortValue: (t) => t.updated_at,
    cell: (t) => (
      <span className="text-[11px] uppercase tracking-[.12em] text-text-soft">
        {formatRelativeTime(t.updated_at)}
      </span>
    ),
  },
]

interface OperationsViewProps {
  onOpenTask: (id: string) => void
}

export function OperationsView({ onOpenTask }: OperationsViewProps) {
  const [tasks, setTasks] = useState<DemoTask[]>(TASKS)
  const [search, setSearch] = useState('')
  const [statuses, setStatuses] = useState<Set<string>>(() => new Set(DEFAULT_STATUSES))
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const isDefaultStatuses =
    statuses.size === DEFAULT_STATUSES.length && DEFAULT_STATUSES.every((s) => statuses.has(s))

  function toggleStatus(status: string) {
    setStatuses((prev) => {
      const next = new Set(prev)
      if (next.has(status)) next.delete(status)
      else next.add(status)
      return next
    })
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return tasks.filter((t) => {
      if (statuses.size > 0 && !statuses.has(t.status)) return false
      if (q && !t.title.toLowerCase().includes(q) && !t.id.toLowerCase().includes(q)) return false
      return true
    })
  }, [tasks, search, statuses])

  const columns = useMemo<ColumnDef<DemoTask>[]>(
    () => [
      ...baseColumns,
      {
        key: 'actions',
        header: '',
        align: 'right',
        cell: (t) => (
          <RowActionMenu
            actions={[
              {
                label: 'Open',
                icon: <ExternalLink />,
                onSelect: () => onOpenTask(t.id),
              },
              {
                label: 'Copy id',
                icon: <Copy />,
                onSelect: () => {
                  void navigator.clipboard.writeText(t.id)
                },
              },
              {
                label: 'Delete',
                icon: <Trash2 />,
                destructive: true,
                onSelect: () => setConfirmId(t.id),
              },
            ]}
          />
        ),
      },
    ],
    [onOpenTask],
  )

  const count = (statusList: string[]) =>
    tasks.filter((t) => statusList.includes(t.status)).length

  const confirmTask = confirmId ? (tasks.find((t) => t.id === confirmId) ?? null) : null

  return (
    <>
      <OperationsTablePage
        title="Operations"
        headerActions={
          <Button size="sm" variant="outline">
            New task
          </Button>
        }
        summaryCards={[
          { label: 'Open', value: count(['backlog', 'todo', 'queued']) },
          { label: 'In Progress', value: count(['doing']), accentColor: 'var(--color-status-doing)' },
          { label: 'In Review', value: count(['review']), accentColor: 'var(--color-status-review)' },
          { label: 'Blocked', value: count(['blocked']), accentColor: 'var(--color-status-blocked)' },
        ]}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search tasks by title or id…"
        activeFilterCount={isDefaultStatuses ? 0 : statuses.size}
        filterSummary={
          !isDefaultStatuses
            ? `${statuses.size} status filter${statuses.size === 1 ? '' : 's'} · ${filtered.length} match${filtered.length === 1 ? '' : 'es'}`
            : undefined
        }
        onClear={() => {
          setSearch('')
          setStatuses(new Set(DEFAULT_STATUSES))
        }}
        filterControls={
          <FilterChipGroup
            label="Status"
            chips={STATUS_CHIPS}
            selected={[...statuses]}
            onToggle={toggleStatus}
          />
        }
        items={filtered}
        columns={columns}
        getRowId={(t) => t.id}
        initialSort={{ key: 'updated', dir: 'desc' }}
        selectable
        onRowOpen={(id) => onOpenTask(id)}
        rowAriaLabel={(t) => `Open ${t.title}`}
        emptyState={
          <EmptyState
            variant="no-results"
            title="No tasks"
            description="No tasks match the current filters."
          />
        }
      />
      <ConfirmDialog
        open={confirmId !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmId(null)
        }}
        title="Delete this task?"
        description={
          confirmTask
            ? `This permanently deletes "${confirmTask.title}". This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        onConfirm={() => {
          if (confirmId) setTasks((prev) => prev.filter((t) => t.id !== confirmId))
          setConfirmId(null)
        }}
      />
    </>
  )
}
