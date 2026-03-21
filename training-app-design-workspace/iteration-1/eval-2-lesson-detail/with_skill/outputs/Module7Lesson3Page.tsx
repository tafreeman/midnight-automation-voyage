/**
 * Module 7 Lesson 3: Writing Your First Playwright Test
 *
 * A standalone lesson detail page following the training-app-design skill guide.
 * Theme: Gamma Dark (odd-numbered module, dark cycling).
 * Visual family: A shell + B reading lane.
 * Layout: two-col with notebook-style scrolling.
 *
 * This component is self-contained for design evaluation purposes.
 * In production, it would consume data from the lesson registry and
 * reuse shared components from the component library.
 */

import { useState } from "react";

// ─── Theme tokens (Gamma Dark) ─────────────────────────────────────────
const theme = {
  surfacePrimary: "#1a1a2e",
  surfaceElevated: "#242442",
  surfaceCode: "#0d1117",
  textPrimary: "#f0f0f0",
  textSecondary: "#8b8fa3",
  textMuted: "#5a5e73",
  accentAction: "#a3e635",
  accentInfo: "#60a5fa",
  accentHighlight: "#fb923c",
  accentSpecial: "#f472b6",
  borderSubtle: "rgba(255,255,255,0.06)",
  borderStrong: "rgba(255,255,255,0.12)",
  diffAddedBg: "rgba(163,230,53,0.08)",
  diffRemovedBg: "rgba(251,113,133,0.08)",
  diffAddedText: "#a3e635",
  diffRemovedText: "#fb7185",
  shadowElevation: "0 2px 8px rgba(0,0,0,0.3)",
  codeGlow: "0 0 0 1px rgba(96,165,250,0.15)",
} as const;

// ─── Progress Indicator ─────────────────────────────────────────────────
function ProgressIndicator({
  currentLesson,
  totalLessons,
  currentModule,
  totalModules,
}: {
  currentLesson: number;
  totalLessons: number;
  currentModule: number;
  totalModules: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Course-level progress */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span
          style={{
            fontSize: "0.75rem",
            color: theme.textSecondary,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            whiteSpace: "nowrap",
          }}
        >
          Module {currentModule} of {totalModules}
        </span>
        <div
          style={{
            flex: 1,
            height: "4px",
            background: theme.borderSubtle,
            borderRadius: "2px",
            overflow: "hidden",
          }}
          role="progressbar"
          aria-valuenow={currentModule}
          aria-valuemin={1}
          aria-valuemax={totalModules}
          aria-label={`Course progress: module ${currentModule} of ${totalModules}`}
        >
          <div
            style={{
              width: `${(currentModule / totalModules) * 100}%`,
              height: "100%",
              background: theme.accentAction,
              borderRadius: "2px",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Module-level progress (step dots) */}
      <div
        style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        role="progressbar"
        aria-valuenow={currentLesson}
        aria-valuemin={1}
        aria-valuemax={totalLessons}
        aria-label={`Lesson progress: lesson ${currentLesson} of ${totalLessons}`}
      >
        <span
          style={{
            fontSize: "0.75rem",
            color: theme.textSecondary,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            whiteSpace: "nowrap",
          }}
        >
          Lesson {currentLesson} of {totalLessons}
        </span>
        <div style={{ display: "flex", gap: "6px" }}>
          {Array.from({ length: totalLessons }, (_, i) => {
            const stepNum = i + 1;
            let bg = theme.textMuted;
            if (stepNum < currentLesson) bg = theme.accentAction;
            else if (stepNum === currentLesson) bg = theme.accentInfo;
            return (
              <div
                key={i}
                style={{
                  width: stepNum === currentLesson ? "20px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: bg,
                  transition: "all 0.2s ease",
                }}
                aria-hidden="true"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Lesson Hero ────────────────────────────────────────────────────────
function LessonHero() {
  return (
    <header
      style={{
        padding: "2rem 0",
        borderBottom: `1px solid ${theme.borderSubtle}`,
        marginBottom: "2rem",
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "0.75rem",
        }}
      >
        <span
          style={{
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: theme.accentHighlight,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
          }}
        >
          Module 07
        </span>
        <span style={{ color: theme.textMuted, fontSize: "0.7rem" }}>
          /
        </span>
        <span
          style={{
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: theme.textSecondary,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Record and Refine Workflow
        </span>
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: "1.75rem",
          fontWeight: 700,
          color: theme.textPrimary,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          lineHeight: 1.3,
          margin: "0 0 0.5rem 0",
        }}
      >
        Writing Your First Playwright Test
      </h1>

      {/* Subtitle / objective */}
      <p
        style={{
          fontSize: "0.9rem",
          color: theme.textSecondary,
          lineHeight: 1.6,
          maxWidth: "65ch",
        }}
      >
        By the end of this lesson, you will be able to write a Playwright test
        that navigates to a page and clicks an element using{" "}
        <code
          style={{
            background: theme.surfaceCode,
            padding: "0.15em 0.4em",
            borderRadius: "3px",
            fontSize: "0.85em",
            fontFamily: "'JetBrains Mono', monospace",
            color: theme.accentInfo,
          }}
        >
          page.goto()
        </code>{" "}
        and{" "}
        <code
          style={{
            background: theme.surfaceCode,
            padding: "0.15em 0.4em",
            borderRadius: "3px",
            fontSize: "0.85em",
            fontFamily: "'JetBrains Mono', monospace",
            color: theme.accentInfo,
          }}
        >
          page.click()
        </code>
        .
      </p>

      {/* Meta badges */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginTop: "1rem",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: "0.7rem",
            padding: "0.25rem 0.6rem",
            borderRadius: "4px",
            border: `1px solid ${theme.borderSubtle}`,
            color: theme.textSecondary,
          }}
        >
          ~15 min
        </span>
        <span
          style={{
            fontSize: "0.7rem",
            padding: "0.25rem 0.6rem",
            borderRadius: "4px",
            border: `1px solid rgba(251,191,36,0.2)`,
            color: theme.accentHighlight,
          }}
        >
          Beginner
        </span>
        <span
          style={{
            fontSize: "0.7rem",
            padding: "0.25rem 0.6rem",
            borderRadius: "4px",
            border: `1px solid rgba(96,165,250,0.2)`,
            color: theme.accentInfo,
          }}
        >
          All Roles
        </span>
      </div>
    </header>
  );
}

// ─── Code Block ─────────────────────────────────────────────────────────
function CodeBlock({
  code,
  language,
  highlightLines,
  showLineNumbers = false,
}: {
  code: string;
  language?: string;
  highlightLines?: number[];
  showLineNumbers?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        borderRadius: "0.5rem",
        overflow: "hidden",
        border: `1px solid ${theme.borderSubtle}`,
        boxShadow: theme.codeGlow,
        margin: "1rem 0",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.4rem 1rem",
          background: "rgba(255,255,255,0.03)",
          borderBottom: `1px solid ${theme.borderSubtle}`,
        }}
      >
        <span
          style={{
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: theme.textMuted,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          aria-label={copied ? "Copied to clipboard" : "Copy code"}
          style={{
            fontSize: "0.7rem",
            color: copied ? theme.accentAction : theme.textMuted,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "0.25rem 0.5rem",
            borderRadius: "3px",
            fontFamily: "'JetBrains Mono', monospace",
            transition: "color 0.2s",
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Code body */}
      <pre
        style={{
          margin: 0,
          padding: "1rem 1.5rem",
          background: theme.surfaceCode,
          overflowX: "auto",
          fontSize: "0.85rem",
          lineHeight: 1.7,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
        }}
      >
        <code>
          {lines.map((line, i) => {
            const isHighlighted = highlightLines?.includes(i + 1);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  background: isHighlighted
                    ? "rgba(96,165,250,0.08)"
                    : "transparent",
                  margin: isHighlighted ? "0 -1.5rem" : undefined,
                  padding: isHighlighted ? "0 1.5rem" : undefined,
                  borderLeft: isHighlighted
                    ? `3px solid ${theme.accentInfo}`
                    : showLineNumbers
                    ? "3px solid transparent"
                    : undefined,
                }}
              >
                {showLineNumbers && (
                  <span
                    style={{
                      width: "2.5rem",
                      textAlign: "right",
                      paddingRight: "1rem",
                      color: theme.textMuted,
                      userSelect: "none",
                      flexShrink: 0,
                      fontSize: "0.75rem",
                    }}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                )}
                <span style={{ color: theme.textPrimary }}>{line || "\u00A0"}</span>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

// ─── Callout Box ────────────────────────────────────────────────────────
function CalloutBox({
  variant,
  children,
}: {
  variant: "tip" | "warning" | "info" | "important";
  children: React.ReactNode;
}) {
  const config = {
    tip: {
      icon: "\u{1F4A1}",
      label: "Tip",
      borderColor: theme.accentAction,
      bgColor: "rgba(163,230,53,0.06)",
    },
    warning: {
      icon: "\u26A0\uFE0F",
      label: "Watch out",
      borderColor: theme.accentHighlight,
      bgColor: "rgba(251,146,60,0.06)",
    },
    info: {
      icon: "\u2139\uFE0F",
      label: "Note",
      borderColor: theme.accentInfo,
      bgColor: "rgba(96,165,250,0.06)",
    },
    important: {
      icon: "\u2B50",
      label: "Key concept",
      borderColor: theme.accentSpecial,
      bgColor: "rgba(244,114,182,0.06)",
    },
  };

  const c = config[variant];

  return (
    <div
      role="note"
      aria-label={c.label}
      style={{
        borderLeft: `4px solid ${c.borderColor}`,
        background: c.bgColor,
        borderRadius: "0 0.5rem 0.5rem 0",
        padding: "1rem 1.25rem",
        margin: "1rem 0",
        display: "flex",
        gap: "0.75rem",
        alignItems: "flex-start",
      }}
    >
      <span style={{ fontSize: "1rem", lineHeight: 1, flexShrink: 0 }} aria-hidden="true">
        {c.icon}
      </span>
      <div
        style={{
          fontSize: "0.85rem",
          color: theme.textPrimary,
          lineHeight: 1.6,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Concept Section ────────────────────────────────────────────────────
function ConceptSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: "2rem" }}>
      <h2
        style={{
          fontSize: "1.1rem",
          fontWeight: 600,
          color: theme.textPrimary,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          margin: "0 0 0.75rem 0",
        }}
      >
        <span
          style={{
            width: "4px",
            height: "1.2rem",
            background: theme.accentInfo,
            borderRadius: "2px",
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
        {heading}
      </h2>
      <div
        style={{
          fontSize: "0.9rem",
          color: theme.textSecondary,
          lineHeight: 1.75,
          maxWidth: "65ch",
        }}
      >
        {children}
      </div>
    </section>
  );
}

// ─── Diff View ──────────────────────────────────────────────────────────
function DiffView({
  learnerCode,
  expectedCode,
}: {
  learnerCode: string;
  expectedCode: string;
}) {
  const learnerLines = learnerCode.split("\n");
  const expectedLines = expectedCode.split("\n");
  const maxLines = Math.max(learnerLines.length, expectedLines.length);

  // Count differences
  let diffCount = 0;
  for (let i = 0; i < maxLines; i++) {
    if ((learnerLines[i] || "") !== (expectedLines[i] || "")) diffCount++;
  }

  return (
    <div style={{ margin: "1rem 0" }}>
      {/* Summary line */}
      <p
        style={{
          fontSize: "0.85rem",
          color: diffCount === 0 ? theme.accentAction : theme.accentHighlight,
          marginBottom: "0.75rem",
          fontWeight: 500,
        }}
      >
        {diffCount === 0
          ? "Perfect match! Your test looks great."
          : `${diffCount} line${diffCount > 1 ? "s" : ""} differ${diffCount === 1 ? "s" : ""} \u2014 here\u2019s what\u2019s different:`}
      </p>

      {/* Side-by-side panels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.5rem",
          borderRadius: "0.5rem",
          overflow: "hidden",
        }}
      >
        {/* Your Answer */}
        <div
          style={{
            border: `1px solid ${theme.borderSubtle}`,
            borderRadius: "0.5rem",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "0.4rem 1rem",
              background: "rgba(255,255,255,0.03)",
              borderBottom: `1px solid ${theme.borderSubtle}`,
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: theme.textMuted,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Your answer
          </div>
          <pre
            style={{
              margin: 0,
              padding: "1rem",
              background: theme.surfaceCode,
              overflowX: "auto",
              fontSize: "0.8rem",
              lineHeight: 1.65,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <code>
              {Array.from({ length: maxLines }, (_, i) => {
                const line = learnerLines[i] || "";
                const expected = expectedLines[i] || "";
                const isDiff = line !== expected;
                return (
                  <div
                    key={i}
                    style={{
                      background: isDiff ? theme.diffRemovedBg : "transparent",
                      margin: isDiff ? "0 -1rem" : undefined,
                      padding: isDiff ? "0 1rem" : undefined,
                      color: isDiff ? theme.diffRemovedText : theme.textPrimary,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "1.5rem",
                        color: isDiff ? theme.diffRemovedText : theme.textMuted,
                        userSelect: "none",
                      }}
                      aria-hidden="true"
                    >
                      {isDiff ? "\u2212" : " "}
                    </span>
                    {line || "\u00A0"}
                  </div>
                );
              })}
            </code>
          </pre>
        </div>

        {/* Expected */}
        <div
          style={{
            border: `1px solid ${theme.borderSubtle}`,
            borderRadius: "0.5rem",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "0.4rem 1rem",
              background: "rgba(255,255,255,0.03)",
              borderBottom: `1px solid ${theme.borderSubtle}`,
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: theme.textMuted,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Expected
          </div>
          <pre
            style={{
              margin: 0,
              padding: "1rem",
              background: theme.surfaceCode,
              overflowX: "auto",
              fontSize: "0.8rem",
              lineHeight: 1.65,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <code>
              {Array.from({ length: maxLines }, (_, i) => {
                const line = learnerLines[i] || "";
                const expected = expectedLines[i] || "";
                const isDiff = line !== expected;
                return (
                  <div
                    key={i}
                    style={{
                      background: isDiff ? theme.diffAddedBg : "transparent",
                      margin: isDiff ? "0 -1rem" : undefined,
                      padding: isDiff ? "0 1rem" : undefined,
                      color: isDiff ? theme.diffAddedText : theme.textPrimary,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "1.5rem",
                        color: isDiff ? theme.diffAddedText : theme.textMuted,
                        userSelect: "none",
                      }}
                      aria-hidden="true"
                    >
                      {isDiff ? "+" : " "}
                    </span>
                    {expected || "\u00A0"}
                  </div>
                );
              })}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

// ─── Exercise Editor ────────────────────────────────────────────────────
function ExerciseEditor() {
  const starterCode = `import { test, expect } from '@playwright/test';

test('login page loads and accepts credentials', async ({ page }) => {
  // Step 1: Navigate to the login page
  // YOUR CODE HERE

  // Step 2: Fill in the email field
  // YOUR CODE HERE

  // Step 3: Fill in the password field
  // YOUR CODE HERE

  // Step 4: Click the login button
  // YOUR CODE HERE

  // Step 5: Verify redirect to dashboard
  // YOUR CODE HERE
});`;

  const solutionCode = `import { test, expect } from '@playwright/test';

test('login page loads and accepts credentials', async ({ page }) => {
  // Step 1: Navigate to the login page
  await page.goto('/login');

  // Step 2: Fill in the email field
  await page.getByTestId('email-input').fill('user@test.com');

  // Step 3: Fill in the password field
  await page.getByTestId('password-input').fill('Password123!');

  // Step 4: Click the login button
  await page.getByTestId('login-button').click();

  // Step 5: Verify redirect to dashboard
  await expect(page).toHaveURL(/dashboard/);
});`;

  const [userCode, setUserCode] = useState(starterCode);
  const [showDiff, setShowDiff] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const hints = [
    "Use page.goto('/login') to navigate. The baseURL in playwright.config.ts handles the domain.",
    "The practice-app login form uses data-testid attributes: 'email-input', 'password-input', 'login-button'.",
    "Use page.getByTestId('email-input').fill('user@test.com') for the email field.",
    "Valid credentials are: user@test.com / Password123!",
    "After login, the app redirects to /dashboard. Use await expect(page).toHaveURL(/dashboard/) to verify.",
  ];

  return (
    <section style={{ marginBottom: "2rem" }}>
      <div
        style={{
          border: `1px solid ${theme.borderSubtle}`,
          borderRadius: "0.5rem",
          overflow: "hidden",
        }}
      >
        {/* Exercise header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.25rem",
            background: "rgba(96,165,250,0.06)",
            borderBottom: `1px solid ${theme.borderSubtle}`,
          }}
        >
          <span style={{ fontSize: "1rem" }} aria-hidden="true">
            {"\u26A1"}
          </span>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: theme.textPrimary,
            }}
          >
            Hands-On Exercise
          </span>
        </div>

        <div style={{ padding: "1.25rem" }}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: theme.textPrimary,
              margin: "0 0 0.5rem 0",
            }}
          >
            Write a Login Test for the Practice App
          </h3>
          <p
            style={{
              fontSize: "0.85rem",
              color: theme.textSecondary,
              lineHeight: 1.6,
              marginBottom: "1rem",
              maxWidth: "65ch",
            }}
          >
            Replace the <code style={{ color: theme.accentInfo, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85em" }}>// YOUR CODE HERE</code> comments
            with actual Playwright commands. Navigate to the login page, fill in
            credentials, click the login button, and verify the redirect. Use the
            practice-app's real data-testid attributes.
          </p>

          {/* Editable code area */}
          <div
            style={{
              borderRadius: "0.5rem",
              overflow: "hidden",
              border: `1px solid ${theme.borderSubtle}`,
              boxShadow: theme.codeGlow,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.4rem 1rem",
                background: "rgba(255,255,255,0.03)",
                borderBottom: `1px solid ${theme.borderSubtle}`,
              }}
            >
              <span
                style={{
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: theme.textMuted,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                TypeScript — your test
              </span>
              <button
                onClick={() => setUserCode(starterCode)}
                aria-label="Reset code to starter"
                style={{
                  fontSize: "0.7rem",
                  color: theme.textMuted,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Reset
              </button>
            </div>
            <textarea
              value={userCode}
              onChange={(e) => {
                setUserCode(e.target.value);
                setShowDiff(false);
              }}
              spellCheck={false}
              aria-label="Code editor: write your Playwright test here"
              style={{
                width: "100%",
                minHeight: "320px",
                padding: "1rem 1.5rem",
                background: theme.surfaceCode,
                color: theme.textPrimary,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                fontSize: "0.85rem",
                lineHeight: 1.7,
                border: "none",
                outline: "none",
                resize: "vertical",
                tabSize: 2,
              }}
            />
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginTop: "1rem",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setShowDiff(!showDiff)}
              style={{
                padding: "0.5rem 1.25rem",
                fontSize: "0.8rem",
                fontWeight: 500,
                background: showDiff ? "transparent" : theme.accentAction,
                color: showDiff ? theme.textSecondary : "#1a1a2e",
                border: showDiff
                  ? `1px solid ${theme.borderSubtle}`
                  : "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {showDiff ? "Hide Comparison" : "Check Your Answer"}
            </button>
            <button
              onClick={() => setShowHints(!showHints)}
              style={{
                fontSize: "0.8rem",
                color: theme.accentHighlight,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem 0.25rem",
              }}
            >
              {showHints ? "\u25BE Hide hints" : "\u25B8 Need a hint?"}
            </button>
          </div>

          {/* Hints */}
          {showHints && (
            <div
              style={{
                marginTop: "0.75rem",
                paddingLeft: "0.75rem",
                borderLeft: `2px solid rgba(251,146,60,0.2)`,
              }}
            >
              {hints.map((hint, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: "0.8rem",
                    color: theme.textSecondary,
                    lineHeight: 1.6,
                    marginBottom: "0.5rem",
                  }}
                >
                  <span style={{ color: theme.accentHighlight, marginRight: "0.5rem" }}>
                    {"\u2192"}
                  </span>
                  {hint}
                </p>
              ))}
            </div>
          )}

          {/* Diff view */}
          {showDiff && (
            <DiffView learnerCode={userCode} expectedCode={solutionCode} />
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Quiz Section ───────────────────────────────────────────────────────
function QuizSection() {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const question =
    "What does page.goto() do in a Playwright test?";
  const options = [
    "It clicks on a link element on the page",
    "It navigates the browser to a specific URL and waits for the page to load",
    "It scrolls to a specific element on the page",
    "It opens a new browser tab with the given URL",
  ];
  const correctIndex = 1;
  const explanation =
    "page.goto() navigates the browser to the specified URL. By default, Playwright waits for the page to reach the 'load' state before continuing, which means it waits for all resources to finish loading. This is different from clicking a link (page.click()) or opening a new tab.";

  const isCorrect = selected === correctIndex;

  return (
    <section
      style={{
        border: `1px solid ${theme.borderSubtle}`,
        borderRadius: "0.5rem",
        overflow: "hidden",
        marginBottom: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.75rem 1.25rem",
          background: "rgba(251,146,60,0.06)",
          borderBottom: `1px solid ${theme.borderSubtle}`,
        }}
      >
        <span style={{ color: theme.accentHighlight }}>
          {"\u2726"}
        </span>
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: theme.textPrimary,
          }}
        >
          Knowledge Check
        </span>
      </div>

      <div style={{ padding: "1.25rem" }}>
        <p
          style={{
            fontSize: "0.9rem",
            color: theme.textPrimary,
            marginBottom: "1rem",
            lineHeight: 1.6,
          }}
        >
          {question}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {options.map((opt, i) => {
            let borderColor = theme.borderSubtle;
            let bgColor = "transparent";
            let textColor = theme.textSecondary;

            if (submitted && i === correctIndex) {
              borderColor = theme.accentAction;
              bgColor = "rgba(163,230,53,0.06)";
              textColor = theme.accentAction;
            } else if (submitted && i === selected && !isCorrect) {
              borderColor = theme.diffRemovedText;
              bgColor = theme.diffRemovedBg;
              textColor = theme.diffRemovedText;
            } else if (!submitted && i === selected) {
              borderColor = theme.accentInfo;
              bgColor = "rgba(96,165,250,0.06)";
              textColor = theme.textPrimary;
            }

            return (
              <button
                key={i}
                onClick={() => !submitted && setSelected(i)}
                disabled={submitted && isCorrect}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.375rem",
                  border: `1px solid ${borderColor}`,
                  background: bgColor,
                  color: textColor,
                  fontSize: "0.85rem",
                  lineHeight: 1.5,
                  cursor: submitted && isCorrect ? "default" : "pointer",
                  transition: "all 0.15s",
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    marginRight: "0.5rem",
                    color: theme.textMuted,
                  }}
                >
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {!submitted && (
          <button
            onClick={() => selected !== null && setSubmitted(true)}
            disabled={selected === null}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1.25rem",
              fontSize: "0.8rem",
              fontWeight: 500,
              background: selected !== null ? theme.accentAction : theme.textMuted,
              color: "#1a1a2e",
              border: "none",
              borderRadius: "0.375rem",
              cursor: selected !== null ? "pointer" : "not-allowed",
              opacity: selected === null ? 0.4 : 1,
              transition: "all 0.2s",
            }}
          >
            Check Answer
          </button>
        )}

        {submitted && (
          <div
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1rem",
              borderRadius: "0.375rem",
              border: `1px solid ${
                isCorrect
                  ? "rgba(163,230,53,0.2)"
                  : "rgba(251,146,60,0.2)"
              }`,
              background: isCorrect
                ? "rgba(163,230,53,0.06)"
                : "rgba(251,146,60,0.06)",
              fontSize: "0.85rem",
              lineHeight: 1.6,
            }}
          >
            <p
              style={{
                fontWeight: 600,
                marginBottom: "0.25rem",
                color: isCorrect ? theme.accentAction : theme.accentHighlight,
              }}
            >
              {isCorrect ? "\u2713 Correct!" : "\u2717 Not quite."}
            </p>
            <p style={{ color: theme.textSecondary }}>{explanation}</p>
          </div>
        )}

        {submitted && !isCorrect && (
          <button
            onClick={() => {
              setSubmitted(false);
              setSelected(null);
            }}
            style={{
              marginTop: "0.75rem",
              fontSize: "0.8rem",
              color: theme.accentHighlight,
              background: "transparent",
              border: `1px solid rgba(251,146,60,0.3)`,
              borderRadius: "0.375rem",
              padding: "0.375rem 0.75rem",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        )}
      </div>
    </section>
  );
}

// ─── Navigation Footer ──────────────────────────────────────────────────
function NavigationFooter() {
  const [completed, setCompleted] = useState(false);

  return (
    <footer
      style={{
        marginTop: "3rem",
        paddingTop: "1.5rem",
        borderTop: `1px solid ${theme.borderSubtle}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <button
        style={{
          padding: "0.5rem 1rem",
          fontSize: "0.8rem",
          color: theme.textSecondary,
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        {"\u2190"} Previous
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {!completed && (
          <button
            onClick={() => setCompleted(true)}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.8rem",
              color: theme.textSecondary,
              background: "transparent",
              border: `1px solid ${theme.borderSubtle}`,
              borderRadius: "0.375rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Mark Complete
          </button>
        )}
        {completed && (
          <span
            style={{
              fontSize: "0.8rem",
              color: theme.accentAction,
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            {"\u2713"} Completed
          </span>
        )}
        <button
          style={{
            padding: "0.5rem 1.25rem",
            fontSize: "0.8rem",
            fontWeight: 500,
            background: theme.accentAction,
            color: "#1a1a2e",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Next Lesson {"\u2192"}
        </button>
      </div>
    </footer>
  );
}

// ─── Main Page Component ────────────────────────────────────────────────
export default function Module7Lesson3Page() {
  return (
    <div
      data-theme="gamma-dark"
      style={{
        background: theme.surfacePrimary,
        color: theme.textPrimary,
        minHeight: "100vh",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 1.5rem 4rem" }}>
        {/* Progress tracking */}
        <div style={{ paddingTop: "1.5rem", marginBottom: "1rem" }}>
          <ProgressIndicator
            currentLesson={3}
            totalLessons={8}
            currentModule={7}
            totalModules={30}
          />
        </div>

        {/* Lesson Hero */}
        <LessonHero />

        {/* ── Section 1: page.goto() ─────────────────────────────────── */}
        <ConceptSection heading="What is page.goto()?">
          <p>
            Every Playwright test starts by navigating the browser to the page
            you want to test. The{" "}
            <code
              style={{
                background: theme.surfaceCode,
                padding: "0.15em 0.4em",
                borderRadius: "3px",
                fontFamily: "'JetBrains Mono', monospace",
                color: theme.accentInfo,
                fontSize: "0.9em",
              }}
            >
              page.goto()
            </code>{" "}
            method opens a URL in the browser and waits for the page to finish
            loading before moving on to the next step. It is the equivalent of
            typing a URL in your browser's address bar.
          </p>
        </ConceptSection>

        <CodeBlock
          language="typescript"
          code={`import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  // Navigate to the login page
  await page.goto('/login');

  // Playwright waits for the page to finish loading
  // before executing the next line
  await expect(page).toHaveTitle(/Log In/);
});`}
          highlightLines={[4, 5]}
        />

        <CalloutBox variant="tip">
          When you use <code style={{ fontFamily: "'JetBrains Mono', monospace", color: theme.accentInfo }}>page.goto('/login')</code> with
          a relative path, Playwright prepends the{" "}
          <code style={{ fontFamily: "'JetBrains Mono', monospace", color: theme.accentInfo }}>baseURL</code> from
          your <code style={{ fontFamily: "'JetBrains Mono', monospace" }}>playwright.config.ts</code>. So{" "}
          <code style={{ fontFamily: "'JetBrains Mono', monospace" }}>'/login'</code> becomes{" "}
          <code style={{ fontFamily: "'JetBrains Mono', monospace" }}>http://localhost:5173/login</code>.
        </CalloutBox>

        {/* ── Section 2: page.click() ────────────────────────────────── */}
        <ConceptSection heading="What is page.click()?">
          <p>
            Once on a page, you simulate user interactions. The{" "}
            <code
              style={{
                background: theme.surfaceCode,
                padding: "0.15em 0.4em",
                borderRadius: "3px",
                fontFamily: "'JetBrains Mono', monospace",
                color: theme.accentInfo,
                fontSize: "0.9em",
              }}
            >
              page.click()
            </code>{" "}
            method finds an element on the page and clicks it, just like a real
            user would. Playwright automatically waits for the element to be
            visible and clickable before performing the click.
          </p>
        </ConceptSection>

        <CodeBlock
          language="typescript"
          code={`// Click using different locator strategies

// By data-testid (most reliable for test automation)
await page.getByTestId('login-button').click();

// By role (accessible and semantic)
await page.getByRole('button', { name: 'Log In' }).click();

// By text content
await page.getByText('Log In').click();

// By CSS selector (use as last resort)
await page.click('button[type="submit"]');`}
          highlightLines={[3, 4]}
        />

        <CalloutBox variant="important">
          Prefer <code style={{ fontFamily: "'JetBrains Mono', monospace", color: theme.accentInfo }}>getByTestId()</code> or{" "}
          <code style={{ fontFamily: "'JetBrains Mono', monospace", color: theme.accentInfo }}>getByRole()</code> over
          CSS selectors. They are more resilient to UI changes. The practice-app
          already has <code style={{ fontFamily: "'JetBrains Mono', monospace" }}>data-testid</code> attributes on
          all interactive elements.
        </CalloutBox>

        {/* ── Section 3: Worked Example ──────────────────────────────── */}
        <ConceptSection heading="Putting It Together: A Complete Test">
          <p>
            Here is a complete test that combines{" "}
            <code
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: theme.accentInfo,
              }}
            >
              page.goto()
            </code>{" "}
            and{" "}
            <code
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: theme.accentInfo,
              }}
            >
              page.click()
            </code>{" "}
            along with form filling and an assertion. The comments explain each
            step. Read through it before attempting the exercise below.
          </p>
        </ConceptSection>

        <CodeBlock
          language="typescript"
          showLineNumbers
          code={`import { test, expect } from '@playwright/test';

test('user can log in with valid credentials', async ({ page }) => {
  // Arrange: navigate to the login page
  await page.goto('/login');

  // Act: fill in credentials and submit
  await page.getByTestId('email-input').fill('user@test.com');
  await page.getByTestId('password-input').fill('Password123!');
  await page.getByTestId('login-button').click();

  // Assert: verify we reached the dashboard
  await expect(page).toHaveURL(/dashboard/);
});`}
          highlightLines={[5, 8, 9, 10, 13]}
        />

        <CalloutBox variant="info">
          Notice the <strong>Arrange / Act / Assert</strong> pattern. Arrange
          sets up the starting state. Act performs the user actions. Assert
          verifies the expected outcome. This structure makes tests easy to read
          and maintain.
        </CalloutBox>

        {/* ── Section 4: Exercise ────────────────────────────────────── */}
        <ConceptSection heading="Your Turn: Write a Login Test">
          <p>
            Now write your own test against the practice-app login page. The
            starter code has comments showing what each step should do. Replace
            the <code style={{ fontFamily: "'JetBrains Mono', monospace", color: theme.accentInfo }}>// YOUR CODE HERE</code> comments
            with real Playwright commands. When you are ready, click "Check Your
            Answer" to see a side-by-side comparison.
          </p>
        </ConceptSection>

        <ExerciseEditor />

        {/* ── Section 5: Practice link ───────────────────────────────── */}
        <a
          href="http://localhost:5173/login"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            padding: "1rem 1.25rem",
            borderRadius: "0.5rem",
            border: `1px solid rgba(163,230,53,0.2)`,
            background: "rgba(163,230,53,0.04)",
            marginBottom: "2rem",
            textDecoration: "none",
            transition: "background 0.2s",
          }}
        >
          <div
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: theme.accentAction,
              marginBottom: "0.25rem",
            }}
          >
            Try It Now
          </div>
          <div style={{ fontSize: "0.8rem", color: theme.textSecondary }}>
            Open the practice-app login page to inspect its elements and
            data-testid attributes.
          </div>
        </a>

        {/* ── Section 6: Knowledge Check ─────────────────────────────── */}
        <QuizSection />

        {/* ── Navigation Footer ──────────────────────────────────────── */}
        <NavigationFooter />

        {/* Bottom breathing room */}
        <div style={{ height: "3rem" }} />
      </div>
    </div>
  );
}
