import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Unmount React trees between tests — RTL's auto-cleanup only registers when
// vitest globals are enabled, and this package runs with `globals: false`.
afterEach(() => {
  cleanup()
})
