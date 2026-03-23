"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { DirectionTag, RBadge, TD_CLASS, TH_CLASS } from "./trade-components";
import { cx } from "@/style";
import type { Trade } from "@/types";

const col = createColumnHelper<Trade>();

function SortIcon({ state }: { state: "asc" | "desc" | false }) {
  return (
    <span className="inline-flex flex-col gap-[2px] ml-[5px] opacity-30 group-hover:opacity-60 transition-opacity">
      <span className={cx(
        "block w-0 h-0 border-l-[3px] border-r-[3px] border-b-[4px] border-l-transparent border-r-transparent",
        state === "asc" ? "border-b-white opacity-100" : "border-b-white/40",
      )} />
      <span className={cx(
        "block w-0 h-0 border-l-[3px] border-r-[3px] border-t-[4px] border-l-transparent border-r-transparent",
        state === "desc" ? "border-t-white opacity-100" : "border-t-white/40",
      )} />
    </span>
  );
}

const columns = [
  col.accessor("tradedAt", {
    header: "Date",
    cell: i => (
      <span className="font-mono text-[11px] text-white/25 whitespace-nowrap">
        {new Date(i.getValue()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
      </span>
    ),
    sortingFn: "datetime",
  }),
  col.accessor("pair", {
    header: "Pair",
    cell: i => (
      <span className="font-mono text-[13px] text-white font-medium tracking-[0.06em]">
        {i.getValue()}
      </span>
    ),
  }),
  col.accessor("direction", {
    header: "Dir",
    cell: i => <DirectionTag dir={i.getValue()} />,
    enableSorting: false,
  }),
  col.accessor("entryPrice", {
    header: "Entry",
    cell: i => <span className="font-mono text-[12px] text-white/45">{i.getValue()}</span>,
  }),
  col.accessor("stopLoss", {
    header: "Stop",
    cell: i => <span className="font-mono text-[12px] text-red-400/35">{i.getValue()}</span>,
  }),
  col.accessor("takeProfit", {
    header: "TP",
    cell: i => <span className="font-mono text-[12px] text-emerald-400/35">{i.getValue()}</span>,
  }),
  col.accessor("exitPrice", {
    header: "Exit",
    cell: i => <span className="font-mono text-[12px] text-white/55">{i.getValue()}</span>,
  }),
  col.accessor("rMultiple", {
    header: "R",
    cell: i => (
      <div className="flex items-center gap-2">
        <RBadge r={i.getValue()} />
      </div>
    ),
    sortingFn: "basic",
  }),
  col.accessor("notes", {
    header: "Notes",
    cell: i => i.getValue() ? (
      <span className="block font-mono text-[11px] text-white/22 overflow-hidden text-ellipsis whitespace-nowrap max-w-[180px]">
        {i.getValue()}
      </span>
    ) : null,
    enableSorting: false,
  }),
  col.accessor("id", {
    header: "",
    id: "actions",
    cell: i => (
      <Link
        href={`/trades/${i.getValue()}/edit`}
        className="font-mono text-[10px] text-white/20 no-underline group-hover:text-teal-400/60 hover:!text-teal-400 transition-colors duration-150 tracking-[0.06em] uppercase"
      >
        Edit
      </Link>
    ),
    enableSorting: false,
  }),
];

const COL_LABELS: Record<string, string> = {
  tradedAt:   "Date",
  pair:       "Pair",
  direction:  "Dir",
  entryPrice: "Entry",
  stopLoss:   "Stop",
  takeProfit: "TP",
  exitPrice:  "Exit",
  rMultiple:  "R",
  notes:      "Notes",
};

function EmptyState() {
  return (
    <div className="relative flex flex-col items-center justify-center px-10 py-20 text-center bg-[#0d1117] border border-white/[0.065]  overflow-hidden">

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full bg-emerald-400/[0.04] blur-[60px] pointer-events-none" />

      <div className="relative mb-6">
        <div className="w-[52px] h-[52px]  bg-emerald-400/[0.06] border border-emerald-400/[0.12] flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 48 48" fill="none" className="text-emerald-400/40">
            <rect x="6" y="6" width="36" height="36" rx="3" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12 32 L18 22 L26 27 L34 16 L38 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <p className="relative font-mono text-[13px] text-white/40 mb-1 tracking-[0.02em]">
        No trades logged yet.
      </p>
      <p className="relative font-mono text-[11px] text-white/20 mb-6 leading-[1.6] max-w-[220px]">
        Every trade logged is a data point.<br />Start building your edge.
      </p>

      <Link
        href="/trades/new"
        className="relative inline-flex items-center gap-2 px-4 py-[9px] bg-emerald-400/[0.08] border border-emerald-400/20 font-mono text-[11px] text-emerald-400 no-underline hover:bg-emerald-400/[0.14] hover:border-emerald-400/30 transition-all duration-150 tracking-[0.04em]"
      >
        Log your first trade
        <span className="text-emerald-400/50">→</span>
      </Link>
    </div>
  );
}

interface Props {
  trades:    Trade[];  
  total:     number;   
  page:      number;   
  pageCount: number; 
}

export function TradesList({ trades, total, page, pageCount }: Props) {
  const [sorting,          setSorting]          = useState<SortingState>([{ id: "tradedAt", desc: true }]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [showColMenu,      setShowColMenu]      = useState(false);

  // TanStack only handles column sorting within the current page.
  // Pagination is driven entirely by URL — no TanStack pagination state needed.
  const table = useReactTable({
    data:     trades,
    columns,
    state:    { sorting, columnVisibility },
    onSortingChange:          setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel:   getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (total === 0) return <EmptyState />;

  const { rows } = table.getRowModel();

  return (
    <div className="space-y-3">

      <div className="flex items-center justify-end gap-3">
        <span className="font-mono text-[10px] text-white/20 tracking-[0.06em]">
          {total} {total === 1 ? "trade" : "trades"}
        </span>

        <div className="relative">
          <button
            onClick={() => setShowColMenu(v => !v)}
            className={cx(
              "flex items-center gap-[6px] px-3 py-[7px] rounded-[6px] font-mono text-[10px] uppercase tracking-[0.1em] transition-all duration-150 border",
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
              className="absolute right-0 top-[calc(100%+6px)] z-50 w-[160px] rounded-[8px] border border-white/[0.1] shadow-[0_16px_48px_rgba(0,0,0,0.7)] py-2"
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

      <div className="bg-[#0d1117] border border-white/[0.065] rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {table.getFlatHeaders().map(header => {
                const canSort = header.column.getCanSort();
                const sorted  = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    className={cx(TH_CLASS, canSort ? "cursor-pointer select-none group" : "")}
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
            {rows.map((row, i) => (
              <tr
                key={row.id}
                className={cx(
                  "transition-colors duration-150 hover:bg-white/[0.02] group",
                  i < rows.length - 1 ? "border-b border-white/[0.04]" : "",
                )}
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className={TD_CLASS}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between pt-1">
          <span className="font-mono text-[10px] text-white/20 tracking-[0.06em]">
            Page {page} of {pageCount}
          </span>
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link
                href={`/trades?page=${page - 1}`}
                className="px-3 py-[7px] rounded-[6px] border border-white/[0.065] font-mono text-[11px] text-white/35 no-underline hover:border-white/12 hover:text-white/55 transition-all duration-150"
              >
                ← Prev
              </Link>
            ) : (
              <span className="px-3 py-[7px] rounded-[6px] border border-white/[0.065] font-mono text-[11px] text-white/15 cursor-not-allowed">
                ← Prev
              </span>
            )}
            {page < pageCount ? (
              <Link
                href={`/trades?page=${page + 1}`}
                className="px-3 py-[7px] rounded-[6px] border border-white/[0.065] font-mono text-[11px] text-white/35 no-underline hover:border-white/12 hover:text-white/55 transition-all duration-150"
              >
                Next →
              </Link>
            ) : (
              <span className="px-3 py-[7px] rounded-[6px] border border-white/[0.065] font-mono text-[11px] text-white/15 cursor-not-allowed">
                Next →
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}