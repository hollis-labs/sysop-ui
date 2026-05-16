import { createContext, useContext, type ReactNode } from 'react'

/**
 * API context factory. The kit can't know an app's concrete client shape, so
 * instead of a fixed context it exposes a factory: call it once with your
 * client and get back a typed `{ ApiProvider, useApi }` pair.
 *
 *   // app/api-context.tsx
 *   import { createApiContext } from '@hollis-labs/sysop-ui'
 *   import { apiClient } from './api'
 *   export const { ApiProvider, useApi } = createApiContext(apiClient)
 */
export interface ApiContextHandle<TClient> {
  /** Wrap the app; an optional `client` prop overrides the default (tests). */
  ApiProvider: (props: { children: ReactNode; client?: TClient }) => ReactNode
  /** Read the current client from context. */
  useApi: () => TClient
}

export function createApiContext<TClient>(defaultClient: TClient): ApiContextHandle<TClient> {
  const Context = createContext<TClient>(defaultClient)

  function ApiProvider({
    children,
    client = defaultClient,
  }: {
    children: ReactNode
    client?: TClient
  }) {
    return <Context.Provider value={client}>{children}</Context.Provider>
  }

  function useApi(): TClient {
    return useContext(Context)
  }

  return { ApiProvider, useApi }
}
