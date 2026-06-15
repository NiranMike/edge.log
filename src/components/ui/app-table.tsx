"use client";

import { cx } from "@/style";

// ── Primitive class constants ─────────────────────────────────────────────────
// Used by TanStack-driven tables (trades-list.tsx) that manage their own rendering.

export const TH_CLASS =
  "px-4 py-3 text-left bg-[var(--bg-base)] font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--tx-4)] font-normal whitespace-nowrap";

export const TD_CLASS = "px-4 py-[13px]";

// ── TableShell ────────────────────────────────────────────────────────────────
// Outer container. Use this when you need full control over the table internals
// (e.g. TanStack tables, custom sort headers).

interface ShellProps {
  children:   React.ReactNode;
  scrollX?:   boolean;
  className?: string;
}

export function TableShell({ children, scrollX = true, className }: ShellProps) {
  return (
    <div className={cx(
      "bg-[var(--bg-surface)] border border-[var(--bd)] rounded-xl overflow-hidden",
      className,
    )}>
      {scrollX ? (
        <div className="overflow-x-auto">
          {children}
        </div>
      ) : children}
    </div>
  );
}

// ── AppTable ──────────────────────────────────────────────────────────────────
// Generic data-driven table. Pass columns + rows and it handles all markup.

export interface TableColumn<T> {
  header:          React.ReactNode;
  cell:            (row: T, index: number) => React.ReactNode;
  className?:      string;  // extra classes on every <td>
  headerClassName?: string; // extra classes on <th>
}

interface AppTableProps<T> {
  columns:     TableColumn<T>[];
  rows:        T[];
  getKey:      (row: T, index: number) => string | number;
  minWidth?:   number;
  emptyState?: React.ReactNode;
  className?:  string;
}

export function AppTable<T>({
  columns,
  rows,
  getKey,
  minWidth,
  emptyState,
  className,
}: AppTableProps<T>) {
  return (
    <TableShell className={className}>
      {rows.length === 0 && emptyState ? (
        emptyState
      ) : (
        <table
          className="w-full border-collapse"
          style={minWidth ? { minWidth } : undefined}
        >
          <thead>
            <tr className="border-b border-[var(--bd)]">
              {columns.map((col, i) => (
                <th key={i} className={cx(TH_CLASS, col.headerClassName)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={getKey(row, i)}
                className={cx(
                  "transition-colors duration-150 hover:bg-white/[0.02] group",
                  i < rows.length - 1 ? "border-b border-[var(--bd)]" : "",
                )}
              >
                {columns.map((col, j) => (
                  <td key={j} className={cx(TD_CLASS, col.className)}>
                    {col.cell(row, i)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </TableShell>
  );
}
