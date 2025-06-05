import { test, expect } from '@playwright/test';

test('victoire du joueur', async ({ page }) => {
  await page.goto('http://localhost:5173');
  const iaCheckbox = page.locator('input[type="checkbox"]').first();
  if (await iaCheckbox.isChecked()) {
    await iaCheckbox.click();
  }
  await page.click('button:has-text("Nouvelle partie")');
  const buttons = await page.locator('button:has-text("")').all();
  await buttons[0].click(); // X
  await buttons[3].click(); // O
  await buttons[1].click(); // X
  await buttons[4].click(); // O
  await buttons[2].click(); // X

  await expect(page.locator('text=/gagné/i')).toBeVisible();
});

test('match nul', async ({ page }) => {
  await page.goto('http://localhost:5173');
  const iaCheckbox = page.locator('input[type="checkbox"]');
  if (await iaCheckbox.first().isChecked()) {
    await iaCheckbox.first().click();
  }
  await page.click('button:has-text("Nouvelle partie")');
  const buttons = await page.locator('button:has-text("")').all();
  await buttons[0].click(); // X
  await buttons[1].click(); // O
  await buttons[2].click(); // X
  await buttons[3].click(); // O
  await buttons[4].click(); // X
  await buttons[5].click(); // O
  await buttons[6].click(); // X
  await buttons[7].click(); // O
  await buttons[9].click(); // X
  await buttons[8].click(); // O
  await buttons[11].click(); // X
  await buttons[10].click(); // O
  await buttons[13].click(); // X
  await buttons[12].click(); // O
  await buttons[15].click(); // X
  await buttons[14].click(); // O

  await expect(page.locator('text=/Match nul !/i')).toBeVisible();
});

//Changger des paramètres puis lancer une partie
test('changer les paramètres et jouer', async ({ page }) => {
  await page.goto('http://localhost:5173');
  const sizeInput = page.locator('input[type="number"]').first();
  await sizeInput.fill('5');
  await sizeInput.press('Enter');

  const depthInput = page.locator('input[type="number"]').nth(1);
  await depthInput.fill('4');
  await depthInput.press('Enter');

  const vsAI = page.locator('input[type="checkbox"]').first();
  if (await vsAI.isChecked()) {
    await vsAI.click();
  }

  const buttons = await page.locator('button:has-text("")').all();
  await buttons[0].click(); // X
  await buttons[4].click(); // O
  await buttons[1].click(); // X
  await buttons[5].click(); // O
  await buttons[2].click(); // X
  await buttons[6].click(); // O
  await buttons[3].click(); // X

  await expect(page.locator('text=/gagné/i')).toBeVisible();
});