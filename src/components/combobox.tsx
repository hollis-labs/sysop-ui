import { useState, type ReactNode } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { ScrollArea } from './ui/scroll-area'

export interface ComboboxItem {
  value: string
  label: string
  /** Optional leading icon. */
  icon?: ReactNode
}

interface ComboboxProps {
  items: ComboboxItem[]
  value: string | null
  onChange: (value: string | null) => void
  /** Accessible label for the trigger. */
  ariaLabel: string
  /** Trigger label shown when nothing is selected. */
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  /** Leading icon rendered in the trigger. */
  icon?: ReactNode
  /** Render a clear-selection item at the top of the list. */
  clearable?: boolean
  clearLabel?: string
}

/**
 * Generic single-select combobox — a popover-anchored, searchable list built
 * on the `Command` + `Popover` primitives. The filter-coupled
 * `FilterEntityCombobox` is a specialization of this same pattern.
 */
export function Combobox({
  items,
  value,
  onChange,
  ariaLabel,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  emptyText = 'No results.',
  icon,
  clearable = false,
  clearLabel = 'Clear',
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const selected = value ? (items.find((i) => i.value === value) ?? null) : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={ariaLabel}
        className="inline-flex h-7 items-center gap-1.5 rounded border border-border bg-panel-2/50 px-2 text-[10px] tracking-wider transition-colors hover:border-border-strong"
      >
        {icon ? <span className="text-text-soft">{icon}</span> : null}
        <span className={selected ? 'text-text' : 'text-text-subtle'}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown className="h-3 w-3 text-text-subtle" />
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-8 text-[11px]" />
          <ScrollArea className="min-h-0 flex-1">
            <CommandList className="max-h-none">
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {clearable ? (
                  <CommandItem
                    value={clearLabel}
                    onSelect={() => {
                      onChange(null)
                      setOpen(false)
                    }}
                  >
                    <span className="text-text-subtle">{clearLabel}</span>
                  </CommandItem>
                ) : null}
                {items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    onSelect={() => {
                      onChange(item.value)
                      setOpen(false)
                    }}
                  >
                    {item.icon ? <span className="text-text-soft">{item.icon}</span> : null}
                    <span className="flex-1">{item.label}</span>
                    {item.value === value ? (
                      <Check className="h-3.5 w-3.5 text-status-routed" />
                    ) : null}
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
