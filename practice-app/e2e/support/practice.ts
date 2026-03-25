import type { Page } from "@playwright/test";

export const credentials = {
  editor: {
    email: "user@test.com",
    password: "Password123!",
  },
  admin: {
    email: "admin@test.com",
    password: "AdminPass1!",
  },
} as const;

export async function gotoRoute(page: Page, route: string) {
  const normalizedRoute = route.startsWith("/") ? route : `/${route}`;
  await page.goto(`/#${normalizedRoute}`);
}
