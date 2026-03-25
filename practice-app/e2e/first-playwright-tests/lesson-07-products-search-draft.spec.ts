import { test } from "@playwright/test";
import { gotoRoute } from "../support/practice";

test.skip("search returns matching widget products", async ({ page }) => {
  await gotoRoute(page, "/products");

  // TODO: ask Copilot for a draft using a PAGE prompt
  // TODO: fill the search input with "Widget"
  // TODO: submit the search
  // TODO: prove the result count and visible cards match the query
});
