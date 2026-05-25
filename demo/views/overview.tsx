import { Activity, Database, Gauge, Mail, Plug, RefreshCw, TerminalSquare } from 'lucide-react'
import { Button, StatusBadge, SummaryCards, cn } from '../../src'
import {
  BarList,
  CompositionBars,
  IntelligenceRow,
  Kpi,
  KpiGrid,
  MiniTrend,
  Panel,
  SignalBars,
} from '../../src/widgets'

// ---------------------------------------------------------------------------
// Static fixture — replace with usePoll / useApi in a real app
// ---------------------------------------------------------------------------

const SUMMARY = [
  { label: 'Sessions', value: 118, subtitle: '19 running', accentColor: 'var(--color-status-done)' },
  { label: 'Tool Calls', value: 2000, subtitle: '142 / 1h', accentColor: 'var(--color-text)' },
  { label: 'Messages', value: 365, subtitle: '66% unread', accentColor: 'var(--color-warning)' },
  { label: 'Events', value: 23400, subtitle: '1K / 1h', accentColor: 'var(--color-status-blocked)' },
]

// 24-bucket trend series (one per hour)
const SESSION_TREND = [4,6,3,5,7,9,11,8,6,5,7,10,12,9,7,6,8,11,14,10,8,7,9,6]
const TOOL_TREND    = [18,22,14,20,28,36,44,32,24,20,28,40,48,36,28,24,32,44,56,40,32,28,36,24]
const MSG_TREND     = [2,3,1,2,3,4,5,4,3,2,3,5,6,4,3,2,4,5,7,5,4,3,4,3]
const EVENT_TREND   = [80,110,70,100,140,180,220,160,120,100,140,200,240,180,140,120,160,220,280,200,160,140,180,120]

function sum(arr: number[]) { return arr.reduce((a, b) => a + b, 0) }
function compact(n: number) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}
function rate(part: number, total: number) {
  return total ? `${Math.round((part / total) * 100)}%` : '0%'
}

const runtimeSeries     = SESSION_TREND.map((v, i) => v + EVENT_TREND[i] / 20)
const interactionSeries = TOOL_TREND.map((v, i) => v + MSG_TREND[i])

const TOP_TOOLS = [
  { label: 'Bash', value: 620 },
  { label: 'Read', value: 441 },
  { label: 'Edit', value: 298 },
  { label: 'Agent', value: 187 },
  { label: 'WebSearch', value: 94 },
]
const TOP_EVENTS = [
  { label: 'tool_call', value: 2000 },
  { label: 'message', value: 365 },
  { label: 'session_start', value: 118 },
  { label: 'session_end', value: 99 },
  { label: 'error', value: 42 },
]
const SESSION_STATES = [
  { label: 'running', value: 19 },
  { label: 'done', value: 84 },
  { label: 'failed', value: 15 },
]
const MSG_SCOPE = [
  { label: 'inbox', value: 242 },
  { label: 'thread', value: 88 },
  { label: 'broadcast', value: 35 },
]
const LATENCY_BANDS = [
  { label: '<100ms', value: 1140 },
  { label: '100–500ms', value: 620 },
  { label: '500ms–2s', value: 188 },
  { label: '>2s', value: 52 },
]

/**
 * Example overview page — shows Panel, Kpi, KpiGrid, MiniTrend, and
 * IntelligenceRow composed with the widget charts (SignalBars, HourlyPulse,
 * BarList, CompositionBars). Use this as the starting point for any
 * instrumentation or admin dashboard in a new app.
 */
export function OverviewView() {
  const errorRate = rate(42, 2000)
  const unreadRate = rate(242, 365)

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-bg">
      {/* Page header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border-strong bg-bg px-4 py-2">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[.18em] text-text-subtle">Agent Ops — Overview</p>
          <p className="mt-0.5 truncate font-mono text-[11px] text-text-subtle">
            catalog root: ~/dev/hollis-labs/agent-workspaces
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status="done" />
          <Button variant="outline" size="sm" disabled>
            <RefreshCw className={cn('h-3.5 w-3.5')} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary strip */}
      <SummaryCards cards={SUMMARY} />

      <div className="min-h-0 flex-1 overflow-auto p-3">
        {/* Row 1 — Activity signal + Intelligence */}
        <div className="grid gap-3 xl:grid-cols-[minmax(0,2fr)_minmax(20rem,0.85fr)]">
          <Panel
            title="Activity Signal"
            icon={<Activity className="h-3.5 w-3.5" />}
            meta={`${compact(sum(SESSION_TREND) + sum(TOOL_TREND) + sum(MSG_TREND) + sum(EVENT_TREND))} sampled events`}
          >
            <KpiGrid cols="grid-cols-2 md:grid-cols-6">
              <Kpi label="Sessions"  value={compact(118)}  sub="19 / running" />
              <Kpi label="Tool Calls" value={compact(2000)} sub="142 / 1h" />
              <Kpi label="Messages"  value={compact(365)}  sub="66 / 24h" />
              <Kpi label="Events"    value={compact(23400)} sub="1K / 1h" />
              <Kpi label="Success"   value="94%" sub={`${errorRate} errors`} />
              <Kpi label="Unread"    value={unreadRate} sub="242 messages" />
            </KpiGrid>
            <SignalBars
              data={runtimeSeries}
              secondaryData={interactionSeries}
              heightClassName="h-56"
              primaryLabel="Runtime"
              secondaryLabel="Interaction"
            />
            <div className="grid md:grid-cols-4">
              <MiniTrend label="Sessions"  value={sum(SESSION_TREND)} data={SESSION_TREND} />
              <MiniTrend label="Tools"     value={sum(TOOL_TREND)}    data={TOOL_TREND} />
              <MiniTrend label="Messages"  value={sum(MSG_TREND)}     data={MSG_TREND} />
              <MiniTrend label="Events"    value={compact(sum(EVENT_TREND))} data={EVENT_TREND} />
            </div>
          </Panel>

          <Panel title="Intelligence" icon={<Gauge className="h-3.5 w-3.5" />}>
            <IntelligenceRow label="Tool reliability"    value="94%"    status="done" />
            <IntelligenceRow label="Session completion"  value="84%"    status="done" />
            <IntelligenceRow label="Slow tool calls"     value={52}     status="doing" />
            <IntelligenceRow label="Inbox pressure"      value={unreadRate} status="inbox" />
            <IntelligenceRow label="Top tool"            value="Bash"   status="indexed" />
            <IntelligenceRow label="Top event"           value="tool_call" status="indexed" />
          </Panel>
        </div>

        {/* Row 2 — four detail panels */}
        <div className="mt-3 grid gap-3 xl:grid-cols-4">
          <Panel
            title="Sessions"
            icon={<TerminalSquare className="h-3.5 w-3.5" />}
            meta="19 running"
          >
            <KpiGrid>
              <Kpi label="Ended"    value={99} />
              <Kpi label="Failed"   value="13%" />
              <Kpi label="Avg Time" value="4m 12s" />
              <Kpi label="Projects" value={7} />
            </KpiGrid>
            <div className="border-b border-border p-3">
              <div className="mb-2 text-[10px] uppercase tracking-[.16em] text-text-subtle">State mix</div>
              <CompositionBars items={SESSION_STATES} />
            </div>
            <div className="border-t border-border">
              <MiniTrend label="24h sessions" value={sum(SESSION_TREND)} data={SESSION_TREND} />
            </div>
          </Panel>

          <Panel
            title="Tool Calls"
            icon={<Plug className="h-3.5 w-3.5" />}
            meta="19 sessions"
          >
            <KpiGrid>
              <Kpi label="p50"    value="84ms" />
              <Kpi label="p95"    value="620ms" />
              <Kpi label="Avg"    value="142ms" />
              <Kpi label="Errors" value={42} accent="var(--color-status-blocked)" />
            </KpiGrid>
            <div className="p-3">
              <div className="mb-2 text-[10px] uppercase tracking-[.16em] text-text-subtle">Top tools</div>
              <BarList items={TOP_TOOLS} />
            </div>
            <div className="border-t border-border p-3">
              <div className="mb-2 text-[10px] uppercase tracking-[.16em] text-text-subtle">Latency bands</div>
              <CompositionBars items={LATENCY_BANDS} />
            </div>
          </Panel>

          <Panel title="Messaging" icon={<Mail className="h-3.5 w-3.5" />}>
            <KpiGrid>
              <Kpi label="Unread"   value={242} accent="var(--color-status-inbox)" />
              <Kpi label="Archived" value={88} />
              <Kpi label="Recent"   value={66} />
              <Kpi label="Kinds"    value={3} />
            </KpiGrid>
            <div className="border-b border-border p-3">
              <div className="mb-2 text-[10px] uppercase tracking-[.16em] text-text-subtle">Scope mix</div>
              <CompositionBars items={MSG_SCOPE} />
            </div>
            <div className="border-t border-border">
              <MiniTrend label="24h messages" value={sum(MSG_TREND)} data={MSG_TREND} />
            </div>
          </Panel>

          <Panel
            title="Event Bus"
            icon={<Database className="h-3.5 w-3.5" />}
            meta="seq 28841"
          >
            <KpiGrid>
              <Kpi label="Total"  value={compact(23400)} />
              <Kpi label="1h"     value={1000} />
              <Kpi label="Scopes" value={4} />
              <Kpi label="Kinds"  value={5} />
            </KpiGrid>
            <div className="p-3">
              <div className="mb-2 text-[10px] uppercase tracking-[.16em] text-text-subtle">Event kinds</div>
              <BarList items={TOP_EVENTS} />
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
