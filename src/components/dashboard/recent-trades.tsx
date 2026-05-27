"use client";

import type { Trade } from "@/types";
import Link from "next/link";
import { cx } from "@/style";
import { DirectionTag, RBadge, RBar } from "@/components/trades/trade-components";

const HEADERS = ["Date", "Pair", "Side", "Entry → Exit", "R", ""];

export function RecentTrades({ trades }: { trades: Trade[] }) {
  if (trades.length === 0) return null;

  return (
    <div className="rounded-xl border border-white/[0.065] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: 520 }}>
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="w-[3px] p-0 bg-[#0a0d12]" />
              {HEADERS.map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left bg-[#0a0d12] font-mono text-[9px] uppercase tracking-[0.16em] text-white/25 font-normal whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map((t, i) => (
              <tr
                key={t.id}
                className={cx(
                  "transition-colors duration-100 group",
                  t.won ? "hover:bg-emerald-400/[0.025]" : "hover:bg-red-400/[0.025]",
                  i < trades.length - 1 ? "border-b border-white/[0.04]" : "",
                )}
              >
                <td className={cx("w-[3px] p-0", t.won ? "bg-emerald-400/25" : "bg-red-400/20")} />
                <td className="px-4 py-3">
                  <span className="font-mono text-[11px] text-white/30 whitespace-nowrap tabular-nums">
                    {new Date(t.tradedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-[13px] font-semibold text-white tracking-[0.05em]">
                    {t.pair}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <DirectionTag dir={t.direction} />
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-[12px] tabular-nums">
                    <span className="text-white/55">{t.entryPrice}</span>
                    <span className="text-white/20 mx-[6px]">→</span>
                    <span className="text-white/70">{t.exitPrice}</span>
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <RBadge r={t.rMultiple} />
                    <RBar r={t.rMultiple} />
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link
                    href={`/trades/${t.id}/edit`}
                    className="inline-flex items-center gap-1 font-mono text-[10px] text-white/20 no-underline opacity-0 group-hover:opacity-100 hover:!text-teal-400 transition-all duration-150 tracking-[0.06em] uppercase"
                  >
                    Edit
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 10L10 2M10 2H5M10 2v5"/>
                    </svg>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
