import { expect, test } from "@playwright/test";

test("opens the foundation home page", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Biosaúde Analytics 2.0" })).toBeVisible();
});
