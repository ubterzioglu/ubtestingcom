import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import Router, { normalizePath, resolveRoute } from './Router'
import { homeSeo, NON_INDEXABLE_ROBOTS, weiterbildungSeo } from './seo'

function visit(pathname: string) {
  window.history.pushState({}, '', pathname)
}

afterEach(() => {
  visit('/')
})

describe('normalizePath', () => {
  it.each([
    ['/', '/'],
    ['', '/'],
    ['/ubtesting1', '/ubtesting1'],
    ['/ubtesting1/', '/ubtesting1'],
    ['/UBTesting1', '/ubtesting1'],
  ])('normalizes %s to %s', (input, expected) => {
    expect(normalizePath(input)).toBe(expected)
  })
})

describe('resolveRoute', () => {
  it('falls back to the coming-soon page for unknown paths', () => {
    expect(resolveRoute('/nope')).toBe(resolveRoute('/'))
  })

  it('pairs each path with its own SEO description', () => {
    expect(resolveRoute('/').seo).toBe(homeSeo)
    expect(resolveRoute('/ubtesting1').seo).toBe(weiterbildungSeo)
  })
})

describe('Router', () => {
  it('renders the coming-soon page on the root path', () => {
    visit('/')
    render(<Router />)

    expect(screen.getByRole('heading', { level: 1, name: /digital certainty/i })).toBeInTheDocument()
  })

  it('renders the Weiterbildung document on /ubtesting1', () => {
    visit('/ubtesting1')
    render(<Router />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Weiterbildung ve İş Birliği Konsepti' }),
    ).toBeInTheDocument()
  })

  it('applies the SEO tags of the active route', () => {
    visit('/ubtesting1')
    render(<Router />)

    expect(document.title).toBe(weiterbildungSeo.title)
    expect(document.documentElement.lang).toBe('tr')
    expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      NON_INDEXABLE_ROBOTS,
    )
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://ubtesting.com/ubtesting1',
    )
  })

  it('follows browser history navigation', () => {
    visit('/ubtesting1')
    render(<Router />)

    act(() => {
      visit('/')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })

    expect(screen.getByRole('heading', { level: 1, name: /digital certainty/i })).toBeInTheDocument()
    expect(document.title).toBe(homeSeo.title)
    expect(document.documentElement.lang).toBe('en')
  })
})
