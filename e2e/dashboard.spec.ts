import { expect, test } from '@playwright/test';

test('analyst can reach GO after verifying the synthetic dossier', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Astăzi' })).toBeVisible();
  await expect(page.getByText('Doar date sintetice')).toBeVisible();
  for (const title of ['Capacitate minimă 180 kWp', 'Livrare în maximum 120 zile', 'Garanție de minimum 5 ani', 'Echipă locală de instalare', 'Pachet de documente complet']) {
    await page.getByLabel(`Stare: ${title}`).selectOption('verified');
  }
  await expect(page.getByText('GO posibil')).toBeVisible();
  await page.getByRole('button', { name: 'Marchează GO' }).click();
  await expect(page.getByRole('button', { name: 'Marchează GO' })).toHaveClass(/selected-go/);
});
