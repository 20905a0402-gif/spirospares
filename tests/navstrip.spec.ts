import { test, expect } from '@playwright/test';

test.describe('NavStrip Component', () => {
  test('should be visible below header on initial load', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    const navStrip = page.locator('nav').filter({ has: page.locator('a[href="/"]') }).first();
    await expect(navStrip).toBeVisible();

    // Check background color is cyan blue
    const bgColor = await navStrip.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bgColor).toContain('rgb(0, 212, 255)');

    // Check z-index is high enough
    const zIndex = await navStrip.evaluate((el) => getComputedStyle(el).zIndex);
    expect(parseInt(zIndex)).toBeGreaterThan(50);
  });

  test('should hide when scrolling down', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    const navStrip = page.locator('nav').filter({ has: page.locator('a[href="/"]') }).first();
    await expect(navStrip).toBeVisible();

    // Scroll down past 100px
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(300); // Wait for animation

    // Check transform is -translate-y-full (hidden above viewport)
    const transform = await navStrip.evaluate((el) => getComputedStyle(el).transform);
    // Should be matrix(1, 0, 0, 1, 0, -height) or translate3d
    expect(transform).not.toBe('matrix(1, 0, 0, 1, 0, 0)');
  });

  test('should show when scrolling up', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    const navStrip = page.locator('nav').filter({ has: page.locator('a[href="/"]') }).first();

    // First scroll down to hide
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(300);

    // Then scroll up
    await page.evaluate(() => window.scrollBy(0, -100));
    await page.waitForTimeout(300);

    // Check visible
    const transform = await navStrip.evaluate((el) => getComputedStyle(el).transform);
    expect(transform).toBe('matrix(1, 0, 0, 1, 0, 0)');
  });

  test('should be above header (higher z-index)', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    const header = page.locator('header').first();
    const navStrip = page.locator('nav').filter({ has: page.locator('a[href="/"]') }).first();

    const headerZ = await header.evaluate((el) => parseInt(getComputedStyle(el).zIndex) || 0);
    const navZ = await navStrip.evaluate((el) => parseInt(getComputedStyle(el).zIndex) || 0);

    expect(navZ).toBeGreaterThan(headerZ);
  });

  test('should be positioned at top 73px (below header)', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    const navStrip = page.locator('nav').filter({ has: page.locator('a[href="/"]') }).first();
    const topPosition = await navStrip.evaluate((el) => getComputedStyle(el).top);

    expect(topPosition).toBe('73px');
  });

  test('should have all quick links visible and clickable', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    const links = ['Home', 'Bikes', 'Spares', 'Gadgets', 'Pickup Points', 'About Us', 'Contact'];

    for (const link of links) {
      const linkEl = page.locator('nav a').filter({ hasText: link }).first();
      await expect(linkEl).toBeVisible();
      await expect(linkEl).toBeEnabled();
    }
  });
});
