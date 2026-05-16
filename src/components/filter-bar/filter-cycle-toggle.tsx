export interface CycleOption<T extends string> {
  value: T
  label: string
  /** Tailwind bg- class for the leading dot; omit for no dot. */
  dotColor?: string
  /** title attribute for the button (tooltip). */
  title?: string
}

interface FilterCycleToggleProps<T extends string> {
  options: readonly [CycleOption<T>, ...CycleOption<T>[]]
  value: T
  onChange: (next: T) => void
  ariaLabel: string
}

/** One-click cycle through a small set of options — mirrors Torque's FilterCycleToggle. */
export function FilterCycleToggle<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: FilterCycleToggleProps<T>) {
  const idx = options.findIndex((o) => o.value === value)
  const active = idx >= 0 ? options[idx] : options[0]
  const nextIdx = idx >= 0 ? (idx + 1) % options.length : 1 % options.length
  const next = options[nextIdx]

  return (
    <button
      type="button"
      aria-label={`${ariaLabel}, current: ${active.label}`}
      title={active.title ?? `${ariaLabel}: ${active.label}`}
      onClick={() => onChange(next.value)}
      className="inline-flex items-center gap-1.5 rounded border border-border bg-panel-2/50 px-2 py-0.5 text-[10px] uppercase tracking-wider text-text-muted transition-all hover:border-border-strong"
    >
      {active.dotColor && (
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${active.dotColor}`} />
      )}
      <span>{active.label}</span>
    </button>
  )
}
