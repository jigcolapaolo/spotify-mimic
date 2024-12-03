import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test("should show menu items and playlist", async ({ page }) => {
    const asideToggler = page.locator('button').filter({ hasText: 'Tu biblioteca' });
    const homeLink = page.getByRole('link', { name: 'Inicio' });
    const searchButton = page.getByRole('button', { name: 'Buscar' });
    const playlistLink = page.locator(".playlist-item");

    await asideToggler.click();

    await expect(asideToggler).toBeVisible();
    await expect(homeLink).toBeVisible();
    await expect(searchButton).toBeVisible();
    await expect(playlistLink.nth(0)).toBeVisible();
})

test("should hide menu items text when menu is closed", async ({ page }) => {
    const asideToggler = page.locator('button').filter({ hasText: 'Tu biblioteca' });
    const homeLink = page.getByRole('link', { name: 'Inicio' });
    const searchButton = page.getByRole('button', { name: 'Buscar' });
    const playlistLinkTitle = page.locator(".playlist-item").nth(0).locator("h4");

    await asideToggler.click();

    await expect(asideToggler).toBeVisible();
    await expect(homeLink).toBeVisible();
    await expect(searchButton).toBeVisible();
    await expect(playlistLinkTitle).toBeVisible();

    await asideToggler.click();

    await expect(homeLink).not.toBeVisible();
    await expect(searchButton).not.toBeVisible();
    await expect(playlistLinkTitle).not.toBeVisible();
})

test("should go to home page when home link is clicked", async ({ page }) => {

    const asideToggler = page.locator('button').filter({ hasText: 'Tu biblioteca' });
    const homeLink = page.getByRole('link', { name: 'Inicio' });

    await asideToggler.click();

    await homeLink.click();

    await page.waitForURL(/$/, { waitUntil: 'networkidle' });
})

test("should go to playlist page when playlist item is clicked", async ({ page }) => {

    const playlistLink = page.locator(".playlist-item");

    await playlistLink.nth(0).click();

    await page.waitForURL(/playlist/, { waitUntil: 'networkidle' });
})

test("should open search input modal when search button is clicked", async ({ page }) => {

    const asideToggler = page.locator('button').filter({ hasText: 'Tu biblioteca' });

    await asideToggler.click();

    const searchButton = page.getByRole('button', { name: 'Buscar' });
    await searchButton.click();

    const searchInput = page.getByPlaceholder("Buscar album")
    await expect(searchInput).toBeVisible();

    await searchButton.click();

    await expect(searchInput).not.toBeVisible();
})

test("should show user input when user types in search input and search playlists", async ({ page }) => {
    const asideToggler = page.locator('button').filter({ hasText: 'Tu biblioteca' });

    await asideToggler.click();

    const searchButton = page.getByRole('button', { name: 'Buscar' });
    await searchButton.click();

    const searchInput = page.getByPlaceholder("Buscar album")
    await expect(searchInput).toBeVisible();

    await searchInput.fill("Cof");

    await expect(searchInput).toHaveValue("Cof");

    const searchResultMessage = page.locator("p:has-text('resultados')");
    await expect(searchResultMessage).toBeVisible();
})

test("should clear search input when clear button is clicked", async ({ page }) => {
    const asideToggler = page.locator('button').filter({ hasText: 'Tu biblioteca' });

    await asideToggler.click();

    const searchButton = page.getByRole('button', { name: 'Buscar' });
    await searchButton.click();

    const searchInput = page.getByPlaceholder("Buscar album")
    await expect(searchInput).toBeVisible();

    await searchInput.fill("Cof");
    await expect(searchInput).toHaveValue("Cof");

    const clearButton = page.getByRole('button', { name: 'X' });
    await clearButton.click();

    await expect(searchInput).toHaveValue("");
})