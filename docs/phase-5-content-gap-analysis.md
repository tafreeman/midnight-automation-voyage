# Verified Content Gap Analysis — Phase 5

## Methodology

Searched all files in `src/data/modules/` and `src/data/courses/` for keywords related to each Playwright feature. Results verified by reading full module content.

---

## Gap 1: iFrames / frameLocator()

**Search terms:** iframe, iFrame, frameLocator, frame_locator
**Result:** ZERO matches across all module files.
**Verdict:** CONFIRMED GAP. No coverage whatsoever.

iFrames are common in enterprise apps (embedded payment forms, third-party widgets, WYSIWYG editors, embedded reports). Playwright's `frameLocator()` API is the primary mechanism. This is a significant gap for any learner who encounters embedded content.

**Proposed fix:** New Module 32, Section 1 (iFrames and frameLocator).

---

## Gap 2: File Uploads / setInputFiles()

**Search terms:** file upload, file download, setInputFiles, download
**Result:** ZERO matches for setInputFiles or file upload as a testing topic.
- "download" appears only in context of downloading Node.js, browser binaries, or CI artifacts — never as a Playwright testing technique.

**Verdict:** CONFIRMED GAP. No coverage of `page.setInputFiles()`, `page.on('download')`, or file-based assertions.

File upload/download testing is required in most business applications (document management, CSV export, image upload). Playwright has dedicated APIs for both.

**Proposed fix:** New Module 32, Sections 2-3 (File Uploads, File Downloads).

---

## Gap 3: UI Mode (--ui)

**Search terms:** UI Mode, --ui, ui mode
**Result:** ONE match in Module 15 (CI/CD Reference):
```
["npx playwright test --ui", "Open interactive test runner UI"]
```
This is a single row in a command cheat sheet table. No explanation, no walkthrough, no screenshots, no comparison to other debugging tools.

**Verdict:** CONFIRMED GAP. Mentioned as a command only, with zero instructional content.

UI Mode is Playwright's most powerful debugging tool — it combines trace viewing, watch mode, and time-travel debugging in a single interface. The current coverage (one table cell) does not prepare learners to use it.

**Proposed fix:** Content expansion in Module 22 (Trace Viewer Deep-Dive) — add a dedicated UI Mode section with walkthrough, comparison to CLI tracing, and when to use each.

---

## Gap 4: Emulation — Geolocation, Timezone, Locale, Permissions

**Search terms:** geolocation, timezone, locale, permissions, emulat
**Result:**
- Module 23 (Mobile & Responsive): covers viewport emulation, device descriptors, touch interactions. NO geolocation, timezone, locale, or permissions.
- Module 15 (CI/CD Reference): mentions "timezone" and "locale" only in a Copilot prompt template about CI failures, not as testable Playwright features.

**Verdict:** CONFIRMED GAP. Module 23 covers viewport/device emulation only. The broader emulation capabilities (geolocation, timezone, locale, permissions) are not covered.

These are critical for:
- Testing location-based features (store finder, delivery zones)
- Testing date/time display across timezones
- Testing internationalization (locale-dependent formatting)
- Testing permission-gated features (camera, microphone, notifications)

**Proposed fix:** Content expansion in Module 23 — add 4 new sections covering geolocation, timezone, locale, and permissions emulation.

---

## Gap 5: Multi-Tab / Multi-Window Testing

**Search terms:** multi-tab, multiple tab, newPage, new page, new window
**Result:**
- Module 04 (Why Playwright & Copilot): mentions "multi-tab" in a comparison table — "Yes (built-in)" for Playwright. No instructional content.
- Module 16 (Auth Fixtures): uses `context.newPage()` for creating authenticated pages in fixtures. This is about auth, not multi-tab testing.
- Course 1 Module 02: mentions "Multi-tab / multi-window: Yes (built-in)" in a comparison table.

**Verdict:** CONFIRMED GAP. Multi-tab is listed as a Playwright feature but never taught as a technique. No code examples of handling popup windows, new tabs from link clicks, or multi-window workflows.

**Proposed fix:** New Module 32, Section 4 (Multi-Tab and Multi-Window).

---

## Gap 6: Clipboard API

**Search terms:** clipboard
**Result:** ONE incidental match in a copilot-first-testing course module mentioning "someone's clipboard" (not Playwright's clipboard API).
**Verdict:** CONFIRMED GAP. No coverage of `page.evaluate(() => navigator.clipboard)` or clipboard-based test scenarios.

**Proposed fix:** New Module 32, Section 5 (Clipboard Interactions).

---

## Gap 7: globalTeardown Patterns

**Search terms:** globalTeardown, global teardown, teardown
**Result:**
- Module 16 (Auth Fixtures): `globalSetup` is covered extensively. No `globalTeardown`.
- Module 20 (Test Data Strategies): mentions "globalTeardown resets DB to seed state" in a cleanup strategies table. One row, no code example, no configuration guidance.

**Verdict:** PARTIAL GAP. The concept is named but not taught. No code examples, no configuration patterns, no comparison to alternatives.

**Proposed fix:** Content expansion in Module 16 — add a globalTeardown section with code examples and configuration.

---

## Summary Table

| Gap | Current Coverage | Severity | Fix |
|-----|-----------------|----------|-----|
| iFrames / frameLocator() | None | High | Module 32 Section 1 |
| File uploads / setInputFiles() | None | High | Module 32 Section 2 |
| File downloads / page.on('download') | None | High | Module 32 Section 3 |
| UI Mode | 1 cheat sheet row | Medium | Module 22 expansion |
| Geolocation emulation | None | Medium | Module 23 expansion |
| Timezone emulation | None | Medium | Module 23 expansion |
| Locale emulation | None | Medium | Module 23 expansion |
| Permissions emulation | None | Medium | Module 23 expansion |
| Multi-tab / multi-window | Mentioned, not taught | Medium | Module 32 Section 4 |
| Clipboard API | None | Low | Module 32 Section 5 |
| globalTeardown | Named in table, no code | Low | Module 16 expansion |
