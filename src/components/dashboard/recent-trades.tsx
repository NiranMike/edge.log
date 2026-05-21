import type { Trade } from "@/types";
import Link from "next/link";
import { cx } from "@/style";
 
function RBadge({ r }: { r: number }) {
  const won = r > 0;
  return (
    <span className={cx(
      "inline-flex items-center px-2 py-0.75 rounded font-mono text-[11px] sm:text-[12px] font-medium tracking-[-0.02em]",
      won ? "bg-[var(--win-dim)] text-[var(--win)]" : "bg-[var(--loss-dim)] text-[var(--loss)]",
    )}>
      {r >= 0 ? "+" : ""}{r}R
    </span>
  );
}
 
function DirectionTag({ dir }: { dir: "LONG" | "SHORT" }) {
  return (
    <span className={cx(
      "font-mono text-[10px] tracking-[0.08em]",
      dir === "LONG" ? "text-[var(--win)]" : "text-[var(--loss)]",
    )}>
      {dir === "LONG" ? "▲" : "▼"}
      <span className="hidden xs:inline"> {dir}</span>
    </span>
  );
}
 
export function RecentTrades({ trades }: { trades: Trade[] }) {
  if (trades.length === 0) return null;
 
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--bd)] rounded-xl overflow-hidden">
 
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse min-w-[520px]">
          <thead>
            <tr className="border-b border-[var(--bd)]">
              {["Date", "Pair", "Side", "Entry", "Exit", "R", ""].map(h => (
                <th
                  key={h}
                  className="px-4 py-3 text-left bg-[var(--bg-elevated)] font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--tx-3)] font-normal"
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
                  "transition-colors duration-150 hover:bg-[var(--bg-overlay)]",
                  i < trades.length - 1 ? "border-b border-[var(--bd)]" : "",
                )}
              >
                <td className="px-4 py-3.25 font-mono text-[12px] text-[var(--tx-3)] whitespace-nowrap">
                  {new Date(t.tradedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </td>
                <td className="px-4 py-3.25 font-mono text-[13px] text-[var(--tx-1)] font-medium tracking-[0.04em]">
                  {t.pair}
                </td>
                <td className="px-4 py-3.25">
                  <DirectionTag dir={t.direction} />
                </td>
                <td className="px-4 py-3.25 font-mono text-[12px] text-[var(--tx-2)]">{t.entryPrice}</td>
                <td className="px-4 py-3.25 font-mono text-[12px] text-[var(--tx-2)]">{t.exitPrice}</td>
                <td className="px-4 py-3.25"><RBadge r={t.rMultiple} /></td>
                <td className="px-4 py-3.25">
                  <Link
                    href={`/trades/${t.id}/edit`}
                    className="font-mono text-[11px] text-[var(--tx-3)] no-underline hover:text-[var(--ac-2)] transition-colors duration-150"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      <div className="sm:hidden divide-y divide-[var(--bd)]">
        {trades.map((t) => (
          <Link
            key={t.id}
            href={`/trades/${t.id}/edit`}
            className="flex items-center justify-between px-4 py-3.5 no-underline hover:bg-[var(--bg-overlay)] transition-colors duration-150 gap-3"
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
    </div>
  );
}