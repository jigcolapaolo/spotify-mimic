import { test, expect, type Page } from '@playwright/test';

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

  await expect(playerContainer).toBeVisible();
  await expect(shuffleButton).toBeVisible();
  await expect(prevButton).toBeVisible();
  await expect(playButton).toBeVisible();
  await expect(nextButton).toBeVisible();
  await expect(repeatButton).toBeVisible();
  await expect(volumeButton).toBeVisible();
})