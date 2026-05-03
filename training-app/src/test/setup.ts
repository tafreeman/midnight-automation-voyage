import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Some jsdom builds ship with a file-backed localStorage that lacks standard
// Storage methods. Ensure a fully-functional in-memory localStorage is always
// available so modules that read it at initialization time (e.g. config.ts)
// do not crash with "getItem is not a function".
if (typeof window !== "undefined" && typeof window.localStorage?.getItem !== "function") {
  const store: Record<string, string> = {};
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => { store[key] = String(value); },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { for (const k in store) delete store[k]; },
      get length() { return Object.keys(store).length; },
      key: (index: number) => Object.keys(store)[index] ?? null,
    },
    writable: true,
  });
}

afterEach(() => {
  cleanup();
  if (typeof window !== "undefined" && typeof window.localStorage?.clear === "function") {
    window.localStorage.clear();
  }
});
