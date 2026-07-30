import { expect, test } from '@playwright/test'

test('the home page ships crawler-ready metadata', async ({ page }) => {
  const response = await page.goto('/')

  expect(response?.status()).toBe(200)

  await expect(page).toHaveTitle('UB Testing — Digital product studio in Berlin')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://ubtesting.com/',
  )
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /^index, follow/)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Berlin/)
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://ubtesting.com/og-image.png',
  )
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image',
  )
  await expect(page.locator('meta[name="geo.region"]')).toHaveAttribute('content', 'DE-BE')

  // the client-side SEO pass must rewrite the static tags, never duplicate them
  for (const selector of [
    'meta[name="description"]',
    'meta[name="robots"]',
    'meta[property="og:title"]',
    'meta[property="og:url"]',
    'link[rel="canonical"]',
  ]) {
    await expect(page.locator(selector)).toHaveCount(1)
  }
})

test('the home page exposes valid structured data', async ({ page }) => {
  await page.goto('/')

  const payload = await page.locator('script[type="application/ld+json"]').textContent()
  const graph = JSON.parse(payload ?? '')

  expect(graph['@context']).toBe('https://schema.org')
  expect(graph['@graph'].map((node: { '@type': string }) => node['@type'])).toEqual([
    'Organization',
    'WebSite',
    'WebPage',
  ])

  const organization = graph['@graph'][0]
  expect(organization.name).toBe('UB Testing')
  expect(organization.email).toBe('hello@ubtesting.com')
  expect(organization.address.addressLocality).toBe('Berlin')
  expect(organization.address.addressCountry).toBe('DE')
  expect(organization.location.geo.latitude).toBe(52.52)
})

test('the private document is excluded from search indexes', async ({ page }) => {
  await page.goto('/ubtesting1')

  await expect(page.locator('html')).toHaveAttribute('lang', 'tr')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, nofollow, noarchive, nosnippet',
  )
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://ubtesting.com/ubtesting1',
  )
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article')
})

test('crawler files and social artwork are served', async ({ page }) => {
  const documents = [
    ['/robots.txt', 'Sitemap: https://ubtesting.com/sitemap.xml'],
    ['/robots.txt', 'Disallow: /ubtesting1'],
    ['/sitemap.xml', '<loc>https://ubtesting.com/</loc>'],
    ['/llms.txt', '# UB Testing'],
    ['/site.webmanifest', '"start_url": "/"'],
  ] as const

  for (const [path, needle] of documents) {
    const response = await page.request.get(path)

    expect(response.status(), path).toBe(200)
    expect(await response.text(), path).toContain(needle)
  }

  const assets = [
    '/og-image.png',
    '/icon-192.png',
    '/icon-512.png',
    '/icon-maskable-512.png',
    '/apple-touch-icon.png',
    '/favicon.svg',
  ]

  for (const asset of assets) {
    const response = await page.request.get(asset)

    expect(response.status(), asset).toBe(200)
  }
})
