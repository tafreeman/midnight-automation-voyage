import { test } from "@playwright/test";
import { credentials, gotoRoute } from "../support/practice";

test("recorded login draft for editor account", async ({ page }) => {
  await gotoRoute(page, "/login");
  await page.getByLabel("Email").click();
  await page.getByLabel("Email").fill(credentials.editor.email);
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill(credentials.editor.password);
  await page.getByRole("button", { name: "Log In" }).click();
});
