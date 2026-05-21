"use client";

import { useState } from "react";
import { cx } from "@/style";
import { Tooltip } from "@/components/ui/tooltip";
import { RLabel } from "../shared/r-label";
import type { PairStat } from "@/types";
import { TOOLTIP_COPY } from "@/const/tooltip-const";

interface Props {
  pairs: PairStat[];
}

type SortKey = "totalR" | "winRate" | "trades" | "avgR";

function SortBtn({ label, active, desc, onClick }: {
  label: string; active: boolean; desc: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "font-mono text-[9px] uppercase tracking-[0.14em] transition-colors duration-150 flex items-center gap-1",
        active ? "text-[var(--ac-2)]" : "text-[var(--tx-4)] hover:text-[var(--tx-3)]",
      )}
    >
      {label}
      <span className="opacity-60">{active ? (desc ? "↓" : "↑") : ""}</span>
    </button>
  );
}

export function PairBreakdown({ pairs }: Props) {
  const [sortKey,  setSortKey]  = useState<SortKey>("totalR");
  const [sortDesc, setSortDesc] = useState(true);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDesc(v => !v);
    else { setSortKey(key); setSortDesc(true); }
  }

  const sorted = [...pairs].sort((a, b) => {
    const diff = a[sortKey] - b[sortKey];
    return sortDesc ? -diff : diff;
  });

  const maxR = Math.max(...pairs.map(p => Math.abs(p.totalR)), 0.01);

  return (
    <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--bd)] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--bd)]">
        <div className="flex items-center gap-3">
          <div className="w-4 h-px bg-[var(--ac-2)] opacity-50" />
          <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--tx-3)]">Pair Breakdown</h2>
          <Tooltip content={TOOLTIP_COPY.pairBreakdown} />
        </div>
        <span className="font-mono text-[10px] text-[var(--tx-4)]">{pairs.length} pairs</span>
      </div>

      <div className="flex items-center gap-4 px-5 py-3 border-b border-[var(--bd)]">
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--tx-4)] mr-1">Sort</span>
        <SortBtn label="Total R"  active={sortKey === "totalR"}  desc={sortDesc} onClick={() => handleSort("totalR")}  />
        <SortBtn label="Win Rate" active={sortKey === "winRate"} desc={sortDesc} onClick={() => handleSort("winRate")} />
        <SortBtn label="Trades"   active={sortKey === "trades"}  desc={sortDesc} onClick={() => handleSort("trades")}  />
        <SortBtn label="Avg R"    active={sortKey === "avgR"}    desc={sortDesc} onClick={() => handleSort("avgR")}    />
      </div>

      <div className="overflow-x-auto">
        {pairs.length === 0 ? (
          <div className="px-5 py-10 text-center font-mono text-[12px] text-[var(--tx-4)]">No pair data</div>
        ) : (
          <table className="w-full border-collapse min-w-[440px]">
            <tbody>
              {sorted.map((p, i) => {
                const barW     = Math.abs(p.totalR) / maxR * 100;
                const positive = p.totalR >= 0;
                return (
                  <tr
                    key={p.pair}
                    className={cx(
                      "group transition-colors duration-150 hover:bg-[var(--bg-overlay)]",
                      i < sorted.length - 1 ? "border-b border-[var(--bd)]" : "",
                    )}
                  >
                    {/* Pair name */}
                    <td className="px-5 py-[13px] whitespace-nowrap">
                      <span className="font-mono text-[13px] text-[var(--tx-1)] font-medium tracking-[0.06em]">
                        {p.pair}
                      </span>
                    </td>

                    {/* Win rate */}
                    <td className="px-3 py-[13px] whitespace-nowrap">
                      <span className={cx(
                        "font-mono text-[12px]",
                        p.winRate >= 55 ? "text-[var(--win)]" :
                        p.winRate >= 45 ? "text-[var(--tx-2)]" : "text-[var(--loss)]",
                      )}>
                        {p.winRate}%
                      </span>
                    </td>

                    {/* Trade count */}
                    <td className="px-3 py-[13px] whitespace-nowrap">
                      <span className="font-mono text-[11px] text-[var(--tx-3)]">{p.trades}t</span>
                    </td>

                    {/* Total R bar + RLabel */}
                    <td className="px-3 py-[13px] w-full">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-[4px] rounded-full bg-[var(--bd)] overflow-hidden max-w-[120px]">
                          <div
                            className={cx(
                              "h-full rounded-full transition-all duration-500",
                              positive ? "bg-emerald-400/60" : "bg-red-400/50",
                            )}
                            style={{ width: `${barW}%` }}
                          />
                        </div>
                        {/* RLabel shows value + ratio sub-label */}
                        <RLabel value={p.totalR} size="sm" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}