"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter, usePathname }  from "next/navigation";
import Link                        from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { DirectionTag, RBadge, RBar } from "./trade-components";
import { cx }                         from "@/style";
import type { Trade }                 from "@/types";

const col = createColumnHelper<Trade>();


function SortIcon({ state }: { state: "asc" | "desc" | false }) {
  return (
    <span className={cx(
      "inline-flex flex-col gap-[2px] ml-[5px] transition-opacity shrink-0",
      state ? "opacity-100" : "opacity-0 group-hover:opacity-25",
    )}>
      <svg width="6" height="4" viewBox="0 0 6 4" className={state === "asc" ? "text-teal-400" : "text-white/30"}>
        <path d="M3 0L6 4H0L3 0Z" fill="currentColor"/>
      </svg>
      <svg width="6" height="4" viewBox="0 0 6 4" className={state === "desc" ? "text-teal-400" : "text-white/30"}>
        <path d="M3 4L0 0H6L3 4Z" fill="currentColor"/>
      </svg>
    </span>
  );
}


const TH = "px-4 py-3 text-left bg-[#0a0d12] font-mono text-[9px] uppercase tracking-[0.16em] text-white/25 font-normal whitespace-nowrap select-none";
const TD = "px-4 py-3";


const columns = [
  col.accessor("tradedAt", {
    header: "Date",
    sortingFn: "datetime",
    cell: i => {
      const d   = new Date(i.getValue());
      const now = new Date();
      const sameYear = d.getFullYear() === now.getFullYear();
      return (
        <span className="font-mono text-[11px] text-white/30 whitespace-nowrap tabular-nums">
          {d.toLocaleDateString("en-US", {
            month: "short",
            day:   "numeric",
            ...(!sameYear && { year: "2-digit" }),
          })}
        </span>
      );
    },
  }),
  col.accessor("pair", {
    header: "Pair",
    cell: i => (
      <span className="font-mono text-[13px] font-semibold text-white tracking-[0.05em]">
        {i.getValue()}
      </span>
    ),
  }),
  col.accessor("direction", {
    header: "Side",
    enableSorting: false,
    cell: i => <DirectionTag dir={i.getValue()} />,
  }),
  col.accessor("won", {
    header: "Result",
    id: "result",
    enableSorting: false,
    cell: i => {
      const won = i.getValue();
      return (
        <span className={cx(
          "inline-flex items-center gap-[5px] font-mono text-[9px] uppercase tracking-[0.12em] px-[9px] py-[4px] rounded-full border whitespace-nowrap",
          won
            ? "bg-emerald-400/[0.08] border-emerald-400/20 text-emerald-400"
            : "bg-red-400/[0.08] border-red-400/20 text-red-400",
        )}>
          <span className={cx(
            "w-[4px] h-[4px] rounded-full shrink-0",
            won ? "bg-emerald-400" : "bg-red-400",
          )} />
          {won ? "Win" : "Loss"}
        </span>
      );
    },
  }),
  col.accessor("entryPrice", {
    header: "Entry",
    cell: i => (
      <span className="font-mono text-[12px] text-white/55 tabular-nums">{i.getValue()}</span>
    ),
  }),
  col.accessor("exitPrice", {
    header: "Exit",
    cell: i => (
      <span className="font-mono text-[12px] text-white/70 tabular-nums">{i.getValue()}</span>
    ),
  }),
  col.accessor("stopLoss", {
    header: "Stop",
    cell: i => (
      <span className="font-mono text-[11px] text-red-400/40 tabular-nums">{i.getValue()}</span>
    ),
  }),
  col.accessor("takeProfit", {
    header: "TP",
    cell: i => (
      <span className="font-mono text-[11px] text-emerald-400/40 tabular-nums">{i.getValue()}</span>
    ),
  }),
  col.accessor("rMultiple", {
    header: "R Multiple",
    sortingFn: "basic",
    cell: i => (
      <div className="flex items-center gap-2.5 min-w-[110px]">
        <RBadge r={i.getValue()} />
        <RBar   r={i.getValue()} />
      </div>
    ),
  }),
  col.accessor("notes", {
    header: "Notes",
    enableSorting: false,
    cell: i => i.getValue() ? (
      <span className="block font-mono text-[11px] text-white/22 overflow-hidden text-ellipsis whitespace-nowrap max-w-[160px]">
        {i.getValue()}
      </span>
    ) : null,
  }),
  col.accessor("screenshotUrl", {
    header: "",
    id: "screenshot",
    enableSorting: false,
    cell: i => i.getValue() ? (
      <a
        href={i.getValue()!}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        title="View screenshot"
        className="text-white/15 hover:text-teal-400/60 transition-colors"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </a>
    ) : null,
  }),
  col.accessor("id", {
    header: "",
    id: "actions",
    enableSorting: false,
    cell: i => (
      <Link
        href={`/trades/${i.getValue()}/edit`}
        className="inline-flex items-center gap-1 font-mono text-[10px] text-white/20 no-underline opacity-0 group-hover:opacity-100 hover:!text-teal-400 transition-all duration-150 tracking-[0.06em] uppercase whitespace-nowrap"
      >
        Edit
        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 10L10 2M10 2H5M10 2v5"/>
        </svg>
      </Link>
    ),
  }),
];

const COL_LABELS: Record<string, string> = {
  tradedAt:    "Date",
  pair:        "Pair",
  direction:   "Side",
  result:      "Result",
  entryPrice:  "Entry",
  exitPrice:   "Exit",
  stopLoss:    "Stop",
  takeProfit:  "TP",
  rMultiple:   "R Multiple",
  notes:       "Notes",
  screenshot:  "Screenshot",
};

// ─── Pagination helpers ───────────────────────────────────────────────────────

function buildPages(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="relative flex flex-col items-center justify-center px-10 py-20 text-center bg-[#0d1117] border border-white/[0.065] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full bg-emerald-400/[0.04] blur-[60px] pointer-events-none" />

      <div className="relative mb-6">
        <div className="w-[52px] h-[52px] bg-emerald-400/[0.06] border border-emerald-400/[0.12] flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 48 48" fill="none" className="text-emerald-400/40">
            <rect x="6" y="6" width="36" height="36" rx="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12 32 L18 22 L26 27 L34 16 L38 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {filtered ? (
        <>
          <p className="relative font-mono text-[13px] text-white/40 mb-1">No trades match your filters.</p>
          <p className="relative font-mono text-[11px] text-white/20 mb-6">Try adjusting the search or filter options.</p>
        </>
      ) : (
        <>
          <p className="relative font-mono text-[13px] text-white/40 mb-1">No trades logged yet.</p>
          <p className="relative font-mono text-[11px] text-white/20 mb-6 leading-[1.6] max-w-[220px]">
            Every trade logged is a data point.<br />Start building your edge.
          </p>
          <Link
            href="/trades/new"
            className="relative inline-flex items-center gap-2 px-4 py-[9px] bg-emerald-400/[0.08] border border-emerald-400/20 font-mono text-[11px] text-emerald-400 no-underline hover:bg-emerald-400/[0.14] hover:border-emerald-400/30 transition-all duration-150 tracking-[0.04em]"
          >
            Log your first trade <span className="text-emerald-400/50">→</span>
          </Link>
        </>
      )}
    </div>
  );
}

// ─── Filter bar ───────────────────────────────────────────────────────────────

interface FilterBarProps {
  filters: { q?: string; direction?: string; outcome?: string };
}

function FilterBar({ filters }: FilterBarProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(filters.q ?? "");
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef    = useRef<HTMLInputElement>(null);

  useEffect(() => { setQ(filters.q ?? ""); }, [filters.q]);

  // Keyboard shortcut: / → focus search
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  function pushParams(updates: Record<string, string | undefined>) {
    const sp = new URLSearchParams();
    const merged = { q: filters.q, direction: filters.direction, outcome: filters.outcome, ...updates };
    if (merged.q)         sp.set("q",         merged.q);
    if (merged.direction) sp.set("direction", merged.direction);
    if (merged.outcome)   sp.set("outcome",   merged.outcome);
    startTransition(() => { router.push(`${pathname}?${sp.toString()}`); });
  }

  function handleSearchChange(value: string) {
    setQ(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      pushParams({ q: value || undefined });
    }, 350);
  }

  const dir     = filters.direction ?? "";
  const outcome = filters.outcome   ?? "";

  return (
    <div className={cx(
      "flex flex-wrap items-center gap-2 transition-opacity duration-150",
      isPending && "opacity-60",
    )}>
      {/* Search */}
      <div className="relative">
        <svg
          width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor"
          strokeWidth="1.6" strokeLinecap="round"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none"
        >
          <circle cx="6.5" cy="6.5" r="5"/><path d="M14 14l-3-3"/>
        </svg>
        <input
          value={q}
          onChange={e => handleSearchChange(e.target.value)}
          ref={inputRef}
          placeholder="Search pair…  /"
          className="bg-white/[0.03] border border-white/[0.08] rounded-lg pl-7 pr-3 py-[7px] font-mono text-[11px] text-white/60 placeholder-white/18 outline-none focus:border-white/15 transition-colors w-[160px]"
        />
        {q && (
          <button
            onClick={() => handleSearchChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M2 2l8 8M10 2L2 10"/>
            </svg>
          </button>
        )}
      </div>

      {/* Direction toggle */}
      <div className="flex items-center rounded-lg border border-white/[0.07] overflow-hidden">
        {(["", "LONG", "SHORT"] as const).map(v => (
          <button
            key={v || "all"}
            onClick={() => pushParams({ direction: v || undefined })}
            className={cx(
              "px-3 py-[7px] font-mono text-[10px] uppercase tracking-[0.1em] transition-colors duration-150",
              dir === v
                ? v === "LONG"
                  ? "bg-emerald-400/12 text-emerald-400"
                  : v === "SHORT"
                  ? "bg-red-400/12 text-red-400"
                  : "bg-white/[0.06] text-white/60"
                : "text-white/25 hover:text-white/45 hover:bg-white/[0.03]",
            )}
          >
            {v === "" ? "All" : v === "LONG" ? "▲ Long" : "▼ Short"}
          </button>
        ))}
      </div>

      {/* Outcome toggle */}
      <div className="flex items-center rounded-lg border border-white/[0.07] overflow-hidden">
        {(["", "win", "loss"] as const).map(v => (
          <button
            key={v || "all"}
            onClick={() => pushParams({ outcome: v || undefined })}
            className={cx(
              "px-3 py-[7px] font-mono text-[10px] uppercase tracking-[0.1em] transition-colors duration-150",
              outcome === v
                ? v === "win"
                  ? "bg-emerald-400/12 text-emerald-400"
                  : v === "loss"
                  ? "bg-red-400/12 text-red-400"
                  : "bg-white/[0.06] text-white/60"
                : "text-white/25 hover:text-white/45 hover:bg-white/[0.03]",
            )}
          >
            {v === "" ? "All" : v === "win" ? "Win" : "Loss"}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  trades:    Trade[];
  total:     number;
  page:      number;
  pageCount: number;
  filters:   { q?: string; direction?: string; outcome?: string };
}

export function TradesList({ trades, total, page, pageCount, filters }: Props) {
  const [sorting,          setSorting]          = useState<SortingState>([{ id: "tradedAt", desc: true }]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    stopLoss:   false,
    takeProfit: false,
    notes:      false,
    screenshot: false,
  });
  const [showColMenu, setShowColMenu] = useState(false);
  const colMenuRef = useRef<HTMLDivElement>(null);

  // Close column menu on outside click
  useEffect(() => {
    if (!showColMenu) return;
    function handler(e: MouseEvent) {
      if (colMenuRef.current && !colMenuRef.current.contains(e.target as Node)) {
        setShowColMenu(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showColMenu]);

  const table = useReactTable({
    data:     trades,
    columns,
    state:    { sorting, columnVisibility },
    onSortingChange:          setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel:   getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const router = useRouter();

  const isFiltered = !!(filters.q || filters.direction || filters.outcome);
  if (total === 0) return (
    <>
      <FilterBar filters={filters} />
      <div className="mt-3"><EmptyState filtered={isFiltered} /></div>
    </>
  );

  const { rows } = table.getRowModel();

  const pageHref = (p: number) => {
    const sp = new URLSearchParams();
    if (filters.q)         sp.set("q",         filters.q);
    if (filters.direction) sp.set("direction", filters.direction);
    if (filters.outcome)   sp.set("outcome",   filters.outcome);
    sp.set("page", String(p));
    return `/trades?${sp.toString()}`;
  };

  const pageNumbers = buildPages(page, pageCount);

  return (
    <div className="space-y-3">

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <FilterBar filters={filters} />

        <div className="flex items-center gap-2 ml-auto">
          <span className="font-mono text-[10px] text-white/20 tracking-[0.06em]">
            {total} {total === 1 ? "trade" : "trades"}
          </span>

          {/* Column visibility */}
          <div className="relative" ref={colMenuRef}>
            <button
              onClick={() => setShowColMenu(v => !v)}
              className={cx(
                "flex items-center gap-[6px] px-3 py-[7px] rounded-lg font-mono text-[10px] uppercase tracking-[0.1em] transition-all duration-150 border",
                showColMenu
                  ? "bg-white/[0.06] border-white/12 text-white/60"
                  : "bg-white/[0.025] border-white/[0.08] text-white/30 hover:text-white/50 hover:border-white/12",
              )}
            >
              <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                <rect x="0" y="0" width="11" height="1.5" rx="0.75" fill="currentColor"/>
                <rect x="2" y="3.75" width="7" height="1.5" rx="0.75" fill="currentColor"/>
                <rect x="4" y="7.5" width="3" height="1.5" rx="0.75" fill="currentColor"/>
              </svg>
              Columns
            </button>

            {showColMenu && (
              <div
                style={{ backgroundColor: "#0d1117" }}
                className="absolute right-0 top-[calc(100%+6px)] z-50 w-[160px] rounded-lg border border-white/[0.1] shadow-[0_16px_48px_rgba(0,0,0,0.7)] py-2"
              >
                {table.getAllLeafColumns()
                  .filter(c => c.id !== "actions" && COL_LABELS[c.id])
                  .map(column => (
                    <label
                      key={column.id}
                      className="flex items-center gap-[10px] px-3 py-[7px] cursor-pointer hover:bg-white/[0.04] transition-colors"
                    >
                      <div className={cx(
                        "w-[13px] h-[13px] rounded-[3px] border flex items-center justify-center shrink-0 transition-all duration-150",
                        column.getIsVisible()
                          ? "bg-emerald-400/20 border-emerald-400/40"
                          : "bg-transparent border-white/15",
                      )}>
                        {column.getIsVisible() && (
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M1 3l2 2 4-4" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                      />
                      <span className="font-mono text-[11px] text-white/45">
                        {COL_LABELS[column.id]}
                      </span>
                    </label>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/[0.065] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 600 }}>
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="w-[3px] p-0 bg-[#0a0d12]" />
                {table.getFlatHeaders().map(header => {
                  const canSort = header.column.getCanSort();
                  const sorted  = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className={cx(TH, canSort ? "cursor-pointer group" : "")}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                    >
                      <span className="inline-flex items-center">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && <SortIcon state={sorted} />}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const won = row.original.won;
                return (
                  <tr
                    key={row.id}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest("a, button")) return;
                      router.push(`/trades/${row.original.id}/edit`);
                    }}
                    className={cx(
                      "transition-colors duration-100 group cursor-pointer animate-row-in",
                      won
                        ? "hover:bg-emerald-400/[0.025]"
                        : "hover:bg-red-400/[0.025]",
                      i < rows.length - 1 ? "border-b border-white/[0.04]" : "",
                    )}
                    style={i < 20 ? { animationDelay: `${i * 25}ms` } : undefined}
                  >
                    {/* Win/loss indicator strip */}
                    <td className={cx(
                      "w-[3px] p-0",
                      won ? "bg-emerald-400/25" : "bg-red-400/20",
                    )} />
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className={TD}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between pt-1">
          <span className="font-mono text-[10px] text-white/20 tracking-[0.06em]">
            Page {page} of {pageCount}
          </span>

          <div className="flex items-center gap-1">
            {/* Prev */}
            <Link
              href={pageHref(Math.max(1, page - 1))}
              aria-disabled={page === 1}
              className={cx(
                "w-8 h-8 flex items-center justify-center rounded-lg border font-mono text-[13px] transition-all duration-150",
                page === 1
                  ? "border-white/[0.04] text-white/15 pointer-events-none"
                  : "border-white/[0.065] text-white/35 hover:border-white/12 hover:text-white/55",
              )}
            >
              ←
            </Link>

            {/* Page numbers with ellipsis */}
            {pageNumbers.map((p, idx) =>
              p === "…" ? (
                <span key={`e${idx}`} className="w-8 h-8 flex items-center justify-center font-mono text-[12px] text-white/20">
                  …
                </span>
              ) : (
                <Link
                  key={p}
                  href={pageHref(p)}
                  className={cx(
                    "w-8 h-8 flex items-center justify-center rounded-lg font-mono text-[11px] transition-all duration-150",
                    p === page
                      ? "bg-teal-400/15 border border-teal-400/25 text-teal-400"
                      : "border border-white/[0.065] text-white/30 hover:border-white/12 hover:text-white/55",
                  )}
                >
                  {p}
                </Link>
              )
            )}

            {/* Next */}
            <Link
              href={pageHref(Math.min(pageCount, page + 1))}
              aria-disabled={page === pageCount}
              className={cx(
                "w-8 h-8 flex items-center justify-center rounded-lg border font-mono text-[13px] transition-all duration-150",
                page === pageCount
                  ? "border-white/[0.04] text-white/15 pointer-events-none"
                  : "border-white/[0.065] text-white/35 hover:border-white/12 hover:text-white/55",
              )}
            >
              →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
