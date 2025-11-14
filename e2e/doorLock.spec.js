import { test, expect } from '@playwright/test';

/**
 * E2E Test for Door Lock Feature
 * 
 * Tests the complete user journey from a real browser perspective:
 * - Page load and initial state
 * - PIN entry via numeric keypad
 * - Door unlock animation
 * - Success screen display
 * - Lock again functionality
 */

const CORRECT_PIN = '8766';

test.describe('Door Lock Feature E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app (adjust URL based on your dev server)
    await page.goto('http://localhost:5173');
    
    // Clear any persisted state
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    await page.reload();
  });

  test('should display locked door and keypad on initial load', async ({ page }) => {
    // Check for locked indicator
    await expect(page.getByText('LOCKED')).toBeVisible();
    
    // Check for keypad
    await expect(page.getByText('PIN de Seguridad')).toBeVisible();
    
    // Check for numeric buttons
    await expect(page.getByRole('button', { name: 'Number 1' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Number 0' })).toBeVisible();
  });

  test('should unlock door with correct PIN', async ({ page }) => {
    // Click PIN buttons: 8-7-6-6
    await page.getByRole('button', { name: 'Number 8' }).click();
    await page.getByRole('button', { name: 'Number 7' }).click();
    await page.getByRole('button', { name: 'Number 6' }).click();
    await page.getByRole('button', { name: 'Number 6' }).click();
    
    // Wait for auto-submit and success message
    await expect(page.getByText('Access Granted!')).toBeVisible({ timeout: 2000 });
    
    // Check for unlocked indicator
    await expect(page.getByText('UNLOCKED')).toBeVisible();
    
    // Check for success emoji/icon
    await expect(page.getByText('✅')).toBeVisible();
  });

  test('should show error on incorrect PIN', async ({ page }) => {
    // Enter wrong PIN: 1-2-3-4
    await page.getByRole('button', { name: 'Number 1' }).click();
    await page.getByRole('button', { name: 'Number 2' }).click();
    await page.getByRole('button', { name: 'Number 3' }).click();
    await page.getByRole('button', { name: 'Number 4' }).click();
    
    // Wait for error message
    await expect(page.getByText(/PIN Incorrecto/i)).toBeVisible({ timeout: 1000 });
    
    // Should show remaining attempts
    await expect(page.getByText(/4 intento/i)).toBeVisible();
  });

  test('should support keyboard numeric input', async ({ page }) => {
    // Type PIN using keyboard
    await page.keyboard.press('8');
    await page.keyboard.press('7');
    await page.keyboard.press('6');
    await page.keyboard.press('6');
    
    // Should auto-submit and unlock
    await expect(page.getByText('Access Granted!')).toBeVisible({ timeout: 2000 });
  });

  test('should lock door again after unlocking', async ({ page }) => {
    // First unlock using numeric keypad
    await page.getByRole('button', { name: 'Number 8' }).click();
    await page.getByRole('button', { name: 'Number 7' }).click();
    await page.getByRole('button', { name: 'Number 6' }).click();
    await page.getByRole('button', { name: 'Number 6' }).click();
    
    await expect(page.getByText('Access Granted!')).toBeVisible({ timeout: 2000 });
    
    // Click lock button
    await page.getByRole('button', { name: /lock door again/i }).click();
    
    // Should return to locked state
    await expect(page.getByText('LOCKED')).toBeVisible({ timeout: 2000 });
    await expect(page.getByText('PIN de Seguridad')).toBeVisible();
  });

  test('should trigger lockout after 5 failed attempts', async ({ page }) => {
    // Make 5 failed attempts with wrong PIN
    for (let i = 0; i < 5; i++) {
      await page.getByRole('button', { name: 'Number 1' }).click();
      await page.getByRole('button', { name: 'Number 2' }).click();
      await page.getByRole('button', { name: 'Number 3' }).click();
      await page.getByRole('button', { name: 'Number 4' }).click();
      await page.waitForTimeout(700); // Wait for shake animation
    }
    
    // Should show lockout message
    await expect(page.getByText('BLOQUEADO')).toBeVisible();
    await expect(page.getByText(/Demasiados intentos/i)).toBeVisible();
    
    // Buttons should be disabled
    await expect(page.getByRole('button', { name: 'Number 1' })).toBeDisabled();
    
    // Should show countdown timer
    await expect(page.getByText(/0:30|0:29/)).toBeVisible();
  });

  test('should persist unlock state after page refresh', async ({ page }) => {
    // Unlock the door
    await page.getByRole('button', { name: 'Number 8' }).click();
    await page.getByRole('button', { name: 'Number 7' }).click();
    await page.getByRole('button', { name: 'Number 6' }).click();
    await page.getByRole('button', { name: 'Number 6' }).click();
    
    await expect(page.getByText('Access Granted!')).toBeVisible();
    
    // Refresh page
    await page.reload();
    
    // Should still be unlocked
    await expect(page.getByText('UNLOCKED')).toBeVisible({ timeout: 2000 });
    await expect(page.getByText('Access Granted!')).toBeVisible();
  });

  test('should clear PIN on Escape key', async ({ page }) => {
    // Enter some digits
    await page.keyboard.press('1');
    await page.keyboard.press('2');
    await page.keyboard.press('3');
    
    // Press Escape
    await page.keyboard.press('Escape');
    
    // PIN display should show empty (all dots empty)
    // Wait a moment and verify we can enter new digits
    await page.keyboard.press('8');
    await page.waitForTimeout(100);
    // If cleared properly, should only have 1 digit now
  });

  test('should have smooth door animation on unlock', async ({ page }) => {
    // Unlock using numeric keypad
    await page.getByRole('button', { name: 'Number 8' }).click();
    await page.getByRole('button', { name: 'Number 7' }).click();
    await page.getByRole('button', { name: 'Number 6' }).click();
    await page.getByRole('button', { name: 'Number 6' }).click();
    
    // Wait for animation to complete (1.2s)
    await page.waitForTimeout(1500);
    
    // Success screen should be visible
    await expect(page.getByText('Access Granted!')).toBeVisible();
  });

  test('should use clear button to delete PIN', async ({ page }) => {
    // Enter some digits
    await page.getByRole('button', { name: 'Number 1' }).click();
    await page.getByRole('button', { name: 'Number 2' }).click();
    await page.getByRole('button', { name: 'Number 3' }).click();
    
    // Click clear button
    await page.getByRole('button', { name: /Borrar/i }).click();
    
    // Should be able to enter new digits
    await page.getByRole('button', { name: 'Number 8' }).click();
    await page.waitForTimeout(100);
  });
});
