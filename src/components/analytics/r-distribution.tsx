"use client";

import { cx } from "@/style";
import { Tooltip } from "@/components/ui/tooltip";
import type { RBucket } from "@/types";
import { TOOLTIP_COPY } from "@/const/tooltip-const";

interface Props {
  buckets: RBucket[];
}

export function RDistribution({ buckets }: Props) {
  const maxCount = Math.max(...buckets.map(b => b.count), 1);

  return (
    <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--bd)] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--bd)]">
        <div className="w-4 h-px bg-[var(--ac-2)] opacity-50" />
        <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--tx-3)]">R Distribution</h2>
        <Tooltip content={TOOLTIP_COPY.rDistribution} />
      </div>

      <div className="px-5 py-5">
        <div className="relative pt-10">
          <div className="flex items-end gap-2 h-[100px]">
            {buckets.map(bucket => {
              const heightPx = Math.round((bucket.count / maxCount) * 100);
              const isLoss   = bucket.max <= 0 && bucket.min < 0;
              const isWin    = bucket.min >= 0;

              return (
                <div
                  key={bucket.label}
                  className="flex-1 flex flex-col items-end justify-end group relative h-full"
                >
                  {bucket.count > 0 && (
                    <div className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
                      <div
                        className="rounded-[6px] border border-[var(--bd-hi)] px-2 py-1.5 whitespace-nowrap shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
                        style={{ backgroundColor: "var(--bg-elevated)" }}
                      >
                        <p className="font-mono text-[10px] text-[var(--tx-2)]">{bucket.label}</p>
                        <p className="font-mono text-[11px] text-[var(--tx-1)]">{bucket.count} trades</p>
                        <p className="font-mono text-[10px] text-[var(--tx-3)]">{bucket.pct}%</p>
                      </div>
                    </div>
                  )}

                  <div
                    className={cx(
                      "w-full rounded-t-[3px] transition-all duration-500",
                      isLoss
                        ? "bg-red-400/40 group-hover:bg-red-400/60"
                        : isWin
                        ? "bg-emerald-400/40 group-hover:bg-emerald-400/60"
                        : "bg-[var(--bd-hi)] group-hover:bg-[var(--bd-hi)]",
                      bucket.count === 0 ? "opacity-20" : "",
                    )}
                    style={{ height: bucket.count === 0 ? 2 : Math.max(heightPx, 4) }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          {buckets.map(bucket => (
            <div key={bucket.label} className="flex-1 text-center">
              <span className="font-mono text-[8px] text-[var(--tx-4)] leading-tight block">{bucket.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}