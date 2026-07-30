export const SITE_URL = 'https://ubtesting.com'

export type RouteSeo = {
  /** Absolute path this route is canonical for, e.g. `/ubtesting1`. */
  path: string
  title: string
  description: string
  /** BCP 47 tag applied to `<html lang>`. */
  lang: string
  /** `false` keeps the page out of search indexes and AI answer engines. */
  indexable: boolean
  ogType: 'website' | 'article'
}

export const INDEXABLE_ROBOTS =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
export const NON_INDEXABLE_ROBOTS = 'noindex, nofollow, noarchive, nosnippet'

export const homeSeo: RouteSeo = {
  path: '/',
  title: 'UB Testing — Digital product studio in Berlin',
  description:
    'UB Testing is an independent digital product studio in Berlin. We design, test, and sharpen digital products across product systems, experience design, and quality engineering.',
  lang: 'en',
  indexable: true,
  ogType: 'website',
}

export const weiterbildungSeo: RouteSeo = {
  path: '/ubtesting1',
  title: 'Weiterbildung ve İş Birliği Konsepti — UB Testing',
  description:
    'Job Center ve Agentur für Arbeit üzerinden Bildungsgutschein ve Vermittlungsgutschein ile yapılabilen Weiterbildung ve iş birliği konsepti.',
  lang: 'tr',
  indexable: false,
  ogType: 'article',
}

function upsertTag(selector: string, create: () => HTMLElement): HTMLElement {
  const existing = document.head.querySelector<HTMLElement>(selector)

  if (existing) {
    return existing
  }

  const created = create()
  document.head.append(created)

  return created
}

function setMetaContent(attribute: 'name' | 'property', key: string, content: string): void {
  const tag = upsertTag(`meta[${attribute}="${key}"]`, () => {
    const meta = document.createElement('meta')
    meta.setAttribute(attribute, key)

    return meta
  })

  tag.setAttribute('content', content)
}

/**
 * Keeps the document head in sync with the active route. The static tags in `index.html`
 * cover the home page for crawlers that never run scripts; this only rewrites them.
 */
export function applyRouteSeo(seo: RouteSeo): void {
  const canonical = `${SITE_URL}${seo.path === '/' ? '/' : seo.path}`

  document.documentElement.lang = seo.lang
  document.title = seo.title

  setMetaContent('name', 'description', seo.description)
  setMetaContent('name', 'robots', seo.indexable ? INDEXABLE_ROBOTS : NON_INDEXABLE_ROBOTS)

  setMetaContent('property', 'og:title', seo.title)
  setMetaContent('property', 'og:description', seo.description)
  setMetaContent('property', 'og:type', seo.ogType)
  setMetaContent('property', 'og:url', canonical)

  setMetaContent('name', 'twitter:title', seo.title)
  setMetaContent('name', 'twitter:description', seo.description)

  const link = upsertTag('link[rel="canonical"]', () => {
    const element = document.createElement('link')
    element.rel = 'canonical'

    return element
  })
  link.setAttribute('href', canonical)
}
