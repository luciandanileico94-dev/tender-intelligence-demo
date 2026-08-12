import { expect, test } from '@playwright/test';

test('public cockpit supports navigation, search, detail and evidence', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Azi' })).toBeVisible();
  await page.getByRole('button', { name: /Vezi oportunitățile/ }).click();
  await expect(page.getByRole('heading', { name: 'Oportunități IT' })).toBeVisible();
  await page.getByRole('button', { name: /Platformă de interoperabilitate/ }).click();
  await expect(page.getByRole('heading', { name: /Platformă de interoperabilitate/ })).toBeVisible();
  await page.getByRole('button', { name: /Caiet de sarcini/ }).click();
  await expect(page.getByText('fixture://syn-001/caiet-de-sarcini')).toBeVisible();
  await page.getByRole('button', { name: 'Închide' }).click();
  await page.getByRole('button', { name: 'Căutare în dovezi' }).click();
  await page.getByRole('textbox', { name: 'Caută în dovezi' }).fill('Nordic Byte');
  await expect(page.getByText('Nordic Byte SRL')).toBeVisible();
});

test('mobile menu and pipeline stage persistence work', async ({ page }) => {
  await page.goto('/');
  if ((page.viewportSize()?.width ?? 1000) < 700) await page.getByRole('button', { name: 'Deschide meniul' }).click();
  await page.getByRole('button', { name: 'Dosarele mele' }).click();
  const select = page.getByRole('combobox', { name: /Platformă de interoperabilitate/ });
  await select.selectOption('În pregătire');
  await page.reload();
  if ((page.viewportSize()?.width ?? 1000) < 700) await page.getByRole('button', { name: 'Deschide meniul' }).click();
  await page.getByRole('button', { name: 'Dosarele mele' }).click();
  await expect(page.getByRole('combobox', { name: /Platformă de interoperabilitate/ })).toHaveValue('În pregătire');
});
