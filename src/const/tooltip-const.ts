export const TOOLTIP_COPY = {
  profitFactor:
    "Gross winning R divided by gross losing R. Above 1.0 means you make more than you lose overall. Above 2.0 is considered strong.",
  bestTrade:
    "The highest R-multiple from a single trade in this period. R = how many times your initial risk you made.",
  worstTrade:
    "The largest single-trade loss expressed as R. −1R means you lost exactly your planned risk on that trade.",
  winStreak:
    "Your longest consecutive winning run. The loss streak is shown below for context.",
  avgWin:
    "Average R gained on winning trades. Compare this to avg loss to understand your reward-to-risk ratio.",
  mostActive:
    "The instrument you traded most, and the session window where most of those trades occurred.",
  pairBreakdown:
    "Performance split by instrument. Sort by any column to find your most and least profitable pairs.",
  directionBias:
    "How your longs vs shorts compare. A large gap between the two often reveals a directional blind spot.",
  rDistribution:
    "How your trade outcomes are spread across R-multiple buckets. A healthy distribution has a peak to the right of −1R.",
  sessionBreakdown:
    "Performance grouped by market session. Traders often perform very differently across London, New York, and Asian hours.",
  weekdayHeatmap:
    "Average R per day of the week. If one day is consistently red, consider reducing size or skipping it entirely.",
  equityCurve:
    "Cumulative R over time. A smooth upward curve with shallow drawdowns is the goal. Steep drops reveal emotional trading periods.",
  winRate:
    "Percentage of trades that closed in profit. Higher is not always better. It depends on your average win vs average loss.",
  avgR:
    "Average R-multiple across all trades in this group. Positive means profitable on average.",
  totalR:
    "Sum of all R-multiples. This is your real performance number, independent of position sizing.",
  trades: "Total number of trades included in this calculation.",
  maxDrawdown:
    "The deepest peak-to-trough decline in your equity curve, in R. Smaller is better.",
  expectancy:
    "(Win rate × avg win R) − (loss rate × avg loss R). A positive number means your strategy has an edge over time.",
} as const;

export type TooltipKey = keyof typeof TOOLTIP_COPY;