"use client";

import { useState } from "react";
import { cx } from "@/style";
import type { PairStat } from "@/types";

interface Props {
  pairs: PairStat[];
}

type SortKey = "totalR" | "winRate" | "trades" | "avgR";

function SortBtn({ label, active, desc, onClick }: { label: string; active: boolean; desc: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cx("font-mono text-[9px] uppercase tracking-[0.14em] transition-colors duration-150 flex items-center gap-1", active ? "text-teal-400" : "text-white/20 hover:text-white/45")}>
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
    <div className="rounded-xl bg-[#0d1117] border border-white/[0.065] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-4 h-px bg-teal-400/50" />
          <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">Pair Breakdown</h2>
        </div>
        <span className="font-mono text-[10px] text-white/20">{pairs.length} pairs</span>
      </div>
      <div className="flex items-center gap-4 px-5 py-3 border-b border-white/[0.04]">
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/15 mr-1">Sort</span>
        <SortBtn label="Total R"  active={sortKey === "totalR"}  desc={sortDesc} onClick={() => handleSort("totalR")}  />
        <SortBtn label="Win Rate" active={sortKey === "winRate"} desc={sortDesc} onClick={() => handleSort("winRate")} />
        <SortBtn label="Trades"   active={sortKey === "trades"}  desc={sortDesc} onClick={() => handleSort("trades")}  />
        <SortBtn label="Avg R"    active={sortKey === "avgR"}    desc={sortDesc} onClick={() => handleSort("avgR")}    />
      </div>
      <div className="overflow-x-auto">
        {pairs.length === 0 ? (
          <div className="px-5 py-10 text-center font-mono text-[12px] text-white/20">No pair data</div>
        ) : (
          <table className="w-full border-collapse min-w-[420px]">
            <tbody>
              {sorted.map((p, i) => {
                const barW     = Math.abs(p.totalR) / maxR * 100;
                const positive = p.totalR >= 0;
                return (
                  <tr key={p.pair} className={cx("group transition-colors duration-150 hover:bg-white/[0.02]", i < sorted.length - 1 ? "border-b border-white/[0.04]" : "")}>
                    <td className="px-5 py-[13px] whitespace-nowrap">
                      <span className="font-mono text-[13px] text-white/80 font-medium tracking-[0.06em]">{p.pair}</span>
                    </td>
                    <td className="px-3 py-[13px] whitespace-nowrap">
                      <span className={cx("font-mono text-[12px]", p.winRate >= 55 ? "text-emerald-400" : p.winRate >= 45 ? "text-white/60" : "text-red-400/70")}>
                        {p.winRate}%
                      </span>
                    </td>
                    <td className="px-3 py-[13px] whitespace-nowrap">
                      <span className="font-mono text-[11px] text-white/25">{p.trades}t</span>
                    </td>
                    <td className="px-3 py-[13px] w-full">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-[4px] rounded-full bg-white/[0.04] overflow-hidden max-w-[120px]">
                          <div className={cx("h-full rounded-full transition-all duration-500", positive ? "bg-emerald-400/60" : "bg-red-400/50")} style={{ width: `${barW}%` }} />
                        </div>
                        <span className={cx("font-mono text-[12px] font-medium shrink-0", positive ? "text-emerald-400" : "text-red-400")}>
                          {positive ? "+" : ""}{p.totalR}R
                        </span>
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