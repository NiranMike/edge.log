"use client";

import { cx } from "@/style";
import { useState } from "react";
import { TiltCard } from "../ui/tilt-card";
import type { Achievement, JournalingStreak, TraderRank } from "@/lib/achievements";
import { TOTAL_ACHIEVEMENTS } from "@/lib/achievements";

// ─── Tier colors ─────────────────────────────────────────────────────────────

const TIER_STYLE: Record<Achievement["tier"], { ring: string; bg: string; text: string; glow: string }> = {
  bronze:  { ring: "border-amber-700/40",   bg: "bg-amber-700/10",   text: "text-amber-600",   glow: "shadow-amber-700/20"   },
  silver:  { ring: "border-slate-400/40",   bg: "bg-slate-400/10",   text: "text-slate-300",   glow: "shadow-slate-400/20"   },
  gold:    { ring: "border-yellow-400/40",  bg: "bg-yellow-400/10",  text: "text-yellow-400",  glow: "shadow-yellow-400/20"  },
  diamond: { ring: "border-cyan-400/40",    bg: "bg-cyan-400/10",    text: "text-cyan-300",    glow: "shadow-cyan-400/25"    },
};

// ─── Achievement icons (inline SVGs) ─────────────────────────────────────────

function AchievementIcon({ icon, className }: { icon: string; className?: string }) {
  const props = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className };

  switch (icon) {
    case "crosshair":
      return <svg {...props}><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>;
    case "layers":
      return <svg {...props}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
    case "shield":
      return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case "crown":
      return <svg {...props}><path d="M2 20h20"/><path d="M4 20V9l4 3 4-7 4 7 4-3v11"/></svg>;
    case "trending-up":
      return <svg {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
    case "target":
      return <svg {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
    case "zap":
      return <svg {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
    case "activity":
      return <svg {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
    case "flame":
      return <svg {...props}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;
    case "calendar":
      return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
    case "grid":
      return <svg {...props}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
    case "arrows":
      return <svg {...props}><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="10"/></svg>;
  }
}

// ─── Streak flame ────────────────────────────────────────────────────────────

function StreakDisplay({ streak }: { streak: JournalingStreak }) {
  return (
    <TiltCard
      className={cx(
        "relative rounded-xl border overflow-hidden",
        "bg-gradient-to-b from-[#10141a] to-[#0d1117]",
        "transition-all duration-200 group",
        "px-4 py-4 sm:px-5 sm:py-5",
        streak.current >= 7
          ? "border-orange-400/20 hover:border-orange-400/35"
          : streak.current >= 3
          ? "border-amber-400/15 hover:border-amber-400/25"
          : "border-white/[0.06] hover:border-white/[0.12]",
      )}
    >
      {/* Ambient glow for active streaks */}
      {streak.current >= 3 && (
        <div className={cx(
          "absolute -top-8 -right-8 w-20 h-20 rounded-full blur-[35px] pointer-events-none transition-opacity duration-500",
          streak.current >= 7 ? "bg-orange-400/[0.12]" : "bg-amber-400/[0.08]",
          "opacity-60 group-hover:opacity-100",
        )} />
      )}

      <div className="relative flex items-center gap-3">
        {/* Flame icon */}
        <div className={cx(
          "flex items-center justify-center w-10 h-10 rounded-lg",
          streak.current >= 7
            ? "bg-orange-400/[0.1] text-orange-400"
            : streak.current >= 3
            ? "bg-amber-400/[0.08] text-amber-400/80"
            : streak.current >= 1
            ? "bg-white/[0.04] text-white/30"
            : "bg-white/[0.02] text-white/15",
        )}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
          </svg>
        </div>

        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className={cx(
              "font-mono font-medium text-[22px] leading-none tracking-[-0.04em]",
              streak.current >= 7 ? "text-orange-400" : streak.current >= 3 ? "text-amber-400" : "text-white",
            )}>
              {streak.current}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/25">
              day streak
            </span>
          </div>
          <div className="font-mono text-[10px] text-white/30 mt-1">
            {streak.todayLogged
              ? "Today logged"
              : streak.current > 0
              ? "Log today to keep it alive"
              : "Log a trade to start"}
            {streak.longest > streak.current && (
              <span className="text-white/20"> · Best: {streak.longest}d</span>
            )}
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

// ─── Rank bar ────────────────────────────────────────────────────────────────

function RankBar({ rank }: { rank: TraderRank }) {
  return (
    <TiltCard
      className={cx(
        "relative rounded-xl border border-white/[0.06] overflow-hidden",
        "bg-gradient-to-b from-[#10141a] to-[#0d1117]",
        "hover:border-white/[0.12] transition-all duration-200 group",
        "px-4 py-4 sm:px-5 sm:py-5",
      )}
    >
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
              Rank
            </span>
            <span className="font-mono text-[9px] text-emerald-400/40">
              Lv.{rank.level}
            </span>
          </div>
          <span className="font-mono text-[9px] text-white/20">
            {rank.totalXP} XP
          </span>
        </div>

        <div className="font-mono font-medium text-[15px] text-white tracking-[-0.02em] mb-1">
          {rank.title}
        </div>

        {rank.nextTitle && (
          <>
            <div className="h-[3px] w-full bg-white/[0.05] rounded-full overflow-hidden mt-3 mb-2">
              <div
                className="h-full rounded-full bg-emerald-400/40 transition-all duration-700"
                style={{ width: `${rank.progress}%` }}
              />
            </div>
            <div className="font-mono text-[9px] text-white/20">
              {rank.progress}% to {rank.nextTitle}
            </div>
          </>
        )}
      </div>
    </TiltCard>
  );
}

// ─── Achievement badge ───────────────────────────────────────────────────────

function AchievementBadge({ achievement }: { achievement: Achievement }) {
  const style = TIER_STYLE[achievement.tier];
  return (
    <div
      className={cx(
        "group/badge relative flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-200",
        style.ring, style.bg,
        "hover:scale-[1.04] hover:shadow-lg", style.glow,
      )}
      title={`${achievement.title}: ${achievement.description}`}
    >
      <div className={cx("transition-transform duration-200 group-hover/badge:scale-110", style.text)}>
        <AchievementIcon icon={achievement.icon} />
      </div>
      <span className={cx("font-mono text-[8px] uppercase tracking-[0.12em] text-center leading-tight", style.text)}>
        {achievement.title}
      </span>
    </div>
  );
}

function LockedBadge() {
  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-lg border border-white/[0.03] bg-white/[0.01] opacity-30">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/20">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
      <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/15 text-center">
        Locked
      </span>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

interface Props {
  streak: JournalingStreak;
  rank: TraderRank;
  achievements: Achievement[];
  className?: string;
}

export function AchievementsSection({ streak, rank, achievements, className }: Props) {
  const [showAll, setShowAll] = useState(false);
  const lockedCount = TOTAL_ACHIEVEMENTS - achievements.length;
  const displayed = showAll ? achievements : achievements.slice(0, 8);

  return (
    <div className={cx("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/30">
            Progress
          </h2>
          <span className="font-mono text-[9px] text-white/15">
            {achievements.length}/{TOTAL_ACHIEVEMENTS} unlocked
          </span>
        </div>
      </div>

      {/* Streak + Rank row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        <StreakDisplay streak={streak} />
        <RankBar rank={rank} />
      </div>

      {/* Achievements grid */}
      {achievements.length > 0 && (
        <TiltCard
          tiltMax={6}
          className={cx(
            "relative rounded-xl border border-white/[0.06] overflow-hidden",
            "bg-gradient-to-b from-[#10141a] to-[#0d1117]",
            "hover:border-white/[0.12] transition-all duration-200",
            "px-4 py-4 sm:px-5 sm:py-5",
          )}
        >
          <div className="relative">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25 mb-3">
              Achievements
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {displayed.map(a => (
                <AchievementBadge key={a.id} achievement={a} />
              ))}
              {/* Show a few locked placeholders */}
              {!showAll && Array.from({ length: Math.min(lockedCount, showAll ? 0 : Math.max(0, 8 - displayed.length)) }).map((_, i) => (
                <LockedBadge key={`locked-${i}`} />
              ))}
            </div>

            {(achievements.length > 8 || lockedCount > 0) && (
              <button
                onClick={() => setShowAll(v => !v)}
                className="mt-3 font-mono text-[10px] text-white/25 hover:text-white/50 transition-colors"
              >
                {showAll ? "Show less" : `Show all (${lockedCount} locked)`}
              </button>
            )}
          </div>
        </TiltCard>
      )}
    </div>
  );
}
