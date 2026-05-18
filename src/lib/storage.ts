export type StorageArea = 'local' | 'session'

export interface ScopedStorage<T> {
  /** Read + parse the stored value, or null when absent / unreadable. */
  read: () => T | null
  /** Serialize + persist `value`. Fails quiet when storage is unavailable. */
  write: (value: T) => void
  /** Remove the key. */
  clear: () => void
}

export interface ScopedStorageOptions<T> {
  /** Which web storage to use. Default `local`. */
  area?: StorageArea
  /**
   * Validates / normalizes the raw `JSON.parse` output into `T`. Return null
   * to reject malformed data. Without it, the parsed value is trusted as `T`.
   */
  parse?: (raw: unknown) => T | null
}

function storageFor(area: StorageArea): Storage | null {
  try {
    return area === 'session' ? window.sessionStorage : window.localStorage
  } catch {
    // Access itself can throw in sandboxed frames.
    return null
  }
}

/**
 * Typed, fail-quiet wrapper over `localStorage` / `sessionStorage`. Every
 * operation is guarded — private mode, quota limits, and sandboxed frames
 * degrade to a no-op rather than throwing. Pass `parse` to validate untrusted
 * stored blobs (schema drift, hand-edited values).
 */
export function createScopedStorage<T>(
  key: string,
  options: ScopedStorageOptions<T> = {},
): ScopedStorage<T> {
  const { area = 'local', parse } = options
  return {
    read() {
      const store = storageFor(area)
      if (!store) return null
      try {
        const raw = store.getItem(key)
        if (raw == null) return null
        const parsed: unknown = JSON.parse(raw)
        return parse ? parse(parsed) : (parsed as T)
      } catch {
        return null
      }
    },
    write(value) {
      const store = storageFor(area)
      if (!store) return
      try {
        store.setItem(key, JSON.stringify(value))
      } catch {
        // quota / availability — fail quiet
      }
    },
    clear() {
      const store = storageFor(area)
      if (!store) return
      try {
        store.removeItem(key)
      } catch {
        // ignore
      }
    },
  }
}
