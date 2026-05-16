import { describe, expect, it, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { FilterCycleToggle, type CycleOption } from '@/components/filter-bar/filter-cycle-toggle'

const OPTIONS: readonly [CycleOption<'a' | 'b' | 'c'>, ...CycleOption<'a' | 'b' | 'c'>[]] = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
]

describe('FilterCycleToggle', () => {
  it('renders the label for the active option', () => {
    const { getByText } = render(
      <FilterCycleToggle options={OPTIONS} value="b" onChange={() => {}} ariaLabel="Phase" />,
    )
    expect(getByText('Beta')).toBeTruthy()
  })

  it('advances to the next option on click', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <FilterCycleToggle options={OPTIONS} value="a" onChange={onChange} ariaLabel="Phase" />,
    )
    fireEvent.click(getByRole('button'))
    expect(onChange).toHaveBeenCalledWith('b')
  })

  it('wraps around from the last option to the first', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <FilterCycleToggle options={OPTIONS} value="c" onChange={onChange} ariaLabel="Phase" />,
    )
    fireEvent.click(getByRole('button'))
    expect(onChange).toHaveBeenCalledWith('a')
  })
})
