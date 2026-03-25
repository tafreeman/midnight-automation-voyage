import { test } from "@playwright/test";
import { credentials, gotoRoute } from "../support/practice";

test.skip("editor can sign in", async ({ page }) => {
  await gotoRoute(page, "/login");
  await page.getByTestId("email-input").fill(credentials.editor.email);
  await page.getByTestId("password-input").fill(credentials.editor.password);
  await page.getByTestId("login-button").click();

  // TODO: add proof that the right page loaded for the right user
});
