import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { ScrollArea } from '../ui/scroll-area'

export interface FilterEntityComboboxItem {
  id: string
  name: string
  /** Optional trailing count badge. */
  count?: number
}

interface FilterEntityComboboxProps {
  icon: ReactNode
  items: FilterEntityComboboxItem[]
  value: string | null
  onChange: (id: string | null) => void
  allLabel: string
  ariaLabel: string
}

/** Searchable single-select combobox — mirrors Torque's FilterEntityCombobox. */
export function FilterEntityCombobox({
  icon,
  items,
  value,
  onChange,
  allLabel,
  ariaLabel,
}: FilterEntityComboboxProps) {
  const [open, setOpen] = useState(false)
  const selected = value ? items.find((i) => i.id === value) : null
  const displayLabel = selected?.name ?? allLabel
  const isMuted = selected === null || selected === undefined

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
        <Command>
          <CommandInput placeholder="Search…" className="h-8 text-[11px]" />
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
                {items.map((item) => (
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
        </Command>
      </PopoverContent>
    </Popover>
  )
}
