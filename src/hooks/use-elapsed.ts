import { useEffect, useState } from 'react'

/**
 * Seconds elapsed since `startIso`, updated once per second while mounted.
 * Returns 0 when `startIso` is null or unparseable, so callers can render
 * unconditionally without a loading branch.
 */
export function useElapsed(startIso: string | null): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!startIso) return
    const tick = () => setNow(Date.now())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [startIso])

  if (!startIso) return 0
  const started = Date.parse(startIso)
  if (Number.isNaN(started)) return 0
  return Math.max(0, Math.floor((now - started) / 1000))
}
