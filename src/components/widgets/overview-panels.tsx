import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { Card, CardContent } from '../ui/card'
import { StatusBadge } from '../status-badge'
import { Sparkbars } from './sparkbars'

function SectionTitle({ icon, title, meta }: { icon: ReactNode; title: string; meta?: ReactNode }) {
  return (
    <div className="flex min-h-9 items-center justify-between gap-3 border-b border-border-strong bg-panel px-3">
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-text-subtle">{icon}</span>
        <h2 className="truncate text-[11px] font-semibold uppercase tracking-[.18em] text-text-muted">
          {title}
        </h2>
      </div>
      {meta && <div className="shrink-0 text-[11px] text-text-subtle">{meta}</div>}
    </div>
  )
}

export interface PanelProps {
  title: string
  icon: ReactNode
  meta?: ReactNode
  children: ReactNode
  className?: string
}

/** Instrumentation panel: titled card with icon header and zero-padding body. */
export function Panel({ title, icon, meta, children, className }: PanelProps) {
  return (
    <Card className={cn('min-h-0 overflow-hidden rounded-none', className)}>
      <SectionTitle title={title} icon={icon} meta={meta} />
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  )
}

export interface KpiProps {
  label: string
  value: ReactNode
  sub?: ReactNode
  accent?: string
}

/** Single KPI cell — label, large mono value, optional sub-label. Use inside KpiGrid. */
export function Kpi({ label, value, sub, accent }: KpiProps) {
  return (
    <div className="min-w-0 border-r border-border px-3 py-2 last:border-r-0">
      <div className="text-[10px] uppercase tracking-[.16em] text-text-subtle">{label}</div>
      <div
        className="mt-1 truncate font-mono text-[20px] leading-none text-text"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </div>
      {sub && <div className="mt-1 truncate text-[11px] text-text-subtle">{sub}</div>}
    </div>
  )
}

export interface KpiGridProps {
  children: ReactNode
  cols?: string
}

/** Grid wrapper that lays out Kpi cells with a bottom border. */
export function KpiGrid({ children, cols = 'grid-cols-2 md:grid-cols-4' }: KpiGridProps) {
  return <div className={cn('grid border-b border-border-strong', cols)}>{children}</div>
}

export interface MiniTrendProps {
  label: string
  value: ReactNode
  data: number[]
}

/** Label + value header with an inline Sparkbars chart below. */
export function MiniTrend({ label, value, data }: MiniTrendProps) {
  return (
    <div className="px-3 py-2">
      <div className="mb-1.5 flex h-4 items-center justify-between gap-3 px-1">
        <span className="text-[10px] uppercase tracking-[.16em] text-text-subtle">{label}</span>
        <span className="font-mono text-[12px] tabular-nums text-text">{value}</span>
      </div>
      <div className="border-y border-border-strong bg-bg px-1 py-1">
        <Sparkbars className="h-8" data={data} />
      </div>
    </div>
  )
}

export interface IntelligenceRowProps {
  label: string
  value: ReactNode
  status?: string
}

/** Key/value row with a StatusBadge indicator. Stack inside a Panel for a status digest. */
export function IntelligenceRow({ label, value, status = 'done' }: IntelligenceRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2 last:border-b-0">
      <span className="min-w-0 truncate text-[12px] text-text-soft">{label}</span>
      <div className="flex shrink-0 items-center gap-2">
        <span className="font-mono text-[12px] tabular-nums text-text">{value}</span>
        <StatusBadge status={status} />
      </div>
    </div>
  )
}
