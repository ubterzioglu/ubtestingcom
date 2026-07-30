import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  applyRouteSeo,
  homeSeo,
  INDEXABLE_ROBOTS,
  NON_INDEXABLE_ROBOTS,
  weiterbildungSeo,
} from './seo'

const metaContent = (selector: string) =>
  document.head.querySelector(selector)?.getAttribute('content')

beforeEach(() => {
  document.head.innerHTML = ''
  document.documentElement.lang = 'en'
})

afterEach(() => {
  document.head.innerHTML = ''
})

describe('applyRouteSeo', () => {
  it('describes the home page as indexable', () => {
    applyRouteSeo(homeSeo)

    expect(document.title).toBe(homeSeo.title)
    expect(document.documentElement.lang).toBe('en')
    expect(metaContent('meta[name="description"]')).toBe(homeSeo.description)
    expect(metaContent('meta[name="robots"]')).toBe(INDEXABLE_ROBOTS)
    expect(metaContent('meta[property="og:url"]')).toBe('https://ubtesting.com/')
    expect(metaContent('meta[property="og:type"]')).toBe('website')
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://ubtesting.com/',
    )
  })

  it('keeps the private document out of search indexes', () => {
    applyRouteSeo(weiterbildungSeo)

    expect(document.documentElement.lang).toBe('tr')
    expect(metaContent('meta[name="robots"]')).toBe(NON_INDEXABLE_ROBOTS)
    expect(metaContent('meta[property="og:url"]')).toBe('https://ubtesting.com/ubtesting1')
    expect(metaContent('meta[property="og:type"]')).toBe('article')
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://ubtesting.com/ubtesting1',
    )
  })

  it('rewrites the tags shipped in index.html instead of duplicating them', () => {
    document.head.innerHTML = `
      <meta name="description" content="static" />
      <meta property="og:title" content="static" />
      <link rel="canonical" href="https://ubtesting.com/" />
    `

    applyRouteSeo(weiterbildungSeo)
    applyRouteSeo(homeSeo)

    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1)
    expect(document.head.querySelectorAll('meta[property="og:title"]')).toHaveLength(1)
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1)
    expect(metaContent('meta[property="og:title"]')).toBe(homeSeo.title)
  })

  it('mirrors the social tags for both networks', () => {
    applyRouteSeo(homeSeo)

    expect(metaContent('meta[name="twitter:title"]')).toBe(
      metaContent('meta[property="og:title"]'),
    )
    expect(metaContent('meta[name="twitter:description"]')).toBe(
      metaContent('meta[property="og:description"]'),
    )
  })
})
