import { useCallback, useEffect, useState } from 'react'

export interface RouterConfig<R extends string> {
  /** All valid route names. Pass `as const` for full type narrowing. */
  routes: readonly R[]
  /** Route to use when the URL doesn't match any known route. */
  default: R
  /**
   * URL prefix shared by all routes. Must start with '/'. Trailing slash is
   * normalised automatically. Default: '/'.
   *
   * Example: '/operations' for a Go-embedded app mounted at that path.
   */
  basePath?: string
  /**
   * Override the URL path segment for specific routes.
   * Useful when the default route maps to the bare base URL (empty string).
   *
   * Example: `{ overview: '' }` → overview lives at `/operations/` not `/operations/overview`
   */
  paths?: Partial<Record<R, string>>
}

/**
 * Creates a lightweight pushState router for single-page apps.
 * Returns a `useRoute` hook that provides the current route and a navigate
 * function. The URL always reflects the current route, so refreshing the
 * page restores the same view. Back/forward buttons work automatically.
 *
 * Usage:
 * ```ts
 * // Define once, outside any component
 * const useRoute = createRouter({
 *   routes: ['overview', 'operations', 'settings'] as const,
 *   default: 'overview',
 *   basePath: '/operations',
 * })
 *
 * // In your App component
 * const { route, navigate } = useRoute()
 * ```
 *
 * For apps that use React.lazy, pair with <Suspense> around the active page.
 */
export function createRouter<R extends string>(config: RouterConfig<R>) {
  const { routes, default: defaultRoute, basePath = '/', paths = {} } = config

  // Normalise: always ends with exactly one slash
  const base = basePath.replace(/\/*$/, '/')

  // Build bidirectional route ↔ URL-segment maps
  const routeToSegment: Record<string, string> = {}
  const segmentToRoute = new Map<string, R>()
  for (const r of routes) {
    const seg = (paths as Record<string, string>)[r] ?? r
    routeToSegment[r] = seg
    segmentToRoute.set(seg, r)
  }

  /** Derive the active route from window.location.pathname. */
  function parseUrl(): R {
    const path = window.location.pathname
    // Strip the base prefix; what remains is the route segment (or empty)
    const rel = path.startsWith(base)
      ? path.slice(base.length)
      : path.startsWith(base.slice(0, -1))
        ? ''
        : path.slice(1)
    const segment = rel.split('/')[0]
    return segmentToRoute.get(segment) ?? defaultRoute
  }

  /** Build the canonical URL for a route. */
  function urlFor(route: R): string {
    const seg = routeToSegment[route]
    return seg ? `${base}${seg}` : base
  }

  /**
   * Hook returned by `createRouter`. Call it inside your App component.
   * Returns `{ route, navigate }`.
   */
  return function useRoute(): { route: R; navigate: (to: R) => void } {
    const [route, setRoute] = useState<R>(parseUrl)

    useEffect(() => {
      // Normalise the URL on first render so the address bar always shows a
      // canonical path (e.g. bare '/' → '/overview').
      const canonical = urlFor(parseUrl())
      if (window.location.pathname !== canonical) {
        window.history.replaceState(null, '', canonical)
      }

      const onPop = () => setRoute(parseUrl())
      window.addEventListener('popstate', onPop)
      return () => window.removeEventListener('popstate', onPop)
    }, [])

    // navigate does NOT reload the page — it updates the URL and React state only.
    const navigate = useCallback((to: R) => {
      const url = urlFor(to)
      if (window.location.pathname !== url) {
        window.history.pushState(null, '', url)
      }
      setRoute(to)
    }, [])

    return { route, navigate }
  }
}
