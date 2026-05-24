import { useState, type ReactNode } from 'react'
import { ExternalLink, Server, Trash2 } from 'lucide-react'
import {
  ActivityHeatmap,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  BarMeter,
  Button,
  Callout,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  CollapsibleSection,
  Combobox,
  ConfirmDialog,
  CopyableId,
  CopyButton,
  DataTable,
  DetailDialog,
  DetailSection,
  DonutChart,
  EmptyState,
  FilterBar,
  FilterChipGroup,
  FilterCycleToggle,
  FormDialog,
  HourlyPulse,
  Input,
  JsonViewer,
  LiveDot,
  MetaList,
  Metric,
  PageHeader,
  Pill,
  PriorityBadge,
  ProgressBar,
  RecentList,
  RowActionMenu,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SettingsField,
  SettingsGrid,
  SettingsPanel,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  StatusBadge,
  SummaryCards,
  Switch,
  TabStrip,
  Textarea,
  TimeSeriesChart,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  notifyError,
  notifySuccess,
  statusTone,
  STATUS_KEYS,
  type ColumnDef,
  type ComboboxItem,
  type CycleOption,
  type FilterChip,
  type TabStripItem,
} from '../../src'

/* ---- sample data ---- */

interface Service {
  id: string
  name: string
  status: string
  region: string
  uptime: number
}

const SERVICES: Service[] = [
  { id: 'svc_a1b2c3d4', name: 'api-gateway', status: 'doing', region: 'us-east-1', uptime: 99.98 },
  { id: 'svc_e5f6a7b8', name: 'auth-service', status: 'done', region: 'us-east-1', uptime: 99.999 },
  { id: 'svc_c9d0e1f2', name: 'billing-worker', status: 'blocked', region: 'eu-west-1', uptime: 97.4 },
  { id: 'svc_a3b4c5d6', name: 'ingest-pipeline', status: 'queued', region: 'us-west-2', uptime: 99.2 },
  { id: 'svc_e7f8a9b0', name: 'search-indexer', status: 'review', region: 'eu-west-1', uptime: 98.7 },
  { id: 'svc_c1d2e3f4', name: 'notification-hub', status: 'paused', region: 'us-west-2', uptime: 99.6 },
]

const serviceColumns: ColumnDef<Service>[] = [
  { key: 'name', header: 'Service', width: 'fill', cell: (s) => s.name, sortValue: (s) => s.name },
  { key: 'id', header: 'ID', cell: (s) => <CopyableId id={s.id} /> },
  { key: 'status', header: 'Status', cell: (s) => <StatusBadge status={s.status} /> },
  { key: 'region', header: 'Region', cell: (s) => s.region, sortValue: (s) => s.region },
  {
    key: 'uptime',
    header: 'Uptime %',
    align: 'right',
    cell: (s) => <span className="font-mono tabular-nums">{s.uptime.toFixed(2)}</span>,
    sortValue: (s) => s.uptime,
  },
]

const ROUTE_CYCLE: readonly [CycleOption<string>, ...CycleOption<string>[]] = [
  { value: 'both', label: 'Both' },
  { value: 'running', label: 'Running', dotColor: 'bg-status-done' },
  { value: 'stopped', label: 'Stopped', dotColor: 'bg-status-blocked' },
]

const REGIONS: ComboboxItem[] = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'eu-west-1', label: 'EU West (Ireland)' },
]

const TABS: TabStripItem<string>[] = [
  { key: 'launches', label: 'Launches', count: 12 },
  { key: 'sessions', label: 'Sessions', count: 4 },
  { key: 'history', label: 'History' },
]

const STATUS_CHIPS: FilterChip[] = ['doing', 'review', 'done', 'blocked'].map((status) => {
  const tone = statusTone(status)
  return { value: status, activeClassName: `${tone.border} ${tone.bg} ${tone.text}` }
})

/* ---- sample events — timestamped, for the chart / heatmap / pulse widgets ---- */

interface GalleryEvent {
  id: string
  status: 'success' | 'error' | 'running'
  startedAt: string
}

const EVENT_STATUSES: GalleryEvent['status'][] = ['success', 'success', 'success', 'error', 'running']

const GALLERY_EVENTS: GalleryEvent[] = (() => {
  const now = Date.now()
  const out: GalleryEvent[] = []
  for (let i = 0; i < 40; i++) {
    // spread across the last ~16 days, with a cluster in the last 24h
    const daysAgo = i < 8 ? 0 : ((i * 7) % 16)
    const hoursOffset = (i * 5) % 24
    const minutesOffset = (i * 17) % 60
    const ts = new Date(
      now - daysAgo * 24 * 60 * 60 * 1000 - hoursOffset * 60 * 60 * 1000 - minutesOffset * 60 * 1000,
    )
    out.push({
      id: `evt_${String(i).padStart(3, '0')}`,
      status: EVENT_STATUSES[i % EVENT_STATUSES.length],
      startedAt: ts.toISOString(),
    })
  }
  return out
})()

const EVENT_SERIES = [
  {
    key: 'success',
    label: 'Success',
    color: 'var(--color-status-done)',
    value: (e: GalleryEvent) => (e.status === 'success' ? 1 : 0),
  },
  {
    key: 'error',
    label: 'Error',
    color: 'var(--color-status-blocked)',
    value: (e: GalleryEvent) => (e.status === 'error' ? 1 : 0),
  },
  {
    key: 'running',
    label: 'Running',
    color: 'var(--color-status-doing)',
    value: (e: GalleryEvent) => (e.status === 'running' ? 1 : 0),
  },
]

function eventDonutSegments() {
  const count = (s: GalleryEvent['status']) => GALLERY_EVENTS.filter((e) => e.status === s).length
  return [
    { key: 'success', label: 'Success', color: 'var(--color-status-done)', value: count('success') },
    { key: 'error', label: 'Error', color: 'var(--color-status-blocked)', value: count('error') },
    { key: 'running', label: 'Running', color: 'var(--color-status-doing)', value: count('running') },
  ]
}

const EVENT_TONE: Record<GalleryEvent['status'], 'success' | 'danger' | 'warning'> = {
  success: 'success',
  error: 'danger',
  running: 'warning',
}

/* ---- layout helper ---- */

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline gap-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[.18em] text-text-soft">
          {title}
        </h2>
        {note ? <span className="text-[11px] text-text-subtle">{note}</span> : null}
      </div>
      <div className="hud-panel p-4">{children}</div>
    </section>
  )
}

/* ---- gallery ---- */

export function GalleryView() {
  const [search, setSearch] = useState('')
  const [route, setRoute] = useState('both')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [tab, setTab] = useState('launches')
  const [region, setRegion] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [chips, setChips] = useState<string[]>(['doing'])
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [switchOn, setSwitchOn] = useState(true)
  const [checkboxOn, setCheckboxOn] = useState(true)
  const [selectValue, setSelectValue] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="sysop-ui · component gallery" />

      <div className="min-h-0 flex-1 space-y-8 overflow-y-auto p-6">
        <p className="max-w-2xl text-[13px] leading-6 text-text-subtle">
          Individual components shown as swatches. Full-bleed page layouts —
          <code className="px-1 text-text-soft">ListPageLayout</code>,
          <code className="px-1 text-text-soft">OperationsTablePage</code>,
          <code className="px-1 text-text-soft">DetailPageLayout</code> — live on their own
          routes (Operations in the nav rail), since a page layout reads wrong boxed inside a
          card.
        </p>

        <Section title="Buttons">
          <div className="flex flex-wrap items-center gap-2">
            <Button>Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </div>
        </Section>

        <Section title="Status & priority badges" note="StatusBadge · PriorityBadge">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {STATUS_KEYS.map((key) => (
                <StatusBadge key={key} status={key} />
              ))}
              <StatusBadge status="unknown" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge priority={1} />
              <PriorityBadge priority={2} />
              <PriorityBadge priority={3} />
            </div>
          </div>
        </Section>

        <Section title="Badges · CopyableId · CopyButton · Tooltip">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Badge</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <CopyableId id="svc_e5f6a7b8" />
            <CopyableId id="svc_e5f6a7b8" label="copy short id" />
            <CopyButton text="svc_e5f6a7b8" />
            <CopyButton text="svc_e5f6a7b8" label="Copy id" variant="ghost" />
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
              <TooltipContent>Tooltip content</TooltipContent>
            </Tooltip>
          </div>
        </Section>

        <Section title="Settings panel" note="SettingsPanel · SettingsGrid · SettingsField">
          <SettingsPanel title="Runtime" icon={<Server className="h-3.5 w-3.5" />}>
            <SettingsGrid>
              <SettingsField label="HTTP addr">127.0.0.1:5173</SettingsField>
              <SettingsField label="Catalog root">
                <CopyableId
                  id="/Users/example/.hollis/catalog"
                  label="/Users/example/.hollis/catalog"
                />
              </SettingsField>
              <SettingsField label="State">
                <Pill tone="success">running</Pill>
              </SettingsField>
            </SettingsGrid>
          </SettingsPanel>
        </Section>

        <Section title="Pill" note="mini status chip — all tones">
          <div className="flex flex-wrap items-center gap-2">
            <Pill>neutral</Pill>
            <Pill tone="success" dot>
              running
            </Pill>
            <Pill tone="danger" dot>
              failed
            </Pill>
            <Pill tone="warning" dot>
              degraded
            </Pill>
            <Pill tone="info" dot>
              pending
            </Pill>
          </div>
        </Section>

        <Section title="LiveDot" note="pulsing live / running indicator">
          <div className="flex flex-wrap items-center gap-5">
            <LiveDot label="running" />
            <LiveDot tone="success" label="healthy" />
            <LiveDot tone="danger" label="failing" />
            <LiveDot tone="info" label="pending" />
            <LiveDot tone="neutral" label="idle" />
            <LiveDot tone="success" size="md" label="healthy (md)" />
            <LiveDot tone="success" pulsing={false} label="static" />
          </div>
        </Section>

        <Section title="Callout" note="tone-colored alert box — all tones">
          <div className="space-y-3">
            <Callout>The default info callout — a tone-colored notice with an icon.</Callout>
            <Callout tone="success" title="Deployed">
              The service rolled out cleanly across all regions.
            </Callout>
            <Callout tone="warning" title="Degraded">
              Latency is elevated in eu-west-1.
            </Callout>
            <Callout tone="neutral" icon={null}>
              A neutral callout with the icon omitted.
            </Callout>
            <Callout
              tone="danger"
              title="Blocked"
              actions={
                <Button size="sm" variant="outline">
                  Retry
                </Button>
              }
            >
              billing-worker failed its last health check.
            </Callout>
          </div>
        </Section>

        <Section title="Inputs">
          <div className="grid max-w-md gap-3">
            <Input placeholder="Text input" />
            <Textarea placeholder="Textarea" rows={3} />
          </div>
        </Section>

        <Section title="Combobox" note="generic searchable single-select">
          <div className="flex flex-wrap items-center gap-3">
            <Combobox
              items={REGIONS}
              value={region}
              onChange={setRegion}
              ariaLabel="Region"
              placeholder="All regions"
              clearable
              clearLabel="All regions"
            />
            <span className="text-[11px] text-text-subtle">selected: {region ?? '—'}</span>
          </div>
        </Section>

        <Section title="Skeleton">
          <div className="max-w-md space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </Section>

        <Section title="MetaList" note="definition-list metadata pane">
          <MetaList
            columns={3}
            items={[
              { label: 'Region', value: 'us-east-1' },
              { label: 'Connector', value: 'docker' },
              { label: 'Uptime', value: '99.99%' },
              { label: 'Started', value: '2026-05-17 09:14' },
              {
                label: 'Supervisor',
                value: (
                  <Pill tone="success" dot>
                    active
                  </Pill>
                ),
              },
              { label: 'Run from', value: 'launchd' },
            ]}
          />
        </Section>

        <Section title="JsonViewer" note="syntax-highlighted, theme-aware">
          <JsonViewer
            className="max-h-64"
            value={{
              id: 'svc_e5f6a7b8',
              name: 'auth-service',
              running: true,
              replicas: 3,
              region: 'us-east-1',
              config: { timeout: 30, retries: null, flags: ['hsts', 'mtls'] },
            }}
          />
        </Section>

        <Section title="SummaryCards" note="strip — flush in real pages, boxed here for the swatch">
          <div className="-mx-4 -my-4">
            <SummaryCards
              cards={[
                { label: 'Total', value: SERVICES.length },
                { label: 'Running', value: 2, accentColor: 'var(--color-status-done)' },
                { label: 'Attention', value: 1, accentColor: 'var(--color-status-blocked)' },
              ]}
            />
          </div>
        </Section>

        <Section title="TabStrip">
          <div className="-mx-4 -my-4">
            <TabStrip
              tabs={TABS}
              value={tab}
              onChange={setTab}
              actions={
                <Button variant="ghost" size="sm">
                  Refresh
                </Button>
              }
            />
          </div>
        </Section>

        <Section title="FilterBar">
          <div className="-mx-4 -my-4">
            <FilterBar
              searchQuery={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search services…"
              activeFilterCount={route === 'both' ? 0 : 1}
              summary={route === 'both' ? undefined : `route: ${route}`}
              onClear={() => {
                setSearch('')
                setRoute('both')
              }}
            >
              <FilterCycleToggle
                options={ROUTE_CYCLE}
                value={route}
                onChange={setRoute}
                ariaLabel="Route filter"
              />
            </FilterBar>
          </div>
        </Section>

        <Section title="DataTable" note="sortable · selectable · windowed">
          <DataTable
            items={SERVICES}
            columns={serviceColumns}
            getRowId={(s) => s.id}
            initialSort={{ key: 'name', dir: 'asc' }}
            selectable
            onRowOpen={() => setDialogOpen(true)}
            rowAriaLabel={(s) => `Open ${s.name}`}
          />
        </Section>

        <Section title="EmptyState" note="empty · no-results · error">
          <div className="grid gap-4 lg:grid-cols-3">
            <EmptyState
              variant="empty"
              title="No services"
              description="Nothing has been provisioned yet."
            />
            <EmptyState
              variant="no-results"
              title="No matches"
              description="No services match the current filters."
            />
            <EmptyState
              variant="error"
              title="Failed to load"
              description="The services endpoint returned an error."
              action={{ label: 'Retry', onClick: () => undefined }}
            />
          </div>
        </Section>

        <Section title="DetailDialog">
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            Open detail dialog
          </Button>
          <DetailDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            title="auth-service"
            badge={<StatusBadge status="done" />}
            meta={<CopyableId id="svc_e5f6a7b8" />}
            footer={
              <>
                <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
                <Button>Restart</Button>
              </>
            }
          >
            <DetailSection title="Runtime">
              <p className="text-[13px] text-text-soft">Region us-east-1 · uptime 99.999%</p>
            </DetailSection>
            <DetailSection title="Notes">
              <p className="text-[13px] text-text-soft">
                A standardized detail-dialog shell — badge, title, meta, scroll body, sticky
                footer.
              </p>
            </DetailSection>
          </DetailDialog>
        </Section>

        <Section title="FormDialog">
          <Button variant="outline" onClick={() => setFormOpen(true)}>
            Open form dialog
          </Button>
          <FormDialog
            open={formOpen}
            onClose={() => setFormOpen(false)}
            title="New service"
            description="Provision a new service in the selected region."
            onSubmit={() => setFormOpen(false)}
            submitLabel="Create"
          >
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-[.16em] text-text-subtle">
                Name
              </label>
              <Input placeholder="service-name" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-[.16em] text-text-subtle">
                Notes
              </label>
              <Textarea placeholder="Optional notes" rows={3} />
            </div>
          </FormDialog>
        </Section>

        <Section title="FilterChipGroup" note="multi-select facet chips">
          <FilterChipGroup
            label="Status"
            chips={STATUS_CHIPS}
            selected={chips}
            onToggle={(value) =>
              setChips((prev) =>
                prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
              )
            }
          />
        </Section>

        <Section title="Metric" note="dashboard stat block">
          <div className="flex flex-wrap gap-10">
            <Metric label="Total runs" value="1,284" />
            <Metric
              label="Spend (30d)"
              value="$42.18"
              accentColor="var(--color-status-done)"
              hint="estimated"
            />
            <Metric label="Blocked" value={3} accentColor="var(--color-status-blocked)" />
          </div>
        </Section>

        <Section title="ProgressBar" note="determinate · indeterminate">
          <div className="max-w-md space-y-3">
            <ProgressBar value={28} />
            <ProgressBar value={64} />
            <ProgressBar value={92} className="h-2" />
            <ProgressBar indeterminate />
          </div>
        </Section>

        <Section title="CollapsibleSection" note="accent-bordered, collapsible">
          <div className="space-y-2">
            <CollapsibleSection label="Execution context" accent="blue" defaultOpen>
              <p className="text-[13px] text-text-soft">Expanded by default.</p>
            </CollapsibleSection>
            <CollapsibleSection label="Lifecycle rules" accent="amber" summary="3 rules">
              <p className="text-[13px] text-text-soft">Collapsed — click to expand.</p>
            </CollapsibleSection>
            <CollapsibleSection label="Properties" accent="neutral" collapsible={false}>
              <p className="text-[13px] text-text-soft">Always open (collapsible=false).</p>
            </CollapsibleSection>
          </div>
        </Section>

        <Section title="Switch">
          <div className="flex items-center gap-3">
            <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
            <span className="text-[13px] text-text-soft">{switchOn ? 'On' : 'Off'}</span>
          </div>
        </Section>

        <Section title="Checkbox" note="unchecked · checked · indeterminate · disabled">
          <div className="flex flex-wrap items-center gap-6">
            <Checkbox />
            <label className="flex items-center gap-2 text-[13px] text-text-soft">
              <Checkbox checked={checkboxOn} onCheckedChange={setCheckboxOn} />
              Notify on failure
            </label>
            <Checkbox indeterminate />
            <Checkbox disabled />
            <Checkbox checked disabled />
          </div>
        </Section>

        <Section title="Toasts" note="notifySuccess · notifyError — needs a <Toaster /> mounted">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => notifySuccess('Service restarted')}>
              Success toast
            </Button>
            <Button
              variant="outline"
              onClick={() => notifyError(new Error('Health check failed'), 'Something went wrong')}
            >
              Error toast
            </Button>
            <span className="text-[11px] text-text-subtle">
              the demo App mounts a single &lt;Toaster /&gt; for these to render
            </span>
          </div>
        </Section>

        <Section title="Select" note="single-select dropdown">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={selectValue} onValueChange={setSelectValue}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Pick a region" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-[11px] text-text-subtle">selected: {selectValue ?? '—'}</span>
          </div>
        </Section>

        <Section title="Sheet" note="side-panel drawer">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger render={<Button variant="outline">Open sheet</Button>} />
            <SheetContent>
              <SheetHeader>
                <SheetTitle>auth-service</SheetTitle>
                <SheetDescription>
                  A right-anchored drawer for detail panels and side content.
                </SheetDescription>
              </SheetHeader>
              <div className="px-4 text-[13px] text-text-soft">
                Region us-east-1 · uptime 99.999%
              </div>
            </SheetContent>
          </Sheet>
        </Section>

        <Section title="AlertDialog" note="destructive confirmation">
          <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
            <AlertDialogTrigger render={<Button variant="destructive">Delete service</Button>} />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this service?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes the service. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={() => setAlertOpen(false)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Section>

        <Section title="Card" note="bordered content block — not page chrome">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>auth-service</CardTitle>
                <CardDescription>us-east-1 · 3 replicas</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-[13px] text-text-soft">
                  Use Card for framed content inside a scroll body — never to wrap a page
                  layout.
                </p>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardTitle>billing-worker</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[13px] text-text-soft">Compact card (size=&quot;sm&quot;).</p>
              </CardContent>
            </Card>
          </div>
        </Section>

        <Section title="RowActionMenu · ConfirmDialog">
          <div className="flex items-center gap-4">
            <RowActionMenu
              actions={[
                { label: 'Open', icon: <ExternalLink />, onSelect: () => undefined },
                { label: 'Duplicate', onSelect: () => undefined },
                {
                  label: 'Delete',
                  icon: <Trash2 />,
                  destructive: true,
                  onSelect: () => setConfirmOpen(true),
                },
              ]}
            />
            <span className="text-[11px] text-text-subtle">
              the end-of-row “…” menu — Delete opens a ConfirmDialog
            </span>
          </div>
          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title="Delete this item?"
            description="This permanently removes it. This cannot be undone."
            confirmLabel="Delete"
            onConfirm={() => setConfirmOpen(false)}
          />
        </Section>

        <Section title="TimeSeriesChart" note="stacked, day-bucketed — bar & area">
          <div className="grid gap-6 lg:grid-cols-2">
            <TimeSeriesChart
              items={GALLERY_EVENTS}
              date={(e) => e.startedAt}
              series={EVENT_SERIES}
              kind="bar"
              days={16}
              title="Events"
            />
            <TimeSeriesChart
              items={GALLERY_EVENTS}
              date={(e) => e.startedAt}
              series={EVENT_SERIES}
              kind="area"
              days={16}
              title="Events"
            />
          </div>
        </Section>

        <Section title="DonutChart" note="SVG donut with legend">
          <DonutChart
            segments={eventDonutSegments()}
            title="Events by status"
            centerLabel="events"
          />
        </Section>

        <Section title="BarMeter" note="horizontal labeled bars">
          <BarMeter
            title="Events by status"
            rows={eventDonutSegments().map((s) => ({
              key: s.key,
              label: s.label,
              value: s.value,
              color: s.color,
            }))}
          />
        </Section>

        <Section title="ActivityHeatmap" note="GitHub-style calendar heatmap">
          <ActivityHeatmap items={GALLERY_EVENTS} date={(e) => e.startedAt} weekCount={12} />
        </Section>

        <Section title="HourlyPulse" note="last-24h hourly bar strip">
          <HourlyPulse items={GALLERY_EVENTS} timestamp={(e) => e.startedAt} title="Event pulse" />
        </Section>

        <Section title="RecentList" note="recent-items list shell">
          <RecentList
            items={[...GALLERY_EVENTS].sort((a, b) => b.startedAt.localeCompare(a.startedAt))}
            getKey={(e) => e.id}
            title="Recent events"
            limit={6}
            renderItem={(e) => (
              <div className="flex items-center justify-between gap-3 px-1 py-2">
                <span className="flex items-center gap-2">
                  <LiveDot tone={EVENT_TONE[e.status]} pulsing={e.status === 'running'} />
                  <span className="font-mono text-[12px] text-text-soft">{e.id}</span>
                </span>
                <Pill tone={EVENT_TONE[e.status]} dot>
                  {e.status}
                </Pill>
              </div>
            )}
          />
        </Section>
      </div>
    </div>
  )
}
