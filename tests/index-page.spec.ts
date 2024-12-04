import { test, expect, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test("should show index page greetings", async ({ page }) => {
    const title = page.locator("h1").filter({ hasText: /\b(buenas?|buenos)\b/i });

    await expect(title).toBeVisible();
})

test("should show index page playlist", async ({ page }) => {
    const playlistLink = page.locator("article:has(a.playlist-item)").nth(0);

    await expect(playlistLink).toBeVisible();
})

test("should show play button when playlist is hovered", async ({ page }) => {
    const playlistLink = page.locator("article:has(a.playlist-item)").nth(0);
    const cardPlayButton = playlistLink.locator(".card-play-button");
    const cardPlayButtonContainer = playlistLink.locator(".card-play-button-container");

    await expect(cardPlayButtonContainer).toHaveClass(/translate-y-4/);

    await playlistLink.hover();

    await expect(cardPlayButton).toBeVisible();
    await expect(cardPlayButtonContainer).toHaveClass(/translate-y-0/);
})

test("should play playlist when play button is clicked", async ({ page }) => {
    const playlistLink = page.locator("article:has(a.playlist-item)").nth(0);
    const cardPlayButton = playlistLink.locator(".card-play-button");


    await playlistLink.hover();

    await cardPlayButton.click();


    const isAudioPlaying = async () => {
        return await page.evaluate(() => {
            const audioElement = document.querySelector(`#audio-player`) as HTMLAudioElement;
            return audioElement && !audioElement.paused;
        });
    };

    expect(await isAudioPlaying()).toBe(true);

})

test("should go to playlist page when playlist item is clicked", async ({ page }) => {

    const playlistLink = page.locator("article:has(a.playlist-item)").nth(0);

    await playlistLink.click();

    await page.waitForURL(/\/playlist\/.*/, { waitUntil: 'networkidle' });
    
})