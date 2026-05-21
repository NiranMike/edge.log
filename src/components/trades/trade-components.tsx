"use client";


import type { Trade } from "@/types";
import Link from "next/link";
import { cx } from "@/style";


export function RBadge({ r }: { r: number }) {
  const absR = Math.abs(r);
  const opacity = absR >= 3 ? "0.2" : absR >= 1 ? "0.12" : "0.07";
  const borderOp = absR >= 3 ? "0.3" : absR >= 1 ? "0.18" : "0.1";

  if (r === 0) {
    return (
      <span className="inline-flex items-center px-[8px] py-[3px] rounded font-mono text-[12px] font-medium tracking-[-0.02em] border border-[var(--bd)] text-[var(--tx-3)] bg-[var(--bg-overlay)]">
        0R
      </span>
    );
  }

  const base = r > 0 ? "var(--win)" : "var(--loss)";
  return (
    <span
      className="inline-flex items-center px-[8px] py-[3px] rounded font-mono text-[12px] font-medium tracking-[-0.02em] border"
      style={{
        color:       base,
        background:  `color-mix(in srgb, ${base} ${parseFloat(opacity)*100}%, transparent)`,
        borderColor: `color-mix(in srgb, ${base} ${parseFloat(borderOp)*100}%, transparent)`,
      }}
    >
      {r > 0 ? "+" : ""}{r}R
    </span>
  );
}

export function DirectionTag({ dir }: { dir: "LONG" | "SHORT" }) {
  return (
    <span
      className="font-mono text-[10px] tracking-[0.1em] uppercase"
      style={{ color: dir === "LONG" ? "var(--win)" : "var(--loss)" }}
    >
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
      <div className="w-[40px] h-[3px] bg-[var(--bd)] rounded-full overflow-hidden">
        <div
          className={cx("h-full rounded-full", r >= 0 ? "bg-emerald-400/50" : "bg-red-400/50")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export const TH_CLASS = "px-4 py-3 text-left bg-[var(--bg-elevated)] font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--tx-4)] font-normal whitespace-nowrap";
export const TD_CLASS = "px-4 py-[12px]";

export function RecentTrades({ trades }: { trades: Trade[] }) {
  if (trades.length === 0) return null;

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--bd)] rounded-xl overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[var(--bd)]">
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
                "transition-colors duration-150 hover:bg-[var(--bg-overlay)] group",
                i < trades.length - 1 ? "border-b border-[var(--bd)]" : "",
              )}
            >
              <td className={cx(TD_CLASS, "font-mono text-[11px] text-[var(--tx-3)] whitespace-nowrap")}>
                {new Date(t.tradedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </td>
              <td className={cx(TD_CLASS, "font-mono text-[13px] text-[var(--tx-1)] font-medium tracking-[0.06em]")}>
                {t.pair}
              </td>
              <td className={TD_CLASS}>
                <DirectionTag dir={t.direction} />
              </td>
              <td className={cx(TD_CLASS, "font-mono text-[12px]")}>
                <span className="text-[var(--tx-3)]">{t.entryPrice}</span>
                <span className="text-[var(--tx-4)] mx-[6px]">→</span>
                <span className="text-[var(--tx-2)]">{t.exitPrice}</span>
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
                  className="font-mono text-[10px] text-[var(--tx-4)] no-underline group-hover:text-[var(--ac-2)] transition-colors duration-150 tracking-[0.06em] uppercase"
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

