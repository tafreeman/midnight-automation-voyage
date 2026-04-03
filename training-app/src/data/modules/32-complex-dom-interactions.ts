import type { Lesson } from "../types";

export const lesson: Lesson = {
  id: 32,
  title: "Complex DOM Interactions",
  subtitle:
    "iFrames, file uploads, file downloads, multi-tab workflows, and clipboard operations",
  icon: "🧩",
  sections: [
    {
      heading: "iFrames and frameLocator()",
      content:
        "Many enterprise applications embed third-party content in iFrames — payment forms, WYSIWYG editors, embedded reports, and authentication widgets. Standard Playwright locators cannot see inside an iFrame because it is a separate browsing context with its own DOM. Playwright's `frameLocator()` bridges this gap by scoping all subsequent locator calls to the iFrame's document.\n\nThe key mental model: think of `frameLocator()` as `page` but for the embedded document. Every locator method you use on `page` works identically on a frame locator — `getByTestId`, `getByRole`, `getByText`, `fill`, `click`. The only difference is the scope.",
      code: `import { test, expect } from '@playwright/test';

// Basic iFrame interaction
test('fill payment form inside iFrame', async ({ page }) => {
  await page.goto('/checkout');

  // Locate the iFrame by its selector
  const paymentFrame = page.frameLocator('#payment-iframe');

  // Interact with elements INSIDE the iFrame
  await paymentFrame.getByTestId('card-number').fill('4242424242424242');
  await paymentFrame.getByTestId('card-expiry').fill('12/28');
  await paymentFrame.getByTestId('card-cvc').fill('123');

  // Assert inside the iFrame
  await expect(paymentFrame.getByTestId('card-valid-icon')).toBeVisible();

  // Click the submit button on the PARENT page (not in the iFrame)
  await page.getByTestId('place-order-button').click();
  await expect(page.getByTestId('confirmation-message')).toBeVisible();
});

// Nested iFrames (iFrame inside an iFrame)
test('interact with nested iFrame', async ({ page }) => {
  await page.goto('/editor');

  // First level: the editor widget iFrame
  const editorFrame = page.frameLocator('#editor-widget');

  // Second level: the preview pane inside the editor
  const previewFrame = editorFrame.frameLocator('#preview-pane');

  await expect(previewFrame.locator('h1')).toHaveText('Preview');
});`,
      codeLanguage: "typescript",
      tip: "Use `page.frameLocator()` with a CSS selector that targets the <iframe> element. Common selectors: `#iframe-id`, `[name=\"iframe-name\"]`, `iframe[src*=\"payment\"]`.",
      warning:
        "Never use `page.frame()` (the older API) for new tests. `frameLocator()` (introduced in Playwright 1.17) is auto-waiting and integrates with the locator assertion system. `page.frame()` does not auto-wait and can cause flaky tests.",
    },
    {
      heading: "File Uploads with setInputFiles()",
      content:
        "File upload testing requires interacting with `<input type=\"file\">` elements, which browsers handle differently from regular inputs. You cannot `fill()` a file input — instead, Playwright provides `setInputFiles()` to programmatically attach files.\n\nThe approach depends on whether the file input is visible or hidden behind a styled button. For visible inputs, locate the input directly. For hidden inputs (the common case in modern UIs), use the `fileChooser` event pattern — Playwright intercepts the browser's native file dialog.",
      code: `import { test, expect } from '@playwright/test';
import path from 'path';

// Method 1: Direct input — visible <input type="file">
test('upload a profile photo via file input', async ({ page }) => {
  await page.goto('/settings/profile');

  // Set a file on the input element
  await page.getByTestId('avatar-upload').setInputFiles(
    path.join(__dirname, 'fixtures', 'test-avatar.png')
  );

  // Assert the preview shows the uploaded image
  await expect(page.getByTestId('avatar-preview')).toBeVisible();
});

// Method 2: File chooser — hidden input triggered by a styled button
test('upload document via styled button', async ({ page }) => {
  await page.goto('/documents');

  // Start waiting for the file chooser BEFORE clicking the trigger
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByTestId('upload-document-button').click();
  const fileChooser = await fileChooserPromise;

  // Set the file on the intercepted dialog
  await fileChooser.setFiles(path.join(__dirname, 'fixtures', 'report.pdf'));

  // Assert upload success
  await expect(page.getByTestId('upload-success-toast')).toBeVisible();
  await expect(page.getByTestId('document-list')).toContainText('report.pdf');
});

// Multiple files
test('upload multiple images', async ({ page }) => {
  await page.goto('/gallery/upload');

  await page.getByTestId('multi-file-input').setInputFiles([
    path.join(__dirname, 'fixtures', 'photo-1.jpg'),
    path.join(__dirname, 'fixtures', 'photo-2.jpg'),
    path.join(__dirname, 'fixtures', 'photo-3.jpg'),
  ]);

  await expect(page.getByTestId('upload-count')).toHaveText('3 files selected');
});

// Clear a file selection
test('remove selected file', async ({ page }) => {
  await page.goto('/settings/profile');

  await page.getByTestId('avatar-upload').setInputFiles(
    path.join(__dirname, 'fixtures', 'test-avatar.png')
  );
  await expect(page.getByTestId('avatar-preview')).toBeVisible();

  // Clear the selection by passing an empty array
  await page.getByTestId('avatar-upload').setInputFiles([]);
  await expect(page.getByTestId('avatar-preview')).not.toBeVisible();
});`,
      codeLanguage: "typescript",
      callout:
        "Test fixture files (images, PDFs, CSVs) should live in a `fixtures/` directory alongside your test files. Keep them small — a 1KB PNG is sufficient to test upload functionality.",
    },
    {
      heading: "File Downloads with page.on('download')",
      content:
        "Testing downloads requires intercepting the browser's download event. Playwright does not save downloads to disk by default in test mode — you must explicitly listen for the `download` event and then choose to save or inspect the downloaded content.\n\nThe pattern mirrors file uploads: start waiting for the event BEFORE triggering the action. Then inspect the download's suggested filename, MIME type, or save it to disk for content verification.",
      code: `import { test, expect } from '@playwright/test';

// Basic download — verify filename
test('export button downloads CSV report', async ({ page }) => {
  await page.goto('/reports');

  // Start waiting for the download BEFORE clicking
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('export-csv-button').click();
  const download = await downloadPromise;

  // Assert the suggested filename
  expect(download.suggestedFilename()).toBe('monthly-report.csv');
});

// Download and verify content
test('downloaded CSV contains expected headers', async ({ page }) => {
  await page.goto('/reports');

  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('export-csv-button').click();
  const download = await downloadPromise;

  // Save to a temporary path and read the content
  const filePath = await download.path();
  // filePath is a temp path where Playwright saved the file

  // For content assertions, use Node.js fs
  const fs = await import('fs');
  const content = fs.readFileSync(filePath!, 'utf-8');
  expect(content).toContain('Date,Amount,Status');
  expect(content.split('\\n').length).toBeGreaterThan(1);
});

// Download and save to a specific location
test('save download to test artifacts', async ({ page }) => {
  await page.goto('/reports');

  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('export-pdf-button').click();
  const download = await downloadPromise;

  // Save to a specific path for later inspection
  await download.saveAs('./test-results/downloads/report.pdf');

  // Verify the file was saved (check failure returns null path)
  expect(await download.failure()).toBeNull();
});`,
      codeLanguage: "typescript",
      tip: "Always check `download.failure()` — it returns null on success or an error string on failure. This catches cases where the server returned an error page instead of a file.",
    },
    {
      heading: "Multi-Tab and Multi-Window",
      content:
        "Some application flows open new browser tabs or popup windows — OAuth login redirects, \"open in new tab\" links, print previews, and external documentation links. Playwright can handle these because it operates at the browser context level, not just the page level.\n\nThe key concept: a browser context can contain multiple pages (tabs). When an action opens a new tab, Playwright emits a `page` event on the context. You wait for this event, get a reference to the new page, and interact with it independently.",
      code: `import { test, expect } from '@playwright/test';

// Handle a link that opens in a new tab
test('help link opens documentation in new tab', async ({ page, context }) => {
  await page.goto('/dashboard');

  // Wait for the new page (tab) event BEFORE clicking
  const newPagePromise = context.waitForEvent('page');
  await page.getByTestId('help-link').click();
  const newPage = await newPagePromise;

  // Wait for the new page to load
  await newPage.waitForLoadState();

  // Assert the new tab has the expected URL and content
  expect(newPage.url()).toContain('/docs/getting-started');
  await expect(newPage.locator('h1')).toContainText('Documentation');

  // Close the new tab and continue on the original page
  await newPage.close();
  await expect(page.getByTestId('dashboard-heading')).toBeVisible();
});

// Handle a popup window (e.g., OAuth login)
test('OAuth login via popup window', async ({ page, context }) => {
  await page.goto('/login');

  // Click "Sign in with Google" — opens a popup
  const popupPromise = context.waitForEvent('page');
  await page.getByTestId('oauth-google-button').click();
  const popup = await popupPromise;

  // Interact with the OAuth popup
  await popup.waitForLoadState();
  await popup.fill('#email', 'test@gmail.com');
  await popup.click('#next');
  await popup.fill('#password', 'testpassword');
  await popup.click('#submit');

  // Popup closes automatically after auth — focus returns to original page
  // Wait for the original page to reflect the login
  await expect(page).toHaveURL(/\\/dashboard/);
  await expect(page.getByTestId('user-greeting')).toContainText('Welcome');
});

// Multiple pages open simultaneously
test('compare two reports side by side', async ({ context }) => {
  // Create two pages in the same context (shared auth)
  const page1 = await context.newPage();
  const page2 = await context.newPage();

  await page1.goto('/reports/q1');
  await page2.goto('/reports/q2');

  const q1Total = await page1.getByTestId('report-total').textContent();
  const q2Total = await page2.getByTestId('report-total').textContent();

  // Compare values across pages
  expect(Number(q1Total?.replace('$', ''))).toBeLessThan(
    Number(q2Total?.replace('$', ''))
  );

  await page1.close();
  await page2.close();
});`,
      codeLanguage: "typescript",
      warning:
        "The `context.waitForEvent('page')` pattern is essential — you must start waiting BEFORE the action that opens the new tab. If you click first and then try to get the new page, you may miss the event.",
    },
    {
      heading: "Clipboard Interactions",
      content:
        "Testing clipboard operations (copy, paste, cut) requires using Playwright's keyboard shortcuts or the browser's Clipboard API via `page.evaluate()`. Clipboard access in tests depends on browser permissions — Playwright grants clipboard access automatically in Chromium but may require explicit permission in other browsers.\n\nCommon scenarios: testing copy-to-clipboard buttons, paste from clipboard into form fields, and cut/paste within rich text editors.",
      code: `import { test, expect } from '@playwright/test';

// Test a "Copy to clipboard" button
test('copy button copies invite link to clipboard', async ({ page, context }) => {
  // Grant clipboard permissions (required for some browsers)
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);

  await page.goto('/admin/invite');
  await page.getByTestId('generate-invite-link').click();
  await page.getByTestId('copy-link-button').click();

  // Read clipboard content via the Clipboard API
  const clipboardText = await page.evaluate(
    () => navigator.clipboard.readText()
  );

  expect(clipboardText).toMatch(/https:\\/\\/.*\\/invite\\/.+/);

  // Verify the UI shows a "Copied!" confirmation
  await expect(page.getByTestId('copy-confirmation')).toHaveText('Copied!');
});

// Keyboard-based copy/paste
test('copy text from one field and paste into another', async ({ page }) => {
  await page.goto('/form');

  // Type into the source field
  await page.getByTestId('source-input').fill('Hello, World!');

  // Select all and copy
  await page.getByTestId('source-input').focus();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Control+C');

  // Click the destination field and paste
  await page.getByTestId('destination-input').focus();
  await page.keyboard.press('Control+V');

  // Verify the paste worked
  await expect(page.getByTestId('destination-input')).toHaveValue('Hello, World!');
});

// macOS users: use Meta instead of Control
// Playwright handles this with platform detection:
test('cross-platform copy/paste', async ({ page }) => {
  await page.goto('/form');
  await page.getByTestId('source-input').fill('Test Data');
  await page.getByTestId('source-input').press('ControlOrMeta+A');
  await page.getByTestId('source-input').press('ControlOrMeta+C');
  await page.getByTestId('destination-input').press('ControlOrMeta+V');
  await expect(page.getByTestId('destination-input')).toHaveValue('Test Data');
});`,
      codeLanguage: "typescript",
      tip: "Use `ControlOrMeta` instead of `Control` or `Meta` for cross-platform keyboard shortcuts. Playwright resolves this to Control on Windows/Linux and Command on macOS.",
    },
  ],
  quiz: {
    question:
      "When testing a file upload that uses a hidden <input type=\"file\"> behind a styled button, what is the correct approach?",
    options: [
      "Use page.fill() on the hidden input element",
      "Use page.setInputFiles() directly on the hidden input",
      "Wait for the 'filechooser' event, click the trigger button, then call fileChooser.setFiles()",
      "Use page.evaluate() to call the File API directly",
    ],
    correctIndex: 2,
    explanation:
      "When a file input is hidden and triggered by a styled button, you cannot interact with the input directly. Instead, start waiting for the 'filechooser' event before clicking the trigger button. Playwright intercepts the browser's native file dialog and gives you a fileChooser object where you call setFiles() to attach your test file.",
    additionalQuestions: [
      {
        question:
          "What is the difference between page.frame() and page.frameLocator() for iFrame interaction?",
        options: [
          "They are identical — frameLocator is just an alias for frame",
          "frame() returns a Frame object without auto-waiting; frameLocator() returns a locator-based object with auto-waiting and assertion support",
          "frame() works with iFrames; frameLocator() works with frame elements",
          "frame() is for Chromium only; frameLocator() works across all browsers",
        ],
        correctIndex: 1,
        explanation:
          "page.frame() is the older API that returns a Frame object immediately — it does not auto-wait for the frame to appear, which causes flaky tests when iFrames load asynchronously. page.frameLocator() (introduced in Playwright 1.17) integrates with the locator system — it auto-waits for the frame and supports the full locator assertion API (toBeVisible, toHaveText, etc.).",
      },
      {
        question:
          "When handling a link that opens a new browser tab, what must you do BEFORE clicking the link?",
        options: [
          "Set the target attribute to '_self' to prevent the new tab",
          "Start waiting for the 'page' event on the browser context",
          "Create a new page object with context.newPage()",
          "Configure the browser to block popup windows",
        ],
        correctIndex: 1,
        explanation:
          "You must call `context.waitForEvent('page')` BEFORE clicking the link that opens a new tab. This creates a promise that resolves when the new page event fires. If you click first, the event may fire before you start listening and you'll miss it. The returned page object lets you interact with the new tab independently.",
      },
      {
        question:
          "What does download.failure() return when a file download completes successfully?",
        options: [
          "The file path where the download was saved",
          "An empty string",
          "null",
          "The HTTP status code (200)",
        ],
        correctIndex: 2,
        explanation:
          "download.failure() returns null when the download succeeded, or an error string describing the failure. Always check this in your tests — a common bug is when the server returns an error page (HTML) instead of the expected file, which Playwright treats as a successful download. Checking failure() catches this.",
      },
    ],
  },
  exercises: [
    {
      title: "Test a Payment iFrame",
      description:
        "Write a test that interacts with a payment form embedded in an iFrame. Fill the card details inside the iFrame, then submit the order from the parent page.",
      difficulty: "beginner",
      starterCode: `import { test, expect } from '@playwright/test';

test('complete payment via iFrame', async ({ page }) => {
  await page.goto('/checkout');

  // TODO: Locate the payment iFrame (id="payment-iframe")
  // TODO: Fill card number (data-testid="card-number") with "4242424242424242"
  // TODO: Fill expiry (data-testid="card-expiry") with "12/28"
  // TODO: Fill CVC (data-testid="card-cvc") with "123"
  // TODO: Click the "Place Order" button on the PARENT page
  // TODO: Assert the confirmation message is visible
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('complete payment via iFrame', async ({ page }) => {
  await page.goto('/checkout');

  // Scope to the payment iFrame
  const paymentFrame = page.frameLocator('#payment-iframe');

  // Fill card details INSIDE the iFrame
  await paymentFrame.getByTestId('card-number').fill('4242424242424242');
  await paymentFrame.getByTestId('card-expiry').fill('12/28');
  await paymentFrame.getByTestId('card-cvc').fill('123');

  // Submit from the PARENT page
  await page.getByTestId('place-order-button').click();

  // Assert confirmation on the parent page
  await expect(page.getByTestId('confirmation-message')).toBeVisible();
});`,
      hints: [
        "Use page.frameLocator('#payment-iframe') to scope into the iFrame",
        "All getByTestId calls on the frame locator search INSIDE the iFrame's DOM",
        "The submit button is on the parent page, not inside the iFrame — use page.getByTestId()",
      ],
    },
    {
      title: "Upload and Download Round-Trip",
      description:
        "Test a full file round-trip: upload a CSV file, verify it appears in the document list, then download it and verify the filename matches.",
      difficulty: "intermediate",
      starterCode: `import { test, expect } from '@playwright/test';
import path from 'path';

test('upload CSV then download it', async ({ page }) => {
  await page.goto('/documents');

  // Step 1: Upload
  // TODO: Use the file chooser pattern to upload fixtures/test-data.csv
  // TODO: Assert the file appears in the document list

  // Step 2: Download
  // TODO: Click the download button for the uploaded file
  // TODO: Assert the downloaded filename matches "test-data.csv"
  // TODO: Assert the download did not fail
});`,
      solutionCode: `import { test, expect } from '@playwright/test';
import path from 'path';

test('upload CSV then download it', async ({ page }) => {
  await page.goto('/documents');

  // Step 1: Upload via file chooser
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByTestId('upload-document-button').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(path.join(__dirname, 'fixtures', 'test-data.csv'));

  // Assert the file appears in the list
  await expect(page.getByTestId('document-list')).toContainText('test-data.csv');

  // Step 2: Download the uploaded file
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('document-list')
    .locator('[data-testid="download-button"]')
    .first()
    .click();
  const download = await downloadPromise;

  // Assert the filename and no failure
  expect(download.suggestedFilename()).toBe('test-data.csv');
  expect(await download.failure()).toBeNull();
});`,
      hints: [
        "Start waiting for 'filechooser' BEFORE clicking the upload button",
        "Use path.join(__dirname, 'fixtures', 'test-data.csv') for the file path",
        "Start waiting for 'download' BEFORE clicking the download button",
        "download.suggestedFilename() returns what the server suggests as the filename",
      ],
    },
    {
      title: "Multi-Tab OAuth Flow",
      description:
        "Write a test that handles an OAuth popup: click 'Sign in with Provider', interact with the popup window, then verify the original page reflects the authenticated state.",
      difficulty: "advanced",
      starterCode: `import { test, expect } from '@playwright/test';

test('OAuth login via popup', async ({ page, context }) => {
  await page.goto('/login');

  // TODO: Set up waiting for the popup page
  // TODO: Click the OAuth sign-in button
  // TODO: Get the popup page reference
  // TODO: Wait for the popup to load
  // TODO: Fill credentials in the popup (email: test@oauth.com, password: OAuthPass!)
  // TODO: Submit the popup form
  // TODO: Verify the original page redirects to /dashboard
  // TODO: Verify the user greeting shows "Welcome"
});`,
      solutionCode: `import { test, expect } from '@playwright/test';

test('OAuth login via popup', async ({ page, context }) => {
  await page.goto('/login');

  // Wait for the popup BEFORE triggering it
  const popupPromise = context.waitForEvent('page');
  await page.getByTestId('oauth-sign-in-button').click();
  const popup = await popupPromise;

  // Wait for the popup to finish loading
  await popup.waitForLoadState();

  // Fill credentials in the popup
  await popup.getByTestId('oauth-email').fill('test@oauth.com');
  await popup.getByTestId('oauth-password').fill('OAuthPass!');
  await popup.getByTestId('oauth-submit').click();

  // Popup closes after successful auth — original page updates
  await expect(page).toHaveURL(/\\/dashboard/);
  await expect(page.getByTestId('user-greeting')).toContainText('Welcome');
});`,
      hints: [
        "Use context.waitForEvent('page') — not page.waitForEvent — because the new tab is a context-level event",
        "Call popup.waitForLoadState() before interacting with popup elements",
        "After the popup closes, assertions run on the original page object",
        "The popup may close automatically after successful auth — you don't need to close it manually",
      ],
    },
  ],
  promptTemplates: [
    {
      label: "Generate iFrame Test",
      prompt:
        "Generate a Playwright test that interacts with elements inside an iFrame at {selector}. The iFrame contains {description of form/content}. Fill the form fields, assert validation states, and submit from the parent page. Use frameLocator() (not frame()).",
      context:
        "CARD format: Context — embedded third-party widget. Action — test iFrame interaction. Role — QE engineer. Deliverable — complete spec file with frameLocator pattern.",
    },
    {
      label: "Generate File Upload/Download Test",
      prompt:
        "Generate Playwright tests for file upload and download on {page}. Upload: the input is {visible/hidden behind a button}. Download: triggered by {button/link}. Verify the filename, content type, and content where possible. Include both the filechooser pattern and setInputFiles pattern.",
      context:
        "CARD format: Context — document management feature. Action — test file operations. Role — test engineer. Deliverable — upload + download test pair with assertions.",
    },
  ],
  practiceLink: {
    url: "http://localhost:5173/",
    label: "Practice App",
    description:
      "Use the practice app's document management, checkout, and admin pages to test iFrame interactions, file uploads/downloads, and multi-tab workflows.",
  },
};
