import type { Trade } from "@/types";
import Link from "next/link";
import { cx } from "@/style";
 
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
 
export function RecentTrades({ trades }: { trades: Trade[] }) {
  if (trades.length === 0) return null;
 
  return (
    <div className="bg-[#0d1117] border border-white/[0.065] rounded-xl overflow-hidden">
 
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse min-w-[520px]">
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
                <td className="px-4 py-3.25 font-mono text-[12px] text-white/28 whitespace-nowrap">
                  {new Date(t.tradedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </td>
                <td className="px-4 py-3.25 font-mono text-[13px] text-white font-medium tracking-[0.04em]">
                  {t.pair}
                </td>
                <td className="px-4 py-3.25">
                  <DirectionTag dir={t.direction} />
                </td>
                <td className="px-4 py-3.25 font-mono text-[12px] text-white/55">{t.entryPrice}</td>
                <td className="px-4 py-3.25 font-mono text-[12px] text-white/55">{t.exitPrice}</td>
                <td className="px-4 py-3.25"><RBadge r={t.rMultiple} /></td>
                <td className="px-4 py-3.25">
                  <Link
                    href={`/trades/${t.id}/edit`}
                    className="font-mono text-[11px] text-white/28 no-underline hover:text-teal-400 transition-colors duration-150"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      <div className="sm:hidden divide-y divide-white/[0.05]">
        {trades.map((t) => (
          <Link
            key={t.id}
            href={`/trades/${t.id}/edit`}
            className="flex items-center justify-between px-4 py-3.5 no-underline hover:bg-white/[0.025] transition-colors duration-150 gap-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-[3px]">
                <span className="font-mono text-[13px] text-white font-medium tracking-[0.04em]">
                  {t.pair}
                </span>
                <DirectionTag dir={t.direction} />
              </div>
              <span className="font-mono text-[10px] text-white/28">
                {new Date(t.tradedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                {" · "}
                {t.entryPrice} → {t.exitPrice}
              </span>
            </div>
 
            <div className="flex items-center gap-2 shrink-0">
              <RBadge r={t.rMultiple} />
              <span className="font-mono text-[11px] text-white/20">›</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}