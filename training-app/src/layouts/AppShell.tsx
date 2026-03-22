import type { ReactNode } from "react";

interface AppShellProps {
  titleBar: ReactNode;
  footerBar: ReactNode;
  leftRail: ReactNode;
  rightRail: ReactNode;
  children: ReactNode;
  isMobile: boolean;
  leftOpen: boolean;
  rightOpen: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
}

export function AppShell({
  titleBar,
  footerBar,
  leftRail,
  rightRail,
  children,
  isMobile,
  leftOpen,
  rightOpen,
  onToggleLeft,
  onToggleRight,
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

              {rightOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close support rail"
                    className="absolute inset-0 z-30 bg-black/40"
                    onClick={onToggleRight}
                  />
                  <aside
                    className="shell-rail shell-rail-right absolute inset-y-0 right-0 z-40 w-[19rem] overflow-y-auto border-l"
                    style={{
                      backgroundColor: "var(--surface-elevated)",
                      borderColor: "var(--border-subtle)",
                    }}
                  >
                    {rightRail}
                  </aside>
                </>
              )}

              <main className="shell-main h-full overflow-y-auto">
                <div
                  className="shell-main-inner w-full px-4 py-5"
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
                  className="shell-main-inner w-full px-5 py-6 md:px-8 md:py-8"
                >
                  {children}
                </div>
              </main>

              {rightOpen && (
                <aside
                  className="shell-rail shell-rail-right h-full w-[var(--rail-right-width)] overflow-y-auto border-l"
                  style={{
                    backgroundColor: "var(--surface-elevated)",
                    borderColor: "var(--border-subtle)",
                  }}
                >
                  {rightRail}
                </aside>
              )}
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
