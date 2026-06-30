import type { ReactNode } from "react";
import { cx } from "@/style";
import { AppShell } from "@/components/layout/app-shell";

// Stable string keys for placeholder lists (avoids array-index keys).
function rangeKeys(n: number): string[] {
  return Array.from({ length: n }, (_, i) => `sk-${i}`);
}

/** Cool, neutral pulsing block. Compose with width/height/rounding classes. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cx("rounded-md bg-white/[0.06] animate-pulse", className)} />;
}

/**
 * Renders the real AppShell (sidebar appears instantly from the cached
 * session) and the standard page padding/maxWidth container. Only the content
 * area passed as `children` is a skeleton, so navigation never shows a blank
 * frame and the chrome doesn't flicker.
 */
export function SkeletonShell({ maxWidth = 1120, children }: { maxWidth?: number; children: ReactNode }) {
  return (
    <AppShell>
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-9">
        <div className="w-full mx-auto" style={{ maxWidth }}>
          {children}
        </div>
      </div>
    </AppShell>
  );
}

/** Eyebrow rule + title + optional subtitle — matches every page header. */
export function HeaderSkeleton({
  subtitle = true,
  className = "mb-6 sm:mb-8",
}: { subtitle?: boolean; className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-5 h-px bg-white/10" />
        <Skeleton className="h-2 w-16" />
      </div>
      <Skeleton className="h-6 w-56 mb-2.5" />
      {subtitle && <Skeleton className="h-3 w-40" />}
    </div>
  );
}

/** Bordered card container; pass a height class (or children) for content. */
export function CardSkeleton({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={cx("rounded-xl bg-white/[0.02] border border-white/[0.06]", className)}>
      {children}
    </div>
  );
}

/** Row of metric cards (label · value · sub). */
export function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {rangeKeys(count).map(k => (
        <div key={k} className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 sm:p-5">
          <Skeleton className="h-2.5 w-20 mb-3" />
          <Skeleton className="h-7 w-24 mb-2" />
          <Skeleton className="h-2 w-16" />
        </div>
      ))}
    </div>
  );
}

/** Table with a header row and N body rows. */
export function TableSkeleton({ rows = 8, cols = 6 }: { rows?: number; cols?: number }) {
  const colKeys = rangeKeys(cols);
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
      <div className="flex items-center gap-4 px-4 py-3 border-b border-white/[0.06]">
        {colKeys.map(k => <Skeleton key={k} className="h-2.5 flex-1" />)}
      </div>
      {rangeKeys(rows).map((rk, i) => (
        <div
          key={rk}
          className={cx("flex items-center gap-4 px-4 py-[15px]", i < rows - 1 ? "border-b border-white/[0.04]" : "")}
        >
          {colKeys.map(ck => <Skeleton key={ck} className="h-3 flex-1" />)}
        </div>
      ))}
    </div>
  );
}
