import Link from "next/link";
import { DirectionTag, RBadge, TD_CLASS, TH_CLASS } from "./trade-components";
import { cx } from "@/style";
import { Trade } from "@/types";

export function TradesList({ trades }: { trades: Trade[] }) {
  if (trades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-10 py-16 text-center bg-[#0d1117] border border-white/[0.065] rounded-xl">
        <div className="mb-5 opacity-20">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="6" y="6" width="36" height="36" rx="3" stroke="#f59e0b" strokeWidth="1"/>
            <path d="M12 32 L18 22 L26 27 L34 16 L38 21" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="font-mono text-[12px] text-white/28 mb-1">Nothing logged yet.</p>
        <Link href="/trades/new" className="font-mono text-[12px] text-amber-400 no-underline hover:text-amber-300 transition-colors">
          Log your first trade →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0d1117] border border-white/[0.065] rounded-xl overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white/[0.05]">
            {["Date", "Pair", "Dir", "Entry", "Stop", "TP", "Exit", "R", "Notes", ""].map(h => (
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
                {new Date(t.tradedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" })}
              </td>
              <td className={cx(TD_CLASS, "font-mono text-[13px] text-white font-medium tracking-[0.06em]")}>
                {t.pair}
              </td>
              <td className={TD_CLASS}>
                <DirectionTag dir={t.direction} />
              </td>
              <td className={cx(TD_CLASS, "font-mono text-[12px] text-white/45")}>{t.entryPrice}</td>
              <td className={cx(TD_CLASS, "font-mono text-[12px] text-red-400/35")}>{t.stopLoss}</td>
              <td className={cx(TD_CLASS, "font-mono text-[12px] text-emerald-400/35")}>{t.takeProfit}</td>
              <td className={cx(TD_CLASS, "font-mono text-[12px] text-white/55")}>{t.exitPrice}</td>
              <td className={TD_CLASS}>
                <div className="flex items-center gap-2">
                  <RBadge r={t.rMultiple} />
                </div>
              </td>
              <td className={cx(TD_CLASS, "max-w-[180px]")}>
                {t.notes && (
                  <span className="block font-mono text-[11px] text-white/22 overflow-hidden text-ellipsis whitespace-nowrap">
                    {t.notes}
                  </span>
                )}
              </td>
              <td className={cx(TD_CLASS, "whitespace-nowrap")}>
                <Link
                  href={`/trades/${t.id}/edit`}
                  className="font-mono text-[10px] text-white/20 no-underline group-hover:text-amber-400/60 hover:!text-amber-400 transition-colors duration-150 tracking-[0.06em] uppercase"
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