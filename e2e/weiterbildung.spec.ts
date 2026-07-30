import { expect, test } from '@playwright/test'

test('the Weiterbildung document is served on /ubtesting1', async ({ page }) => {
  const browserErrors: string[] = []

  page.on('console', (message) => {
    if (message.type() === 'error') {
      browserErrors.push(message.text())
    }
  })
  page.on('pageerror', (error) => {
    browserErrors.push(error.message)
  })

  await page.goto('/ubtesting1')

  await expect(page).toHaveTitle('Weiterbildung ve İş Birliği Konsepti — UB Testing')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Weiterbildung ve İş Birliği Konsepti' }),
  ).toBeVisible()

  const firstSectionLink = page
    .getByRole('navigation', { name: 'İçindekiler' })
    .getByRole('link')
    .first()
  await firstSectionLink.click()
  await expect(page).toHaveURL(/#bolum-1$/)
  await expect(page.locator('#bolum-1')).toBeVisible()

  await page.getByRole('link', { name: /ubtesting\.com/ }).click()
  await expect(
    page.getByRole('heading', { level: 1, name: /digital certainty/i }),
  ).toBeVisible()

  expect(browserErrors).toEqual([])
})
