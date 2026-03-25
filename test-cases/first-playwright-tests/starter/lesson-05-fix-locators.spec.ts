import { test } from "@playwright/test";
import { credentials, gotoRoute } from "../support/practice";

test.skip("login uses stable locators", async ({ page }) => {
  await gotoRoute(page, "/login");
  await page.locator("input").nth(0).fill(credentials.editor.email);
  await page.locator("input").nth(1).fill(credentials.editor.password);
  await page.locator("button").click();

  // TODO: replace the locators without changing the flow
});
