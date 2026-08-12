import { expect, test } from '@playwright/test';

test('static synthetic dashboard supports filtering, selection, evidence, and basic accessibility', async ({ page }) => {
  const browserErrors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error') browserErrors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', error => browserErrors.push(`pageerror: ${error.message}`));
  page.on('requestfailed', request => {
    browserErrors.push(`requestfailed: ${request.method()} ${request.url()} ${request.failure()?.errorText ?? ''}`);
  });

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Tender Intelligence' })).toBeVisible();
  await expect(page.getByText('Demo static')).toBeVisible();

  const search = page.getByRole('textbox', { name: 'Caută în dosare' });
  await expect(search).toHaveAttribute('placeholder', 'Titlu, cumpărător sau ID');
  await search.fill('solar');
  await expect(page.getByRole('button', { name: /Sistem solar demonstrativ/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Mobilier modular/ })).toHaveCount(0);

  await page.getByRole('button', { name: /Sistem solar demonstrativ/ }).click();
  await expect(page.getByRole('heading', { name: /Sistem solar demonstrativ/ })).toBeVisible();
  await expect(page.getByText('Blocat 4/5')).toBeVisible();
  await page.getByRole('button', { name: 'E1' }).click();
  await expect(page.getByRole('heading', { name: 'Caiet tehnic' })).toBeVisible();
  await expect(page.getByText('fixture://syn-001/caiet')).toBeVisible();
  await page.getByRole('button', { name: 'Închide' }).click();
  await expect(page.getByRole('heading', { name: 'Caiet tehnic' })).toHaveCount(0);
  expect(browserErrors).toEqual([]);
});
