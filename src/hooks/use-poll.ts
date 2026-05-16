import { useCallback, useEffect, useRef, useState } from 'react'

export interface UsePollResult<TData> {
  data: TData | null
  error: unknown
  isLoading: boolean
  /** Force an immediate re-fetch. */
  refetch: () => Promise<void>
}

export type PollFetcher<TData> = (signal: AbortSignal) => Promise<TData>

type RefreshListener = () => void

const DEFAULT_INTERVAL_MS = 15_000
const refreshListeners = new Set<RefreshListener>()

function subscribeToRefresh(listener: RefreshListener) {
  refreshListeners.add(listener)
  return () => {
    refreshListeners.delete(listener)
  }
}

/** Trigger a re-fetch on every mounted `usePoll` instance. */
export function refreshPolledData() {
  for (const listener of refreshListeners) {
    listener()
  }
}

/**
 * Poll an async fetcher on an interval, pausing while the tab is hidden and
 * aborting in-flight requests on unmount / re-fetch. `intervalMs <= 0`
 * disables the interval (fetch-once).
 */
export function usePoll<TData>(
  fetcher: PollFetcher<TData>,
  intervalMs = DEFAULT_INTERVAL_MS,
): UsePollResult<TData> {
  const [data, setData] = useState<TData | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isMountedRef = useRef(true)
  const intervalRef = useRef<number | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const dataRef = useRef<TData | null>(null)

  // Latest props are mirrored into refs (in an effect, never during render) so
  // the polling callbacks below stay referentially stable.
  const fetcherRef = useRef(fetcher)
  const intervalMsRef = useRef(intervalMs)
  const runFetchRef = useRef<((showLoading: boolean) => Promise<void>) | null>(null)

  const clearScheduledPoll = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearTimeout(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const scheduleNextPoll = useCallback(() => {
    clearScheduledPoll()
    if (document.hidden || intervalMsRef.current <= 0) {
      return
    }
    intervalRef.current = window.setTimeout(() => {
      void runFetchRef.current?.(false)
    }, intervalMsRef.current)
  }, [clearScheduledPoll])

  const runFetch = useCallback(
    async (showLoading: boolean) => {
      abortControllerRef.current?.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller

      if (showLoading) {
        setIsLoading(true)
      }

      try {
        const nextData = await fetcherRef.current(controller.signal)
        if (!isMountedRef.current || controller.signal.aborted) {
          return
        }
        setData(nextData)
        dataRef.current = nextData
        setError(null)
      } catch (cause) {
        if (!isMountedRef.current || controller.signal.aborted) {
          return
        }
        setError(cause)
      } finally {
        if (isMountedRef.current && !controller.signal.aborted) {
          setIsLoading(false)
          scheduleNextPoll()
        }
      }
    },
    [scheduleNextPoll],
  )

  // Sync the latest fetcher / interval / runFetch into their refs.
  useEffect(() => {
    fetcherRef.current = fetcher
    intervalMsRef.current = intervalMs
    runFetchRef.current = runFetch
  })

  useEffect(() => {
    isMountedRef.current = true
    // Fetch-on-mount. `runFetch(false)` performs no synchronous setState — its
    // setData/setError/setIsLoading calls all happen after an `await`, which
    // the rule permits; the linter just can't trace the async boundary through
    // a useCallback.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void runFetch(false)

    return () => {
      isMountedRef.current = false
      clearScheduledPoll()
      abortControllerRef.current?.abort()
    }
  }, [runFetch, clearScheduledPoll])

  useEffect(() => {
    return subscribeToRefresh(() => {
      void runFetch(dataRef.current === null)
    })
  }, [runFetch])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearScheduledPoll()
        abortControllerRef.current?.abort()
        return
      }
      void runFetch(dataRef.current === null)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [runFetch, clearScheduledPoll])

  const refetch = useCallback(async () => {
    await runFetch(dataRef.current === null)
  }, [runFetch])

  return { data, error, isLoading, refetch }
}

// TODO: Phase 2 — migrate to SSE once backends emit events.
