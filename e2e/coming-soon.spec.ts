import { expect, test } from '@playwright/test'

test('visitor can understand the offer and reach the studio', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/UB Testing/)
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /digital certainty/i,
    }),
  ).toBeVisible()

  const contactLink = page.getByRole('link', { name: /request early access/i })
  await expect(contactLink).toBeVisible()
  await expect(contactLink).toHaveAttribute('href', /^mailto:hello@ubtesting\.com/)
})
