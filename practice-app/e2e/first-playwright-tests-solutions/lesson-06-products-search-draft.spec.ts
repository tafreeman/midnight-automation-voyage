import { test, expect } from "@playwright/test";
import { gotoRoute } from "../support/practice";

test("search returns matching widget products", async ({ page }) => {
  await gotoRoute(page, "/products");
  await page.getByTestId("search-input").fill("Widget");
  await page.getByTestId("search-button").click();

  await expect(page.getByTestId("result-count")).toContainText("6 results found");
  const cards = page.getByTestId("result-card");
  await expect(cards).toHaveCount(6);
  await expect(cards.first()).toContainText("Widget");
});
