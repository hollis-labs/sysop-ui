import { useEffect, useState } from 'react'

export interface SSEMessage {
  /** Event name — `message` for unnamed events, else the stream's `event:` field. */
  type: string
  /** Raw `data:` payload string. */
  data: string
  /** Parsed JSON of `data`, or null when it is not valid JSON. */
  json: unknown
}

export interface UseSSEOptions {
  /** Named event types to listen for. Omit to read the default `message` stream. */
  events?: string[]
  /** Send cookies / credentials with the SSE request. */
  withCredentials?: boolean
  /** Disable without unmounting — closes the connection. Default true. */
  enabled?: boolean
}

export interface UseSSEResult {
  /** The most recent event received. */
  lastEvent: SSEMessage | null
  /** True while the connection is open. */
  connected: boolean
}

function toMessage(e: MessageEvent, type: string): SSEMessage {
  let json: unknown = null
  try {
    json = JSON.parse(e.data)
  } catch {
    // payload is not JSON — leave json null
  }
  return { type, data: e.data, json }
}

/**
 * Subscribe to a Server-Sent Events stream. Opens an `EventSource` at `url`
 * (pass null to stay closed) and surfaces the latest event plus connection
 * state. The browser auto-reconnects on transient drops. Apps with a typed
 * API client can keep their own wrapper; this is the generic primitive.
 */
export function useSSE(url: string | null, options: UseSSEOptions = {}): UseSSEResult {
  const { events, withCredentials, enabled = true } = options
  const [lastEvent, setLastEvent] = useState<SSEMessage | null>(null)
  const [connected, setConnected] = useState(false)
  // Serialized for the dep array so a fresh array literal doesn't re-subscribe.
  const eventsKey = events ? events.join(',') : ''

  useEffect(() => {
    if (!enabled || !url) {
      // Reset when the stream is intentionally closed.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConnected(false)
      return
    }
    const source = new EventSource(url, { withCredentials })
    source.onopen = () => setConnected(true)
    source.onerror = () => setConnected(false)

    const handle = (type: string) => (e: MessageEvent) => setLastEvent(toMessage(e, type))
    const named = events && events.length > 0

    if (named) {
      const handlers = events.map((t) => [t, handle(t) as EventListener] as const)
      for (const [t, h] of handlers) source.addEventListener(t, h)
      return () => {
        for (const [t, h] of handlers) source.removeEventListener(t, h)
        source.close()
      }
    }

    source.onmessage = handle('message')
    return () => source.close()
    // `events` is serialized into `eventsKey`; the raw array would re-run every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, enabled, withCredentials, eventsKey])

  return { lastEvent, connected }
}
