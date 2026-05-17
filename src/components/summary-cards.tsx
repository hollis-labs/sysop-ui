export interface SummaryCard {
  label: string
  value: number | string
  subtitle?: string
  /** CSS color for the leading accent dot. */
  accentColor?: string
}

interface SummaryCardsProps {
  cards: SummaryCard[]
}

/** Single-row inline metric strip — mirrors Torque's SummaryCards. */
export function SummaryCards({ cards }: SummaryCardsProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-b border-border-strong bg-bg px-4 py-1.5">
      {cards.map((card, i) => (
        <div key={card.label} className="flex items-center gap-2 text-[11px] leading-none">
          <span
            className="size-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: card.accentColor ?? 'var(--color-text-subtle)' }}
            aria-hidden
          />
          <span className="uppercase tracking-[.16em] text-text-subtle">
            {card.label}
            {card.subtitle && (
              <span className="ml-1 normal-case tracking-normal text-text-subtle/70">
                {card.subtitle}
              </span>
            )}
          </span>
          <span className="font-mono text-[13px] font-semibold tabular-nums text-text">
            {card.value}
          </span>
          {i < cards.length - 1 && <span className="ml-3 h-3 w-px bg-border-strong" aria-hidden />}
        </div>
      ))}
    </div>
  )
}
