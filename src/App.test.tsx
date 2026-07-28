import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('Coming soon experience', () => {
  it('announces the studio and launch state', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /digital certainty/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(/a new studio experience is taking shape/i)).toBeInTheDocument()
  })

  it('provides a direct early-access contact action', () => {
    render(<App />)

    expect(screen.getByRole('link', { name: /request early access/i })).toHaveAttribute(
      'href',
      expect.stringMatching(/^mailto:hello@ubtesting\.com/),
    )
  })

  it('exposes the live build status to assistive technology', () => {
    render(<App />)

    expect(screen.getByRole('status')).toHaveTextContent(/currently calibrating/i)
  })

  it('includes a descriptive main landmark', () => {
    render(<App />)

    expect(screen.getByRole('main')).toHaveAccessibleName('UB Testing introduction')
  })
})
