"use client";

import type { Trade } from "@/types";
import Link from "next/link";
import { cx } from "@/style";
import { AppTable, type TableColumn } from "@/components/ui/app-table";

// Re-export so existing imports in trades-list.tsx keep working.
export { TH_CLASS, TD_CLASS } from "@/components/ui/app-table";


export function RBadge({ r }: { r: number }) {
  const absR = Math.abs(r);
  const intensity =
    absR >= 3 ? "strong" :
    absR >= 1 ? "normal" :
    absR > 0  ? "weak"   : "zero";

  const wonClasses =
    intensity === "strong" ? "bg-emerald-400/20 text-emerald-300 border-emerald-400/25" :
    intensity === "normal" ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/15" :
                             "bg-emerald-400/[0.06] text-emerald-400/70 border-emerald-400/10";

  const lostClasses =
    intensity === "strong" ? "bg-red-400/20 text-red-300 border-red-400/25" :
    intensity === "normal" ? "bg-red-400/10 text-red-400 border-red-400/15" :
                             "bg-red-400/[0.06] text-red-400/70 border-red-400/10";

  return (
    <span className={cx(
      "inline-flex items-center px-[8px] py-[3px] rounded font-mono text-[12px] font-medium tracking-[-0.02em] border",
      r > 0 ? wonClasses : r < 0 ? lostClasses : "bg-white/[0.04] text-white/25 border-white/[0.06]",
    )}>
      {r > 0 ? "+" : ""}{r}R
    </span>
  );
}

export function DirectionTag({ dir }: { dir: "LONG" | "SHORT" }) {
  return (
    <span className={cx(
      "font-mono text-[10px] tracking-[0.1em] uppercase",
      dir === "LONG" ? "text-emerald-400" : "text-red-400",
    )}>
      {dir === "LONG" ? "▲" : "▼"}&nbsp;{dir}
    </span>
  );
}

export function RBar({ r }: { r: number }) {
  const capped = Math.min(Math.abs(r), 5);
  const pct = (capped / 5) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="w-[40px] h-[3px] bg-[var(--bd)] rounded-full overflow-hidden">
        <div
          className={cx("h-full rounded-full", r >= 0 ? "bg-emerald-400/50" : "bg-red-400/50")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const RECENT_COLUMNS: TableColumn<Trade>[] = [
  {
    header: "Date",
    cell: t => (
      <span className="font-mono text-[11px] text-[var(--tx-3)] whitespace-nowrap">
        {new Date(t.tradedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
      </span>
    ),
  },
  {
    header: "Pair",
    cell: t => (
      <span className="font-mono text-[13px] text-[var(--tx-1)] font-medium tracking-[0.06em]">
        {t.pair}
      </span>
    ),
  },
  {
    header: "Side",
    cell: t => <DirectionTag dir={t.direction} />,
  },
  {
    header: "Entry → Exit",
    cell: t => (
      <span className="font-mono text-[12px]">
        <span className="text-[var(--tx-2)]">{t.entryPrice}</span>
        <span className="text-[var(--tx-4)] mx-[6px]">→</span>
        <span className="text-[var(--tx-2)]">{t.exitPrice}</span>
      </span>
    ),
  },
  {
    header: "R",
    cell: t => (
      <div className="flex items-center gap-2">
        <RBadge r={t.rMultiple} />
        <RBar r={t.rMultiple} />
      </div>
    ),
  },
  {
    header: "",
    className: "whitespace-nowrap",
    cell: t => (
      <Link
        href={`/trades/${t.id}/edit`}
        className="font-mono text-[10px] text-[var(--tx-4)] no-underline group-hover:text-[var(--ac-2)] hover:!text-[var(--ac-2)] transition-colors duration-150 tracking-[0.06em] uppercase"
      >
        Edit
      </Link>
    ),
  },
];

export function RecentTrades({ trades }: { trades: Trade[] }) {
  if (trades.length === 0) return null;

  return (
    <AppTable
      columns={RECENT_COLUMNS}
      rows={trades}
      getKey={t => t.id}
    />
  );
}
