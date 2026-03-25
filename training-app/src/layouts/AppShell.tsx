import type { ReactNode } from "react";

interface AppShellProps {
  titleBar: ReactNode;
  footerBar: ReactNode;
  leftRail: ReactNode;
  children: ReactNode;
  isMobile: boolean;
  leftOpen: boolean;
  onToggleLeft: () => void;
}

export function AppShell({
  titleBar,
  footerBar,
  leftRail,
  children,
  isMobile,
  leftOpen,
  onToggleLeft,
}: AppShellProps) {
  return (
    <div
      className="app-shell h-screen overflow-hidden"
      style={{
        backgroundColor: "var(--surface-primary)",
        color: "var(--text-primary)",
      }}
    >
      <div className="shell-stack flex h-full flex-col">
        <header
          className="shell-header border-b px-4"
          style={{
            minHeight: "var(--topbar-height)",
            backgroundColor: "var(--surface-elevated)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <div className="flex h-full items-center">{titleBar}</div>
        </header>

        <div className="shell-frame relative flex-1 overflow-hidden">
          {isMobile ? (
            <>
              {leftOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close navigation"
                    className="absolute inset-0 z-30 bg-black/40"
                    onClick={onToggleLeft}
                  />
                  <aside
                    className="shell-rail shell-rail-left absolute inset-y-0 left-0 z-40 w-[18rem] overflow-y-auto border-r"
                    style={{
                      backgroundColor: "var(--surface-elevated)",
                      borderColor: "var(--border-subtle)",
                    }}
                  >
                    {leftRail}
                  </aside>
                </>
              )}

              <main className="shell-main h-full overflow-y-auto">
                <div
                  className="shell-main-inner w-full px-5 py-6"
                >
                  {children}
                </div>
              </main>
            </>
          ) : (
            <div className="flex h-full">
              {leftOpen && (
                <aside
                  className="shell-rail shell-rail-left h-full w-[var(--rail-left-width)] overflow-y-auto border-r"
                  style={{
                    backgroundColor: "var(--surface-elevated)",
                    borderColor: "var(--border-subtle)",
                  }}
                >
                  {leftRail}
                </aside>
              )}

              <main className="shell-main min-w-0 flex-1 overflow-y-auto">
                <div
                  className="shell-main-inner mx-auto w-full max-w-4xl px-6 py-8 md:px-10 md:py-10"
                >
                  {children}
                </div>
              </main>
            </div>
          )}
        </div>

        <footer
          className="shell-footer border-t px-4 py-3"
          style={{
            minHeight: "var(--bottombar-height)",
            backgroundColor: "var(--surface-elevated)",
            borderColor: "var(--border-subtle)",
          }}
        >
          {footerBar}
        </footer>
      </div>
    </div>
  );
}
