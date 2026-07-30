import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import WeiterbildungPage from './WeiterbildungPage'
import { weiterbildungSections } from './weiterbildungContent'

describe('Weiterbildung document route', () => {
  it('renders the document heading and intro', () => {
    render(<WeiterbildungPage />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Weiterbildung ve İş Birliği Konsepti' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/konu akışına göre bölümlendirilmiştir/i)).toBeInTheDocument()
  })

  it('renders every section with its full content', () => {
    render(<WeiterbildungPage />)

    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(weiterbildungSections.length)

    for (const section of weiterbildungSections) {
      const heading = screen.getByRole('heading', { level: 2, name: section.title })
      const container = heading.closest('section')

      expect(container).not.toBeNull()
      expect(container).toHaveAttribute('id', section.id)
      expect(container?.querySelectorAll('li')).toHaveLength(section.items.length)
    }
  })

  it('links the table of contents to each section anchor', () => {
    render(<WeiterbildungPage />)

    const toc = screen.getByRole('navigation', { name: 'İçindekiler' })
    const links = [...toc.querySelectorAll('a')]

    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      weiterbildungSections.map((section) => `#${section.id}`),
    )
  })

  it('offers a way back to the coming-soon page', () => {
    render(<WeiterbildungPage />)

    expect(screen.getByRole('link', { name: /ubtesting\.com/i })).toHaveAttribute('href', '/')
  })
})
