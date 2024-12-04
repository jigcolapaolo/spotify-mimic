import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test("should correctly show id page", async ({ page }) => {
    const playlistLink = page.locator("article:has(a.playlist-item)").nth(0);

    await playlistLink.click();

    await page.waitForURL(/\/playlist\/.*/, { waitUntil: 'networkidle' });
})

test("should show id page elements", async ({ page }) => {
    const playlistLink = page.locator("article:has(a.playlist-item)").nth(0);

    await playlistLink.click();

    await page.waitForURL(/\/playlist\/.*/, { waitUntil: 'networkidle' });

    const playlistContainer = page.locator("div[id=playlist-container]");
    const arrowButton = playlistContainer.locator("button[id=prev-button]");
    const playlistImg = playlistContainer.locator("header").locator("picture").locator("img");
    const playlistTitle = playlistContainer.locator("h4.playlist-id-title");
    const playlistText = playlistContainer.locator("h2", { hasText: /Playlist/i });
    const songText = playlistContainer.locator("p").filter({ hasText: /canci/i });
    const durationText = playlistContainer.locator("p").filter({ hasText: /\b(h?|min)\b/i });
    const cardPlayButton = playlistContainer.locator("button.card-play-button");

    const playlistSongsSection = playlistContainer.locator("#playlist-songs-section");
    const firstSongPlayButton = playlistSongsSection.locator("button.song-play-button").nth(0);

    await expect(arrowButton).toBeVisible();
    await expect(playlistImg).toBeVisible();
    await expect(playlistTitle).toBeVisible();
    await expect(playlistText).toBeVisible();
    await expect(songText).toBeVisible();
    await expect(durationText).toBeVisible();
    await expect(cardPlayButton).toBeVisible();
    await expect(playlistSongsSection).toBeVisible();
    await expect(firstSongPlayButton).toBeVisible();
})

test("should go to home page when arrow button is clicked", async ({ page }) => {

    const playlistLink = page.locator("article:has(a.playlist-item)").nth(0);

    await playlistLink.click();

    await page.waitForURL(/\/playlist\/.*/, { waitUntil: 'networkidle' });

    const playlistContainer = page.locator("div[id=playlist-container]");
    const arrowButton = playlistContainer.locator("button[id=prev-button]");

    await arrowButton.click();

    await page.waitForURL(/$/, { waitUntil: 'networkidle' });
})

test("should play audio when play button is clicked and pause when clicked again", async ({ page }) => {
  const playlistLink = page.locator("article:has(a.playlist-item)").nth(0);

  await playlistLink.click();

  await page.waitForURL(/\/playlist\/.*/, { waitUntil: 'networkidle' });

  const playlistContainer = page.locator("div[id=playlist-container]");
  const cardPlayButton = playlistContainer.locator("button.card-play-button");

  await cardPlayButton.click();

  const isAudioPlaying = async () => {
    return await page.evaluate(() => {
        const audioElement = document.querySelector(`#audio-player`) as HTMLAudioElement;
        return audioElement && !audioElement.paused;
    });
  };

  expect(await isAudioPlaying()).toBe(true);

  await cardPlayButton.click();

  expect(await isAudioPlaying()).toBe(false);
})

test("should play audio when song play button is clicked and pause when clicked again", async ({ page }) => {
  const playlistLink = page.locator("article:has(a.playlist-item)").nth(0);

  await playlistLink.click();

  await page.waitForURL(/\/playlist\/.*/, { waitUntil: 'networkidle' });

  const playlistContainer = page.locator("div[id=playlist-container]");
  const playlistSongsSection = playlistContainer.locator("#playlist-songs-section");
  const firstSongPlayButton = playlistSongsSection.locator("button.song-play-button").nth(0);

  await firstSongPlayButton.click();

  const isAudioPlaying = async () => {
    return await page.evaluate(() => {
        const audioElement = document.querySelector(`#audio-player`) as HTMLAudioElement;
        return audioElement && !audioElement.paused;
    });
  };

  expect(await isAudioPlaying()).toBe(true);

  await firstSongPlayButton.click();

  expect(await isAudioPlaying()).toBe(false);

})