import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { StatusBadge } from '@/components/status-badge'

describe('StatusBadge', () => {
  it('renders the status label', () => {
    const { getByText } = render(<StatusBadge status="doing" />)
    expect(getByText('doing')).toBeTruthy()
  })

  it('applies the themed status tone for a known status', () => {
    const { getByText } = render(<StatusBadge status="blocked" />)
    const badge = getByText('blocked').closest('span')?.parentElement
    // The label is derived from the status token via color-mix; the fill and
    // border use the token directly.
    expect(badge?.className).toContain('--color-status-blocked')
    expect(badge?.className).toContain('bg-status-blocked/10')
    expect(badge?.className).toContain('border-status-blocked/40')
  })

  it('falls back to the neutral tone for an unknown status', () => {
    const { getByText } = render(<StatusBadge status="weird" />)
    const badge = getByText('weird').closest('span')?.parentElement
    expect(badge?.className).toContain('text-text-soft')
  })

  it('shows "unknown" when status is empty', () => {
    const { getByText } = render(<StatusBadge status="" />)
    expect(getByText('unknown')).toBeTruthy()
  })

  it('forwards an extra className', () => {
    const { getByText } = render(<StatusBadge status="done" className="mt-1" />)
    const badge = getByText('done').closest('span')?.parentElement
    expect(badge?.className).toContain('mt-1')
  })
})
