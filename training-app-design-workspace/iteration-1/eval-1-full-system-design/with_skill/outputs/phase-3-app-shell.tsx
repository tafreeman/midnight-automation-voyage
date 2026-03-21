/**
 * AppShell.tsx
 * Target: training-app/src/layouts/AppShell.tsx
 *
 * Three-panel layout: left nav rail, center content, right support rail.
 * Uses react-resizable-panels for responsive panel management.
 * Includes TopBar and BottomBar.
 */

import { useState, useCallback, useEffect, type ReactNode } from 'react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

interface AppShellProps {
  leftRail: ReactNode;
  children: ReactNode;
  rightRail: ReactNode;
  topBar: ReactNode;
  bottomBar: ReactNode;
}

export function AppShell({ leftRail, children, rightRail, topBar, bottomBar }: AppShellProps) {
  const [leftOpen, setLeftOpen] = useState(() => window.innerWidth >= 1024);
  const [rightOpen, setRightOpen] = useState(() => window.innerWidth >= 1280);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      if (w < 768) {
        setLeftOpen(false);
        setRightOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggleLeft = useCallback(() => setLeftOpen((p) => !p), []);
  const toggleRight = useCallback(() => setRightOpen((p) => !p), []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.ctrlKey && e.key === 'm') {
        e.preventDefault();
        toggleLeft();
      }
      if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        toggleRight();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [toggleLeft, toggleRight]);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{
        backgroundColor: 'var(--surface-primary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Top Bar */}
      <header
        className="flex-shrink-0 flex items-center px-4 border-b"
        style={{
          height: 'var(--topbar-height)',
          backgroundColor: 'var(--surface-elevated)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        {topBar}
      </header>

      {/* Three-Panel Layout */}
      <div className="flex-1 overflow-hidden relative">
        {/* Mobile: Left rail as overlay */}
        {isMobile && leftOpen && (
          <>
            <div
              className="absolute inset-0 bg-black/50 z-40"
              onClick={() => setLeftOpen(false)}
            />
            <aside
              className="absolute left-0 top-0 bottom-0 z-50 overflow-y-auto"
              style={{
                width: 'var(--rail-left-width)',
                backgroundColor: 'var(--surface-elevated)',
                borderRight: '1px solid var(--border-subtle)',
              }}
            >
              {leftRail}
            </aside>
          </>
        )}

        {/* Desktop: Resizable panels */}
        {!isMobile ? (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Left Rail */}
            {leftOpen && (
              <>
                <ResizablePanel
                  defaultSize={18}
                  minSize={14}
                  maxSize={25}
                  className="overflow-y-auto"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    borderRight: '1px solid var(--border-subtle)',
                  }}
                >
                  {leftRail}
                </ResizablePanel>
                <ResizableHandle className="w-px hover:w-1 transition-all" style={{ backgroundColor: 'var(--border-subtle)' }} />
              </>
            )}

            {/* Center Content */}
            <ResizablePanel defaultSize={rightOpen ? 60 : 82} className="overflow-y-auto">
              <div className="mx-auto px-6 py-8" style={{ maxWidth: 'var(--content-max-width)' }}>
                {children}
              </div>
            </ResizablePanel>

            {/* Right Rail */}
            {rightOpen && (
              <>
                <ResizableHandle className="w-px hover:w-1 transition-all" style={{ backgroundColor: 'var(--border-subtle)' }} />
                <ResizablePanel
                  defaultSize={22}
                  minSize={16}
                  maxSize={28}
                  className="overflow-y-auto"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    borderLeft: '1px solid var(--border-subtle)',
                  }}
                >
                  {rightRail}
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        ) : (
          /* Mobile: Single column */
          <main className="h-full overflow-y-auto">
            <div className="mx-auto px-4 py-6" style={{ maxWidth: 'var(--content-max-width)' }}>
              {children}
            </div>
          </main>
        )}
      </div>

      {/* Bottom Bar */}
      <footer
        className="flex-shrink-0 flex items-center justify-between px-6 border-t"
        style={{
          height: 'var(--bottombar-height)',
          backgroundColor: 'var(--surface-elevated)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        {bottomBar}
      </footer>
    </div>
  );
}
