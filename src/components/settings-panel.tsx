import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

export interface SettingsPanelProps {
  title: string
  icon?: ReactNode
  children: ReactNode
  className?: string
}

export interface SettingsGridProps {
  children: ReactNode
  className?: string
}

export interface SettingsFieldProps {
  label: string
  children: ReactNode
  className?: string
  labelClassName?: string
  valueClassName?: string
}

export interface SettingsNoticeProps {
  title: string
  description: string
  tone?: 'warning' | 'danger' | 'info'
  className?: string
}

export interface SettingsStatusPillProps {
  pending: boolean
  pendingLabel?: string
  currentLabel?: string
}

/**
 * Compact settings section used inside operations/settings pages. It matches
 * the Sysop page vocabulary: full-width bands, tight section headers, and
 * dense value rows instead of nested cards.
 */
export function SettingsPanel({ title, icon, children, className }: SettingsPanelProps) {
  return (
    <section
      className={cn('min-w-0 border-b border-border-strong bg-panel last:border-b-0', className)}
    >
      <div className="flex h-9 items-center gap-2 border-b border-border px-4 text-text-subtle">
        {icon ? <span className="shrink-0 text-text-subtle">{icon}</span> : null}
        <h2 className="truncate text-[11px] font-semibold uppercase tracking-[.18em] text-text-muted">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

export function SettingsGrid({ children, className }: SettingsGridProps) {
  return (
    <dl
      className={cn(
        'grid grid-cols-[10rem_minmax(0,1fr)] gap-x-4 gap-y-2 px-4 py-3 text-[12px]',
        className,
      )}
    >
      {children}
    </dl>
  )
}

export function SettingsField({
  label,
  children,
  className,
  labelClassName,
  valueClassName,
}: SettingsFieldProps) {
  return (
    <div className={cn('contents', className)}>
      <dt className={cn('truncate text-text-subtle', labelClassName)}>{label}</dt>
      <dd className={cn('min-w-0 break-words text-text-soft', valueClassName)}>{children}</dd>
    </div>
  )
}

export function SettingsNotice({
  title,
  description,
  tone = 'warning',
  className,
}: SettingsNoticeProps) {
  const toneClassName =
    tone === 'danger'
      ? 'border-status-blocked/30 bg-status-blocked/10 text-status-blocked'
      : tone === 'info'
        ? 'border-status-indexed/30 bg-status-indexed/10 text-status-indexed'
        : 'border-status-running/30 bg-status-running/10 text-status-running'

  return (
    <div className={cn('rounded border px-3 py-2', toneClassName, className)}>
      <div className="text-[11px] font-semibold uppercase tracking-[.14em]">{title}</div>
      <div className="mt-1 text-[12px] text-text-soft">{description}</div>
    </div>
  )
}

export function SettingsStatusPill({
  pending,
  pendingLabel = 'reload required',
  currentLabel = 'current',
}: SettingsStatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium',
        pending
          ? 'border-status-running/30 bg-status-running/10 text-status-running'
          : 'border-status-done/30 bg-status-done/10 text-status-done',
      )}
    >
      {pending ? pendingLabel : currentLabel}
    </span>
  )
}
