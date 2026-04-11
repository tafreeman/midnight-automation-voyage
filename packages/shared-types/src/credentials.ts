/**
 * Test credentials for the practice app.
 * Used by training-app exercises and Playwright test suites.
 *
 * ⚠️ These are MOCK credentials for testing purposes ONLY.
 * Never use this pattern for real authentication.
 */
export const TEST_USERS = {
  EDITOR: { email: "user@test.com", password: "Password123!", name: "Test User", role: "editor" },
  VIEWER: { email: "locktest@test.com", password: "LockPass123!", name: "Lock Test User", role: "viewer" },
  ADMIN: { email: "admin@test.com", password: "AdminPass1!", name: "Admin User", role: "admin" },
} as const;

export type TestUserRole = "admin" | "editor" | "viewer";
