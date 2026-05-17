import type { ReactNode, RefObject } from 'react'
import { cn } from '@/lib/utils'

interface DetailPageLayoutProps {
  /** Pinned detail header — typically a `<DetailHeader>`. */
  header: ReactNode
  /** Optional side panel, pinned to the right of the scroll body. */
  aside?: ReactNode
  /** Width utility class for the aside. Default `w-80`. */
  asideClassName?: string
  /** Ref attached to the main scroll body. */
  scrollRef?: RefObject<HTMLDivElement | null>
  /** Scrollable main content. */
  children: ReactNode
}

/**
 * Standard detail-page shell: a pinned header over a scrollable main region,
 * with an optional pinned side panel. Mirrors the layout Torque's scope and
 * task detail pages compose by hand.
 */
export function DetailPageLayout({
  header,
  aside,
  asideClassName,
  scrollRef,
  children,
}: DetailPageLayoutProps) {
  return (
    <div className="flex h-full flex-col">
      {header}
      <div className="flex min-h-0 flex-1">
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-auto">
          {children}
        </div>
        {aside ? (
          <aside
            className={cn(
              'min-h-0 shrink-0 overflow-auto border-l border-border',
              asideClassName ?? 'w-80',
            )}
          >
            {aside}
          </aside>
        ) : null}
      </div>
    </div>
  )
}
