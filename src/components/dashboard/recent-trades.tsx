"use client";
// components/dashboard/RecentTrades.tsx
import type { Trade } from "@/types";
import Link from "next/link";
import { cx } from "@/style";

function RBadge({ r }: { r: number }) {
  const won = r > 0;
  return (
    <span
      className={cx(
        "inline-flex items-center px-2 py-[3px] rounded font-mono text-[12px] font-medium tracking-[-0.02em]",
        won ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400",
      )}
    >
      {r >= 0 ? "+" : ""}{r}R
    </span>
  );
}

function DirectionTag({ dir }: { dir: "LONG" | "SHORT" }) {
  return (
    <span
      className={cx(
        "font-mono text-[10px] tracking-[0.08em]",
        dir === "LONG" ? "text-emerald-400" : "text-red-400",
      )}
    >
      {dir === "LONG" ? "▲ LONG" : "▼ SHORT"}
    </span>
  );
}

export function RecentTrades({ trades }: { trades: Trade[] }) {
  if (trades.length === 0) return null;

  return (
    <div className="bg-[#0d1117] border border-white/[0.065] rounded-xl overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white/[0.065]">
            {["Date", "Pair", "Side", "Entry", "Exit", "R", ""].map(h => (
              <th
                key={h}
                className="px-4 py-3 text-left bg-[#0f1318] font-mono text-[10px] uppercase tracking-[0.12em] text-white/28 font-normal"
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
                "transition-colors duration-150 hover:bg-white/[0.025]",
                i < trades.length - 1 ? "border-b border-white/[0.065]" : "",
              )}
            >
              <td className="px-4 py-[13px] font-mono text-[12px] text-white/28">
                {new Date(t.tradedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </td>
              <td className="px-4 py-[13px] font-mono text-[13px] text-white font-medium tracking-[0.04em]">
                {t.pair}
              </td>
              <td className="px-4 py-[13px]">
                <DirectionTag dir={t.direction} />
              </td>
              <td className="px-4 py-[13px] font-mono text-[12px] text-white/55">
                {t.entryPrice}
              </td>
              <td className="px-4 py-[13px] font-mono text-[12px] text-white/55">
                {t.exitPrice}
              </td>
              <td className="px-4 py-[13px]">
                <RBadge r={t.rMultiple} />
              </td>
              <td className="px-4 py-[13px]">
                <Link
                  href={`/trades/${t.id}/edit`}
                  className="font-mono text-[11px] text-white/28 no-underline hover:text-amber-400 transition-colors duration-150"
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