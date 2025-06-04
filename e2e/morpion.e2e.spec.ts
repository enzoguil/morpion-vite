import { test, expect } from '@playwright/test';

test('victoire du joueur', async ({ page }) => {
  await page.goto('http://localhost:5173');
  // Décoche la case "Jouer contre l'IA" si elle est cochée
  const iaCheckbox = page.locator('input[type="checkbox"]');
  if (await iaCheckbox.isChecked()) {
    await iaCheckbox.click();
  }
  await page.click('button:has-text("Nouvelle partie")');
  // Clique sur les cases pour faire gagner X (exemple pour la première ligne)
  const buttons = await page.locator('button:has-text("")').all();
  await buttons[0].click(); // X
  await buttons[3].click(); // O
  await buttons[1].click(); // X
  await buttons[4].click(); // O
  await buttons[2].click(); // X gagne

  await expect(page.locator('text=/gagné/i')).toBeVisible();
});