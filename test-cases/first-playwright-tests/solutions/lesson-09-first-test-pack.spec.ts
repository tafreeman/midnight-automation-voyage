import { test, expect } from "@playwright/test";
import { credentials, gotoRoute } from "../support/practice";

test("editor can sign in and reach the dashboard", async ({ page }) => {
  await gotoRoute(page, "/login");
  await page.getByTestId("email-input").fill(credentials.editor.email);
  await page.getByTestId("password-input").fill(credentials.editor.password);
  await page.getByTestId("login-button").click();

  await expect(page).toHaveURL(/#\/dashboard$/);
  await expect(page.getByTestId("dashboard-heading")).toContainText("Welcome, Test User");
});

test("widget search returns matching products", async ({ page }) => {
  await gotoRoute(page, "/products");
  await page.getByTestId("search-input").fill("Widget");
  await page.getByTestId("search-button").click();

  await expect(page.getByTestId("result-count")).toContainText("6 results found");
  await expect(page.getByTestId("result-card")).toHaveCount(6);
  await expect(page.getByTestId("result-card").first()).toContainText("Widget");
});
