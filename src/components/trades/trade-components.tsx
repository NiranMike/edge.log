"use client";


import type { Trade } from "@/types";
import Link from "next/link";
import { cx } from "@/style";

// ── Shared primitives ─────────────────────────────────────────────────────────

export function RBadge({ r }: { r: number }) {
  // Intensity levels for win magnitude
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

// Mini R bar — shows magnitude visually
export function RBar({ r }: { r: number }) {
  const capped = Math.min(Math.abs(r), 5); // cap at 5R display
  const pct = (capped / 5) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="w-[40px] h-[3px] bg-white/[0.05] rounded-full overflow-hidden">
        <div
          className={cx("h-full rounded-full", r >= 0 ? "bg-emerald-400/50" : "bg-red-400/50")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export const TH_CLASS = "px-4 py-3 text-left bg-[#0a0e14] font-mono text-[9px] uppercase tracking-[0.16em] text-white/22 font-normal whitespace-nowrap";
export const TD_CLASS = "px-4 py-[12px]";

export function RecentTrades({ trades }: { trades: Trade[] }) {
  if (trades.length === 0) return null;

  return (
    <div className="bg-[#0d1117] border border-white/[0.065] rounded-xl overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white/[0.05]">
            {["Date", "Pair", "Side", "Entry → Exit", "R", ""].map(h => (
              <th key={h} className={TH_CLASS}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {trades.map((t, i) => (
            <tr
              key={t.id}
              className={cx(
                "transition-colors duration-150 hover:bg-white/[0.02] group",
                i < trades.length - 1 ? "border-b border-white/[0.04]" : "",
              )}
            >
              <td className={cx(TD_CLASS, "font-mono text-[11px] text-white/25 whitespace-nowrap")}>
                {new Date(t.tradedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </td>
              <td className={cx(TD_CLASS, "font-mono text-[13px] text-white font-medium tracking-[0.06em]")}>
                {t.pair}
              </td>
              <td className={TD_CLASS}>
                <DirectionTag dir={t.direction} />
              </td>
              <td className={cx(TD_CLASS, "font-mono text-[12px]")}>
                <span className="text-white/45">{t.entryPrice}</span>
                <span className="text-white/18 mx-[6px]">→</span>
                <span className="text-white/55">{t.exitPrice}</span>
              </td>
              <td className={TD_CLASS}>
                <div className="flex items-center gap-2">
                  <RBadge r={t.rMultiple} />
                  <RBar r={t.rMultiple} />
                </div>
              </td>
              <td className={cx(TD_CLASS, "whitespace-nowrap")}>
                <Link
                  href={`/trades/${t.id}/edit`}
                  className="font-mono text-[10px] text-white/20 no-underline group-hover:text-teal-400/60 hover:!text-teal-400 transition-colors duration-150 tracking-[0.06em] uppercase"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

