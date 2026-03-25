import { test, expect } from "@playwright/test";
import { credentials, gotoRoute } from "../support/practice";

test("editor login reaches the dashboard", async ({ page }) => {
  await gotoRoute(page, "/login");
  await page.getByLabel("Email").fill(credentials.editor.email);
  await page.getByLabel("Password").fill(credentials.editor.password);
  await page.getByRole("button", { name: "Log In" }).click();

  await expect(page).toHaveURL(/#\/dashboard$/);
  await expect(page.getByTestId("dashboard-heading")).toContainText("Welcome, Test User");
});
