import { test, expect } from "@playwright/test";
import { gotoRoute, credentials } from "../support/practice";

test("editor can sign in and reach the dashboard", async ({ page }) => {
  await gotoRoute(page, "/login");
  await page.getByTestId("email-input").fill(credentials.editor.email);
  await page.getByTestId("password-input").fill(credentials.editor.password);
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL(/#\/dashboard$/);
  await expect(page.getByTestId("dashboard-heading")).toContainText("Welcome, Test User");
});
