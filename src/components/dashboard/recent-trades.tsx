"use client";

import type { Trade } from "@/types";
import Link from "next/link";
import { cx } from "@/style";
import { AppTable, type TableColumn } from "@/components/ui/app-table";

function RBadge({ r }: { r: number }) {
  const won = r > 0;
  return (
    <span className={cx(
      "inline-flex items-center px-2 py-0.75 rounded font-mono text-[11px] sm:text-[12px] font-medium tracking-[-0.02em]",
      won ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400",
    )}>
      {r >= 0 ? "+" : ""}{r}R
    </span>
  );
}

function DirectionTag({ dir }: { dir: "LONG" | "SHORT" }) {
  return (
    <span className={cx(
      "font-mono text-[10px] tracking-[0.08em]",
      dir === "LONG" ? "text-emerald-400" : "text-red-400",
    )}>
      {dir === "LONG" ? "▲" : "▼"}
      <span className="hidden xs:inline"> {dir}</span>
    </span>
  );
}

const COLUMNS: TableColumn<Trade>[] = [
  {
    header: "Date",
    cell: t => (
      <span className="font-mono text-[12px] text-[var(--tx-3)] whitespace-nowrap">
        {new Date(t.tradedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
      </span>
    ),
  },
  {
    header: "Pair",
    cell: t => (
      <span className="font-mono text-[13px] text-[var(--tx-1)] font-medium tracking-[0.04em]">
        {t.pair}
      </span>
    ),
  },
  {
    header: "Side",
    cell: t => <DirectionTag dir={t.direction} />,
  },
  {
    header: "Entry",
    cell: t => <span className="font-mono text-[12px] text-[var(--tx-2)]">{t.entryPrice}</span>,
  },
  {
    header: "Exit",
    cell: t => <span className="font-mono text-[12px] text-[var(--tx-2)]">{t.exitPrice}</span>,
  },
  {
    header: "R",
    cell: t => <RBadge r={t.rMultiple} />,
  },
  {
    header: "",
    cell: t => (
      <Link
        href={`/trades/${t.id}/edit`}
        className="font-mono text-[11px] text-[var(--tx-3)] no-underline hover:text-[var(--ac-2)] transition-colors duration-150"
      >
        Edit
      </Link>
    ),
  },
];

export function RecentTrades({ trades }: { trades: Trade[] }) {
  if (trades.length === 0) return null;

  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block">
        <AppTable
          columns={COLUMNS}
          rows={trades}
          getKey={t => t.id}
          minWidth={520}
        />
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden bg-[var(--bg-surface)] border border-[var(--bd)] rounded-xl overflow-hidden divide-y divide-[var(--bd)]">
        {trades.map(t => (
          <Link
            key={t.id}
            href={`/trades/${t.id}/edit`}
            className="flex items-center justify-between px-4 py-3.5 no-underline hover:bg-white/[0.025] transition-colors duration-150 gap-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-[3px]">
                <span className="font-mono text-[13px] text-[var(--tx-1)] font-medium tracking-[0.04em]">
                  {t.pair}
                </span>
                <DirectionTag dir={t.direction} />
              </div>
              <span className="font-mono text-[10px] text-[var(--tx-3)]">
                {new Date(t.tradedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                {" · "}
                {t.entryPrice} → {t.exitPrice}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <RBadge r={t.rMultiple} />
              <span className="font-mono text-[11px] text-[var(--tx-4)]">›</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
