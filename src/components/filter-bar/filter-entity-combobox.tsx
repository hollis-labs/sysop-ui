import { useMemo, useState, type ReactNode } from 'react'
import { ChevronDown, Plus } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { ScrollArea } from '../ui/scroll-area'

export interface FilterEntityComboboxItem {
  id: string
  name: string
  /** Optional trailing count badge. */
  count?: number
  /** Lifecycle status — drives the optional `showStateControls` filter. */
  status?: string | null
  /** ISO timestamp — drives the optional "Last updated" sort. */
  updated_at?: string | null
}

interface FilterEntityComboboxProps {
  icon: ReactNode
  items: FilterEntityComboboxItem[]
  value: string | null
  onChange: (id: string | null) => void
  allLabel: string
  ariaLabel: string
  /** When set, renders a sticky footer button that invokes this callback. */
  onCreate?: () => void
  /** Label for the `onCreate` footer button. Default `Create new`. */
  createLabel?: string
  /**
   * Adds a header row with a "Show inactive" toggle (filters to
   * `status === 'active'`) and an updated/title sort control.
   */
  showStateControls?: boolean
}

/**
 * Searchable single-select entity combobox. Optional `onCreate` adds a sticky
 * "create" footer; optional `showStateControls` adds active-only filtering and
 * an updated/title sort.
 */
export function FilterEntityCombobox({
  icon,
  items,
  value,
  onChange,
  allLabel,
  ariaLabel,
  onCreate,
  createLabel,
  showStateControls = false,
}: FilterEntityComboboxProps) {
  const [open, setOpen] = useState(false)
  const [showInactive, setShowInactive] = useState(false)
  const [sortOrder, setSortOrder] = useState<'updated' | 'title'>('updated')
  const selected = value ? items.find((i) => i.id === value) : null
  const displayLabel = selected?.name ?? allLabel
  const isMuted = selected === null || selected === undefined

  const visibleItems = useMemo(() => {
    const filtered =
      showStateControls && !showInactive
        ? items.filter((item) => !item.status || item.status === 'active')
        : items
    if (!showStateControls) return filtered
    return [...filtered].sort((a, b) => {
      if (sortOrder === 'title') return a.name.localeCompare(b.name)
      return (b.updated_at ?? '').localeCompare(a.updated_at ?? '')
    })
  }, [items, showInactive, showStateControls, sortOrder])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={ariaLabel}
        className="inline-flex h-7 items-center gap-1.5 rounded border border-border bg-panel-2/50 px-2 text-[10px] tracking-wider transition-colors hover:border-border-strong"
      >
        <span className="text-text-soft">{icon}</span>
        <span className={isMuted ? 'text-text-subtle' : 'text-text'}>{displayLabel}</span>
        <ChevronDown className="h-3 w-3 text-text-subtle" />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command className={onCreate ? 'h-[300px]' : undefined}>
          <CommandInput placeholder="Search…" className="h-8 text-[11px]" />
          {showStateControls && (
            <div className="flex items-center gap-2 border-b border-border px-2 py-2 text-[11px]">
              <label className="flex items-center gap-1.5 text-text-soft">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                />
                Show inactive
              </label>
              <select
                className="ml-auto h-7 rounded-md border border-border bg-panel px-2 text-[11px] text-text-muted"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'updated' | 'title')}
                aria-label="Sort order"
              >
                <option value="updated">Last updated</option>
                <option value="title">Title</option>
              </select>
            </div>
          )}
          <ScrollArea className="min-h-0 flex-1">
            <CommandList className="max-h-none">
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value={allLabel}
                  onSelect={() => {
                    onChange(null)
                    setOpen(false)
                  }}
                >
                  <span className="text-text-soft">{allLabel}</span>
                </CommandItem>
                {visibleItems.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={() => {
                      onChange(item.id)
                      setOpen(false)
                    }}
                  >
                    <span className="truncate">{item.name}</span>
                    {item.count !== undefined && (
                      <span className="ml-auto font-mono text-[10px] tabular-nums text-text-subtle">
                        {item.count}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </ScrollArea>
          {onCreate && (
            <>
              <CommandSeparator />
              <div className="sticky bottom-0 border-t border-border bg-popover p-1">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm text-text transition-colors hover:bg-muted"
                  onClick={() => {
                    onCreate()
                    setOpen(false)
                  }}
                >
                  <Plus className="h-3 w-3" />
                  {createLabel ?? 'Create new'}
                </button>
              </div>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
