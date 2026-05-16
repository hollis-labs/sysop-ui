interface PageHeaderProps {
  title: string
  children?: React.ReactNode
}

/** Compact, pinned page header — mirrors Torque's Operations header. */
export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border-strong bg-bg px-4 py-2.5">
      <h1 className="text-[11px] font-semibold uppercase tracking-[.18em] text-text-soft">
        {title}
      </h1>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
