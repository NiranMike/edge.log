"use client";

import { SESSION_META } from "@/const/analytics-const";
import { cx } from "@/style";
import { Tooltip } from "@/components/ui/tooltip";
import { RLabel } from "../shared/r-label";
import type { SessionStat } from "@/types";
import { TOOLTIP_COPY } from "@/const/tooltip-const";

interface Props {
  sessions: SessionStat[];
}

export function SessionBreakdown({ sessions }: Props) {
  const active = sessions?.filter(s => s?.trades > 0);

  return (
    <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--bd)] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--bd)]">
        <div className="w-4 h-px bg-[var(--ac-2)] opacity-50" />
        <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--tx-3)]">Session Performance</h2>
        <Tooltip content={TOOLTIP_COPY.sessionBreakdown} />
      </div>

      <div className="p-4">
        {active?.length === 0 ? (
          <p className="font-mono text-[12px] text-[var(--tx-4)] text-center py-6">No data</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sessions?.filter(s => s.trades > 0).map(session => {
              const meta = SESSION_META[session.session];
              return (
                <div
                  key={session.session}
                  className="flex items-start gap-3 px-4 py-3.5 rounded-[8px] bg-[var(--bg-overlay)] border border-[var(--bd)] hover:border-[var(--bd-hi)] transition-colors duration-200"
                >
                  <div className={cx("w-[6px] h-[6px] rounded-full mt-1.5 shrink-0", meta.dot)} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-2">
                      <span className={cx("font-mono text-[12px] font-medium", meta.color)}>
                        {session.session}
                      </span>
                      <span className="font-mono text-[10px] text-[var(--tx-4)]">{meta.hours}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {/* Trades */}
                      <div>
                        <div className="flex items-center gap-1 mb-0.5">
                          <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[var(--tx-4)]">Trades</p>
                          <Tooltip content={TOOLTIP_COPY.trades} />
                        </div>
                        <p className="font-mono text-[13px] text-[var(--tx-2)]">{session.trades}</p>
                      </div>

                      {/* Win % */}
                      <div>
                        <div className="flex items-center gap-1 mb-0.5">
                          <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[var(--tx-4)]">Win %</p>
                          <Tooltip content={TOOLTIP_COPY.winRate} />
                        </div>
                        <p className={cx(
                          "font-mono text-[13px]",
                          session.winRate >= 55 ? "text-[var(--win)]"  :
                          session.winRate >= 45 ? "text-[var(--tx-2)]" : "text-[var(--loss)]",
                        )}>
                          {session.winRate}%
                        </p>
                      </div>

                      {/* Avg R — now uses RLabel with ratio */}
                      <div>
                        <div className="flex items-center gap-1 mb-0.5">
                          <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[var(--tx-4)]">Avg R</p>
                          <Tooltip content={TOOLTIP_COPY.avgR} />
                        </div>
                        <RLabel value={session.avgR} size="sm" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}