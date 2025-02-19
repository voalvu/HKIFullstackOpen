import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Patientor/);
});

test('add an entry in single page view', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Martin Riggs' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Entries' })).toBeVisible();

  await page.getByRole('button', { name: 'Add Entry' }).click();

  await page.getByRole('textbox', { name: 'description' }).fill('Test description');
  await page.getByRole('textbox', { name: 'specialist' }).fill('Dr. Smith');
  await page.getByRole('textbox', { name: 'Diagnose codes' }).fill('A00,B00');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.get
})
