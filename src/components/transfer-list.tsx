import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

import { cn } from '../lib/utils'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'

export interface TransferListItem {
  value: string
  label: string
  description?: string
  meta?: string
  keywords?: string[]
}

interface TransferListProps {
  items: TransferListItem[]
  selected: string[]
  onChange: (next: string[]) => void
  availableTitle?: string
  selectedTitle?: string
  emptyAvailableText?: string
  emptySelectedText?: string
  className?: string
}

function matchesQuery(item: TransferListItem, query: string): boolean {
  if (!query) return true
  const haystack = [
    item.value,
    item.label,
    item.description ?? '',
    item.meta ?? '',
    ...(item.keywords ?? []),
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(query)
}

function TransferListPane({
  title,
  search,
  onSearchChange,
  items,
  active,
  onToggle,
  emptyText,
}: {
  title: string
  search: string
  onSearchChange: (value: string) => void
  items: TransferListItem[]
  active: Set<string>
  onToggle: (value: string) => void
  emptyText: string
}) {
  return (
    <div className="flex min-h-0 flex-col rounded-lg border border-border bg-panel/40">
      <div className="border-b border-border px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[11px] uppercase tracking-[.14em] text-text-subtle">{title}</div>
          <div className="font-mono text-[11px] text-text-soft">{items.length}</div>
        </div>
        <label className="mt-2 flex h-8 items-center gap-2 rounded-md border border-border bg-bg px-2 text-text-soft">
          <Search className="h-3.5 w-3.5" />
          <input
            className="min-w-0 flex-1 bg-transparent text-[12px] text-text outline-none placeholder:text-text-subtle"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search models"
          />
        </label>
      </div>
      <ScrollArea className="min-h-[16rem] flex-1">
        <div className="grid gap-1 p-2">
          {items.length === 0 ? (
            <div className="rounded-md border border-dashed border-border px-3 py-6 text-center text-[12px] text-text-subtle">
              {emptyText}
            </div>
          ) : (
            items.map((item) => {
              const selected = active.has(item.value)
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onToggle(item.value)}
                  className={cn(
                    'rounded-md border px-3 py-2 text-left transition-colors',
                    selected
                      ? 'border-border-strong bg-accent/20'
                      : 'border-border bg-bg hover:border-border-strong hover:bg-panel/70',
                  )}
                >
                  <div className="font-mono text-[12px] text-text">{item.label}</div>
                  {item.description ? (
                    <div className="mt-1 text-[11px] text-text-soft">{item.description}</div>
                  ) : null}
                  {item.meta ? (
                    <div className="mt-1 text-[10px] uppercase tracking-[.12em] text-text-subtle">
                      {item.meta}
                    </div>
                  ) : null}
                </button>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export function TransferList({
  items,
  selected,
  onChange,
  availableTitle = 'Available',
  selectedTitle = 'Selected',
  emptyAvailableText = 'No available items.',
  emptySelectedText = 'No selected items.',
  className,
}: TransferListProps) {
  const [availableSearch, setAvailableSearch] = useState('')
  const [selectedSearch, setSelectedSearch] = useState('')
  const [availableActive, setAvailableActive] = useState<Set<string>>(new Set())
  const [selectedActive, setSelectedActive] = useState<Set<string>>(new Set())

  const itemsByValue = useMemo(() => new Map(items.map((item) => [item.value, item])), [items])
  const normalizedSelected = useMemo(
    () => selected.filter((value, index) => itemsByValue.has(value) && selected.indexOf(value) === index),
    [itemsByValue, selected],
  )
  const selectedSet = useMemo(() => new Set(normalizedSelected), [normalizedSelected])
  const availableItems = useMemo(
    () =>
      items.filter(
        (item) => !selectedSet.has(item.value) && matchesQuery(item, availableSearch.trim().toLowerCase()),
      ),
    [availableSearch, items, selectedSet],
  )
  const selectedItems = useMemo(
    () =>
      normalizedSelected
        .map((value) => itemsByValue.get(value))
        .filter((item): item is TransferListItem => Boolean(item))
        .filter((item) => matchesQuery(item, selectedSearch.trim().toLowerCase())),
    [itemsByValue, normalizedSelected, selectedSearch],
  )

  function moveToSelected(values: string[]) {
    if (values.length === 0) return
    const next = [...normalizedSelected]
    for (const value of values) {
      if (!next.includes(value) && itemsByValue.has(value)) next.push(value)
    }
    onChange(next)
    setAvailableActive(new Set())
  }

  function moveToAvailable(values: string[]) {
    if (values.length === 0) return
    const remove = new Set(values)
    onChange(normalizedSelected.filter((value) => !remove.has(value)))
    setSelectedActive(new Set())
  }

  return (
    <div className={cn('grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]', className)}>
      <TransferListPane
        title={availableTitle}
        search={availableSearch}
        onSearchChange={setAvailableSearch}
        items={availableItems}
        active={availableActive}
        onToggle={(value) =>
          setAvailableActive((current) => {
            const next = new Set(current)
            if (next.has(value)) next.delete(value)
            else next.add(value)
            return next
          })
        }
        emptyText={emptyAvailableText}
      />
      <div className="flex items-center justify-center">
        <div className="flex gap-2 sm:flex-col">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => moveToSelected(Array.from(availableActive))}
            disabled={availableActive.size === 0}
            aria-label="Add selected items"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => moveToAvailable(Array.from(selectedActive))}
            disabled={selectedActive.size === 0}
            aria-label="Remove selected items"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <TransferListPane
        title={selectedTitle}
        search={selectedSearch}
        onSearchChange={setSelectedSearch}
        items={selectedItems}
        active={selectedActive}
        onToggle={(value) =>
          setSelectedActive((current) => {
            const next = new Set(current)
            if (next.has(value)) next.delete(value)
            else next.add(value)
            return next
          })
        }
        emptyText={emptySelectedText}
      />
    </div>
  )
}
