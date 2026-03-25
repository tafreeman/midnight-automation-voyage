import { test, expect } from "@playwright/test";
import { gotoRoute } from "../support/practice";

test("login smoke check is ready to run in multiple modes", async ({ page }) => {
  await gotoRoute(page, "/login");

  await expect(page.getByTestId("email-input")).toBeVisible();
  await expect(page.getByTestId("password-input")).toBeVisible();
  await expect(page.getByTestId("login-button")).toBeVisible();
});
