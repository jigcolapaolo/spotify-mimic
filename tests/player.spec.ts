import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test("should show all player elements", async ({ page }) => {
  const playerContainer = page.locator("div[id=player-container]");
  const shuffleButton = playerContainer.locator("button[id=player-shuffle-button]");
  const prevButton = playerContainer.locator("button[id=player-prev-button]");
  const playButton = playerContainer.locator("button[id=player-play-button]");
  const nextButton = playerContainer.locator("button[id=player-next-button]");
  const repeatButton = playerContainer.locator("button[id=player-repeat-button]");
  const volumeButton = playerContainer.locator("button[id=player-volume-button]");
  const playSlider = playerContainer.locator("[id=player-play-slider]");
  const audioDuration = playerContainer.locator("span[id=player-song-duration]");
  const audioCurrentTime = playerContainer.locator("span[id=player-song-current-time]");

  await expect(playerContainer).toBeVisible();
  await expect(shuffleButton).toBeVisible();
  await expect(prevButton).toBeVisible();
  await expect(playButton).toBeVisible();
  await expect(nextButton).toBeVisible();
  await expect(repeatButton).toBeVisible();
  await expect(volumeButton).toBeVisible();
  await expect(playSlider).toBeVisible();
  await expect(audioDuration).toBeVisible();
  await expect(audioCurrentTime).toBeVisible();
})

test("should handle audio correctly with play button when a new song is played", async ({ page }) => {

  const playlistLink = page.locator("article:has(a.playlist-item)").nth(0);
  const cardPlayButton = playlistLink.locator(".card-play-button");

  const playerContainer = page.locator("div[id=player-container]");
  const playButton = playerContainer.locator("button[id=player-play-button]");


  await playlistLink.hover();

  await cardPlayButton.click();


  const isAudioPlaying = async () => {
      return await page.evaluate(() => {
          const audioElement = document.querySelector(`#audio-player`) as HTMLAudioElement;
          return audioElement && !audioElement.paused;
      });
  };

  expect(await isAudioPlaying()).toBe(true);

  await playButton.click();

  expect(await isAudioPlaying()).toBe(false);

  await playButton.click();

  expect(await isAudioPlaying()).toBe(true);
})

test("should change audio duration when playlist song is played and show current time correctly", async ({ page }) => {
  const playlistLink = page.locator("article:has(a.playlist-item)").nth(0);
  const cardPlayButton = playlistLink.locator(".card-play-button");

  const playerContainer = page.locator("div[id=player-container]");
  const audioDuration = playerContainer.locator("span[id=player-song-duration]");
  const audioCurrentTime = playerContainer.locator("span[id=player-song-current-time]");


  await playlistLink.hover();

  await cardPlayButton.click();

  await page.waitForTimeout(2000);

  await expect(audioCurrentTime).toHaveText(/00:06/);
  await expect(audioDuration).not.toHaveText(/00:00/);

})

test("should change audio current time back to 00:00 when next button is clicked and previous button is clicked", async ({ page }) => {

  const playlistLink = page.locator("article:has(a.playlist-item)").nth(0);
  const cardPlayButton = playlistLink.locator(".card-play-button");

  const playerContainer = page.locator("div[id=player-container]");
  const audioCurrentTime = playerContainer.locator("span[id=player-song-current-time]");
  const nextButton = playerContainer.locator("button[id=player-next-button]");
  const prevButton = playerContainer.locator("button[id=player-prev-button]");


  await playlistLink.hover();

  await cardPlayButton.click();

  await page.waitForTimeout(2000);

  await expect(audioCurrentTime).toHaveText(/00:02/);

  await nextButton.click();

  await expect(audioCurrentTime).toHaveText(/00:00/);

  await page.waitForTimeout(2000);

  await expect(audioCurrentTime).toHaveText(/00:02/);

  await prevButton.click();

  await expect(audioCurrentTime).toHaveText(/00:00/);
})

test("should change audio volume when volume button is clicked", async ({ page }) => {

  const playlistLink = page.locator("article:has(a.playlist-item)").nth(0);
  const cardPlayButton = playlistLink.locator(".card-play-button");

  const playerContainer = page.locator("div[id=player-container]");
  const volumeButton = playerContainer.locator("button[id=player-volume-button]");


  await playlistLink.hover();

  await cardPlayButton.click();

  await volumeButton.click();

  const isAudioSilenced = async () => {
    return await page.evaluate(() => {
        const audioElement = document.querySelector(`#audio-player`) as HTMLAudioElement;
        return audioElement && audioElement.volume === 0;
    });
  };

  expect(await isAudioSilenced()).toBe(true);
})