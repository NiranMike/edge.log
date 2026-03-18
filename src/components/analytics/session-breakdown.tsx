"use client";

import { cx } from "@/style";
import type { SessionStat, MarketSession } from "@/types";

interface Props {
  sessions: SessionStat[];
}

const SESSION_META: Record<MarketSession, { color: string; dot: string; hours: string }> = {
  "Asia":     { color: "text-violet-400", dot: "bg-violet-400", hours: "23:00–08:00 UTC" },
  "London":   { color: "text-teal-400",   dot: "bg-teal-400",   hours: "07:00–16:00 UTC" },
  "Overlap":  { color: "text-emerald-400",dot: "bg-emerald-400",hours: "13:00–16:00 UTC" },
  "New York": { color: "text-sky-400",    dot: "bg-sky-400",    hours: "13:00–21:00 UTC" },
  "Closed":   { color: "text-white/20",   dot: "bg-white/20",   hours: "Off-hours"       },
};

export function SessionBreakdown({ sessions }: Props) {
  const active = sessions.filter(s => s.trades > 0);
  return (
    <div className="rounded-xl bg-[#0d1117] border border-white/[0.065] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.05]">
        <div className="w-4 h-px bg-teal-400/50" />
        <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">Session Performance</h2>
      </div>
      <div className="p-4">
        {active.length === 0 ? (
          <p className="font-mono text-[12px] text-white/20 text-center py-6">No data</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sessions.filter(s => s.trades > 0).map(session => {
              const meta = SESSION_META[session.session];
              return (
                <div key={session.session} className="flex items-start gap-3 px-4 py-3.5 rounded-[8px] bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-colors duration-200">
                  <div className={cx("w-[6px] h-[6px] rounded-full mt-1.5 shrink-0", meta.dot)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-2">
                      <span className={cx("font-mono text-[12px] font-medium", meta.color)}>{session.session}</span>
                      <span className="font-mono text-[10px] text-white/20">{meta.hours}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/20 mb-0.5">Trades</p>
                        <p className="font-mono text-[13px] text-white/60">{session.trades}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/20 mb-0.5">Win %</p>
                        <p className={cx("font-mono text-[13px]", session.winRate >= 55 ? "text-emerald-400" : session.winRate >= 45 ? "text-white/60" : "text-red-400/70")}>{session.winRate}%</p>
                      </div>
                      <div>
                        <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/20 mb-0.5">Avg R</p>
                        <p className={cx("font-mono text-[13px]", session.avgR >= 0 ? "text-emerald-400" : "text-red-400/70")}>{session.avgR >= 0 ? "+" : ""}{session.avgR}R</p>
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