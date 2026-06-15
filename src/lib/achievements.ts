import type { Trade, TradeMetrics } from "@/types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;       // SVG path or symbol
  tier: "bronze" | "silver" | "gold" | "diamond";
  unlockedAt?: string; // ISO date when first unlocked
}

export interface JournalingStreak {
  current: number;
  longest: number;
  todayLogged: boolean;
}

export type TraderRank = {
  title: string;
  level: number;
  nextTitle: string | null;
  progress: number; // 0–100 toward next rank
  totalXP: number;
};

// ─── Rank system ─────────────────────────────────────────────────────────────

const RANKS = [
  { title: "Novice",       minXP: 0     },
  { title: "Apprentice",   minXP: 100   },
  { title: "Journeyman",   minXP: 400   },
  { title: "Specialist",   minXP: 1200  },
  { title: "Expert",       minXP: 3000  },
  { title: "Master",       minXP: 6500  },
  { title: "Grandmaster",  minXP: 12000 },
  { title: "Legend",       minXP: 25000 },
] as const;

/**
 * XP formula — designed for slow, realistic progression:
 * - 3 XP per trade logged
 * - 1 XP per win (small bonus, not the main driver)
 * - 5 XP per unique journaling day (consistency is king)
 * - 15 XP per achievement unlocked
 *
 * Rough timeline (assuming ~4 trades/day, 50% WR, 5 days/week):
 *   1 week  (~20 trades, 5 days, ~3 achievements)  ≈  130 XP → Apprentice
 *   1 month (~80 trades, 20 days, ~6 achievements)  ≈  530 XP → Journeyman
 *   3 months (~250 trades, 60 days, ~10 achievements) ≈ 1,400 XP → Specialist
 *   6 months (~500 trades, 120 days, ~14 achievements) ≈ 2,910 XP → Expert edge
 *   1 year  (~1000 trades, 220 days, ~16 achievements) ≈ 5,340 XP → Master edge
 *   2+ years of disciplined journaling → Grandmaster / Legend
 */
function computeXP(
  totalTrades: number,
  wins: number,
  journalingDays: number,
  achievementCount: number,
): number {
  return totalTrades * 3 + wins * 1 + journalingDays * 5 + achievementCount * 15;
}

export function getTraderRank(
  totalTrades: number,
  wins: number,
  journalingDays: number,
  achievementCount: number,
): TraderRank {
  const totalXP = computeXP(totalTrades, wins, journalingDays, achievementCount);

  let rankIdx = 0;
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (totalXP >= RANKS[i].minXP) { rankIdx = i; break; }
  }

  const current = RANKS[rankIdx];
  const next = RANKS[rankIdx + 1] ?? null;
  const progress = next
    ? Math.min(100, Math.round(((totalXP - current.minXP) / (next.minXP - current.minXP)) * 100))
    : 100;

  return {
    title: current.title,
    level: rankIdx + 1,
    nextTitle: next?.title ?? null,
    progress,
    totalXP,
  };
}

// ─── Journaling streak ───────────────────────────────────────────────────────

export function computeStreak(trades: Trade[]): JournalingStreak {
  if (trades.length === 0) return { current: 0, longest: 0, todayLogged: false };

  // Get unique trading days (in user's local date representation via ISO slice)
  const daySet = new Set<string>();
  for (const t of trades) daySet.add(t.tradedAt.slice(0, 10));

  const days = [...daySet].sort(); // ascending
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const todayLogged = daySet.has(today);

  // Compute longest streak
  let longest = 1, run = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const curr = new Date(days[i]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) { run++; longest = Math.max(longest, run); }
    else { run = 1; }
  }
  longest = Math.max(longest, run);

  // Compute current streak (must include today or yesterday)
  let current = 0;
  const lastDay = days[days.length - 1];
  if (lastDay === today || lastDay === yesterday) {
    current = 1;
    for (let i = days.length - 2; i >= 0; i--) {
      const prev = new Date(days[i]);
      const curr = new Date(days[i + 1]);
      const diff = (curr.getTime() - prev.getTime()) / 86400000;
      if (diff === 1) current++;
      else break;
    }
  }

  return { current, longest, todayLogged };
}

// ─── Achievement definitions ─────────────────────────────────────────────────

interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: Achievement["tier"];
  check: (ctx: AchievementContext) => string | null; // returns ISO date or null
}

interface AchievementContext {
  trades: Trade[];
  metrics: TradeMetrics;
  streak: JournalingStreak;
  journalingDays: number;
}

const ACHIEVEMENT_DEFS: AchievementDef[] = [
  // ── Volume milestones ──
  {
    id: "first-trade",
    title: "First Blood",
    description: "Log your first trade",
    icon: "crosshair",
    tier: "bronze",
    check: ({ trades }) => trades.length >= 1 ? trades[trades.length - 1].tradedAt : null,
  },
  {
    id: "trades-10",
    title: "Getting Started",
    description: "Log 10 trades",
    icon: "layers",
    tier: "bronze",
    check: ({ trades }) => trades.length >= 10 ? trades[trades.length - 10].tradedAt : null,
  },
  {
    id: "trades-50",
    title: "Committed",
    description: "Log 50 trades",
    icon: "layers",
    tier: "silver",
    check: ({ trades }) => trades.length >= 50 ? trades[trades.length - 50].tradedAt : null,
  },
  {
    id: "trades-100",
    title: "Centurion",
    description: "Log 100 trades",
    icon: "shield",
    tier: "gold",
    check: ({ trades }) => trades.length >= 100 ? trades[trades.length - 100].tradedAt : null,
  },
  {
    id: "trades-500",
    title: "Veteran",
    description: "Log 500 trades",
    icon: "crown",
    tier: "diamond",
    check: ({ trades }) => trades.length >= 500 ? trades[trades.length - 500].tradedAt : null,
  },

  // ── Performance ──
  {
    id: "first-win",
    title: "Green Candle",
    description: "Win your first trade",
    icon: "trending-up",
    tier: "bronze",
    check: ({ trades }) => {
      const first = [...trades].reverse().find(t => t.won);
      return first?.tradedAt ?? null;
    },
  },
  {
    id: "big-r",
    title: "Sniper",
    description: "Land a 3R+ trade",
    icon: "target",
    tier: "silver",
    check: ({ trades }) => {
      const hit = [...trades].reverse().find(t => t.rMultiple >= 3);
      return hit?.tradedAt ?? null;
    },
  },
  {
    id: "monster-r",
    title: "Monster Trade",
    description: "Land a 5R+ trade",
    icon: "zap",
    tier: "gold",
    check: ({ trades }) => {
      const hit = [...trades].reverse().find(t => t.rMultiple >= 5);
      return hit?.tradedAt ?? null;
    },
  },
  {
    id: "positive-expectancy",
    title: "The Edge",
    description: "Achieve positive expectancy (20+ trades)",
    icon: "activity",
    tier: "silver",
    check: ({ trades, metrics }) =>
      trades.length >= 20 && metrics.expectancy > 0 ? new Date().toISOString() : null,
  },
  {
    id: "win-rate-60",
    title: "Sharp Shooter",
    description: "Maintain 60%+ win rate (30+ trades)",
    icon: "target",
    tier: "gold",
    check: ({ trades, metrics }) =>
      trades.length >= 30 && metrics.winRate >= 60 ? new Date().toISOString() : null,
  },
  {
    id: "win-streak-5",
    title: "Hot Hand",
    description: "Win 5 trades in a row",
    icon: "flame",
    tier: "silver",
    check: ({ trades }) => {
      let streak = 0;
      for (const t of trades) {
        streak = t.won ? streak + 1 : 0;
        if (streak >= 5) return t.tradedAt;
      }
      return null;
    },
  },
  {
    id: "win-streak-10",
    title: "On Fire",
    description: "Win 10 trades in a row",
    icon: "flame",
    tier: "diamond",
    check: ({ trades }) => {
      let streak = 0;
      for (const t of trades) {
        streak = t.won ? streak + 1 : 0;
        if (streak >= 10) return t.tradedAt;
      }
      return null;
    },
  },

  // ── Journaling consistency ──
  {
    id: "streak-3",
    title: "Building Habit",
    description: "3-day journaling streak",
    icon: "calendar",
    tier: "bronze",
    check: ({ streak }) => streak.longest >= 3 ? new Date().toISOString() : null,
  },
  {
    id: "streak-7",
    title: "One Week Strong",
    description: "7-day journaling streak",
    icon: "calendar",
    tier: "silver",
    check: ({ streak }) => streak.longest >= 7 ? new Date().toISOString() : null,
  },
  {
    id: "streak-30",
    title: "Iron Discipline",
    description: "30-day journaling streak",
    icon: "calendar",
    tier: "gold",
    check: ({ streak }) => streak.longest >= 30 ? new Date().toISOString() : null,
  },
  {
    id: "streak-100",
    title: "Relentless",
    description: "100-day journaling streak",
    icon: "calendar",
    tier: "diamond",
    check: ({ streak }) => streak.longest >= 100 ? new Date().toISOString() : null,
  },

  // ── Diversity ──
  {
    id: "pairs-5",
    title: "Diversified",
    description: "Trade 5 different pairs",
    icon: "grid",
    tier: "bronze",
    check: ({ trades }) => {
      const pairs = new Set(trades.map(t => t.pair));
      return pairs.size >= 5 ? new Date().toISOString() : null;
    },
  },
  {
    id: "both-directions",
    title: "Ambidextrous",
    description: "Take both LONG and SHORT trades",
    icon: "arrows",
    tier: "bronze",
    check: ({ trades }) => {
      const hasLong = trades.some(t => t.direction === "LONG");
      const hasShort = trades.some(t => t.direction === "SHORT");
      return hasLong && hasShort ? new Date().toISOString() : null;
    },
  },
];

export function computeAchievements(
  trades: Trade[],
  metrics: TradeMetrics,
): Achievement[] {
  // trades should be sorted oldest→newest for streak/sequence checks
  const sorted = [...trades].sort(
    (a, b) => new Date(a.tradedAt).getTime() - new Date(b.tradedAt).getTime(),
  );

  const streak = computeStreak(sorted);
  const daySet = new Set(sorted.map(t => t.tradedAt.slice(0, 10)));

  const ctx: AchievementContext = {
    trades: sorted,
    metrics,
    streak,
    journalingDays: daySet.size,
  };

  const unlocked: Achievement[] = [];
  for (const def of ACHIEVEMENT_DEFS) {
    const date = def.check(ctx);
    if (date) {
      unlocked.push({
        id: def.id,
        title: def.title,
        description: def.description,
        icon: def.icon,
        tier: def.tier,
        unlockedAt: date,
      });
    }
  }

  return unlocked;
}

export const TOTAL_ACHIEVEMENTS = ACHIEVEMENT_DEFS.length;
