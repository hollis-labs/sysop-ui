import { createScopedStorage } from './storage'

export interface ListCursor<F> {
  /** Ordered ids of the list as the user last saw it. */
  ids: string[]
  /** The filter state that produced `ids`, for restoring the list view. */
  filter: F | null
}

export interface ListCursorNeighbors {
  /** Position of the current id in the saved list, or -1 when absent. */
  index: number
  /** Previous id in list order, or null at the start / when absent. */
  prevId: string | null
  /** Next id in list order, or null at the end / when absent. */
  nextId: string | null
}

export interface ListCursorHandle<F> {
  /** Persist the ordered ids + the filter that produced them. */
  save: (ids: string[], filter?: F | null) => void
  /** Read the stored cursor; always returns a value (empty when unset). */
  read: () => ListCursor<F>
  /** Drop the stored cursor. */
  clear: () => void
}

/**
 * Compute the prev/next neighbours of `currentId` within `ids`. Pure — share
 * it between a `read()` result and live list state.
 */
export function listCursorNeighbors(ids: string[], currentId: string): ListCursorNeighbors {
  const index = ids.indexOf(currentId)
  return {
    index,
    prevId: index > 0 ? ids[index - 1] : null,
    nextId: index >= 0 && index < ids.length - 1 ? ids[index + 1] : null,
  }
}

/**
 * Session-scoped "list cursor" — the mechanism behind cross-list pagination.
 * A list view calls `save(ids, filter)`; a detail view then reads it to offer
 * prev/next navigation (via {@link listCursorNeighbors}) and to restore the
 * originating filtered list. App-specific filter shapes ride along as `F`.
 */
export function createListCursor<F = unknown>(key: string): ListCursorHandle<F> {
  const store = createScopedStorage<ListCursor<F>>(key, {
    area: 'session',
    parse: (raw) => {
      if (!raw || typeof raw !== 'object') return null
      const obj = raw as Record<string, unknown>
      const ids = Array.isArray(obj.ids)
        ? (obj.ids as unknown[]).filter((v): v is string => typeof v === 'string')
        : []
      return { ids, filter: (obj.filter ?? null) as F | null }
    },
  })
  return {
    save(ids, filter = null) {
      store.write({ ids, filter })
    },
    read() {
      return store.read() ?? { ids: [], filter: null }
    },
    clear() {
      store.clear()
    },
  }
}
