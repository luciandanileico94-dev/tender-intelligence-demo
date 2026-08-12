import { expect, type Page, test } from '@playwright/test';

async function navigate(page: Page, name: string) {
  const menu = page.getByRole('button', { name: 'Deschide meniul' });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole('navigation').getByRole('button', { name }).click();
}

test('filters procedures and follows cited evidence', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Oportunităţi active').locator('..')).toContainText('12');
  await navigate(page, 'Oportunități 12');
  await page.getByRole('button', { name: /Furnizare legume/ }).click();
  await expect(page.getByRole('heading', { name: /Furnizare legume/ })).toBeVisible();
  await expect(page.getByTestId('selected-cpv')).toContainText('03000000-1');
  await page.getByLabel('Filtru domeniu').selectOption('72000000-5');
  await expect(page.getByRole('button', { name: /Platformă IT/ })).toBeVisible();
  await navigate(page, 'Căutare în dovezi');
  await page.getByLabel('Caută în dovezi').fill('securitate');
  await page.locator('.results button').first().click();
  await expect(page.getByRole('heading', { name: /Platformă IT/ })).toBeVisible();
  await page.getByRole('button', { name: /Decizie explicabilă/ }).click();
  await expect(page.getByText('DOVADĂ CITATĂ')).toBeVisible();
  await page.getByRole('button', { name: 'Închide' }).click();
});

test('persists pipeline and opens entity dossiers', async ({ page }) => {
  await page.goto('/');
  await navigate(page, 'Dosarele mele');
  const stage = page.getByRole('combobox', { name: /Furnizare legume/ });
  await stage.selectOption('În pregătire');
  await page.reload();
  await navigate(page, 'Dosarele mele');
  await expect(page.getByRole('combobox', { name: /Furnizare legume/ })).toHaveValue('În pregătire');
  await navigate(page, 'Companii');
  await page.locator('.dossier-card').first().click();
  await expect(page.getByText('Reducere medie')).toBeVisible();
  await expect(page.getByText('Domenii CPV')).toBeVisible();
});

test('history, capabilities and responsive layout are reachable', async ({ page }) => {
  await page.goto('/');
  await navigate(page, 'Oportunități 12');
  await page.getByLabel('Filtru stare').selectOption('Finalizată');
  await expect(page.getByRole('button', { name: /Mentenanţă aplicaţii/ })).toBeVisible();
  await navigate(page, 'Ce oferă produsul');
  await expect(page.getByText('Descoperire multidomeniu')).toBeVisible();
  await expect(page.getByText(/GO \/ WATCH \/ NO-GO/)).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
