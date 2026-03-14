"use client";
// components/analytics/r-distribution.tsx

import { cx } from "@/style";
import type { RBucket } from "@/types";

interface Props {
  buckets: RBucket[];
}

export function RDistribution({ buckets }: Props) {
  const maxCount = Math.max(...buckets.map(b => b.count), 1);

  return (
    <div className="rounded-xl bg-[#0d1117] border border-white/[0.065] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.05]">
        <div className="w-4 h-px bg-teal-400/50" />
        <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">R Distribution</h2>
      </div>
      <div className="px-5 py-5">
        <div className="flex items-end gap-2 h-[100px] mb-3">
          {buckets.map(bucket => {
            const heightPct = (bucket.count / maxCount) * 100;
            const isLoss    = bucket.max <= 0;
            const isWin     = bucket.min >= 0;
            return (
              <div key={bucket.label} className="flex-1 flex flex-col items-center justify-end gap-1 group relative">
                {bucket.count > 0 && (
                  <div className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
                    <div className="rounded-[6px] border border-white/[0.08] px-2 py-1.5 whitespace-nowrap" style={{ backgroundColor: "#0d1117" }}>
                      <p className="font-mono text-[10px] text-white/60">{bucket.label}</p>
                      <p className="font-mono text-[11px] text-white/80">{bucket.count} trades</p>
                      <p className="font-mono text-[10px] text-white/35">{bucket.pct}%</p>
                    </div>
                  </div>
                )}
                <div
                  className={cx("w-full rounded-t-[3px] transition-all duration-500", isLoss ? "bg-red-400/40 group-hover:bg-red-400/60" : isWin ? "bg-emerald-400/40 group-hover:bg-emerald-400/60" : "bg-white/20 group-hover:bg-white/35", bucket.count === 0 ? "opacity-20" : "")}
                  style={{ height: `${Math.max(heightPct, bucket.count > 0 ? 4 : 2)}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex gap-2">
          {buckets.map(bucket => (
            <div key={bucket.label} className="flex-1 text-center">
              <span className="font-mono text-[8px] text-white/20 leading-tight block">{bucket.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}