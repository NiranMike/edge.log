// app/analytics/page.tsx

import { redirect }        from "next/navigation";
import { auth }            from "#/auth";
import { tradeRepository } from "@/repositories/trade.repository";
import { tradeService }    from "@/services/trade-service";
import { AppShell }        from "@/components/layout/app-shell";
import { AnalyticsFilters } from "@/components/analytics/analytics-filters";

import type { AnalyticsFilters as Filters } from "@/types";
import { AnalyticsOverviewStrip } from "@/components/analytics/analytics-overview-strip";
import { EquityCurve } from "@/components/analytics/equity-curve";
import { PairBreakdown } from "@/components/analytics/pair-breakdown";
import { DirectionBias } from "@/components/analytics/direction-bias";
import { RDistribution } from "@/components/analytics/r-distribution";
import { SessionBreakdown } from "@/components/analytics/session-breakdown";
import { WeekdayHeatmap } from "@/components/analytics/weekday-heatmap";


// ─── Parse + validate searchParams into typed filters ─────────────────────────

function parseFilters(params: Record<string, string | string[] | undefined>): Filters {
  const dateRange = (["30d","90d","6mo","1yr","all"] as const)
    .find(v => v === params.dateRange) ?? "90d";

  const direction = (["ALL","LONG","SHORT"] as const)
    .find(v => v === params.direction) ?? "ALL";

  const pairs = typeof params.pairs === "string" && params.pairs.length > 0
    ? params.pairs.split(",")
    : [];

  return { dateRange, direction, pairs };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const params  = await searchParams;
  const filters = parseFilters(params);

  const trades    = await tradeRepository.findFiltered(session.user.id, filters);
  const analytics = tradeService.computeAnalytics(trades, filters);
  const allTrades = await tradeRepository.findAllByUser(session.user.id);
  const allPairs  = [...new Set(allTrades.map(t => t.pair))].sort();

  return (
    <AppShell>
      {/* Outer: full width, handles all horizontal padding */}
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-9">

        {/* Inner: constrained + centered */}
        <div className="w-full max-w-[1200px] mx-auto">

          {/* ── Header ── */}
          <div className="animate-fade-up mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="w-5 h-px bg-teal-400/50" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-teal-400/60">
                Analytics
              </span>
            </div>
            <h1 className="font-display font-medium text-[20px] sm:text-[24px] tracking-[-0.03em] text-white mb-1">
              Performance breakdown
            </h1>
            <p className="font-mono text-[11px] sm:text-[12px] text-white/30">
              {analytics.totalTrades} trades analysed
              {filters.dateRange !== "all" && ` · last ${filters.dateRange}`}
            </p>
          </div>

          {/* ── Sticky filter bar ──
              Bleeds to the viewport edges by negating the outer padding,
              then re-applies it so the filter content aligns with the page. */}
          <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 py-3 mb-6 sm:mb-8 bg-[#07090d]/90 backdrop-blur-sm border-b border-white/[0.05]">
            {/* Re-constrain inner content to match the page column */}
            <div className="w-full max-w-[1200px] mx-auto">
              <AnalyticsFilters filters={filters} allPairs={allPairs} />
            </div>
          </div>

          {/* ── Empty state ── */}
          {analytics.totalTrades === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
              <p className="font-mono text-[13px] text-white/30 mb-1">
                No trades match your filters.
              </p>
              <p className="font-mono text-[11px] text-white/18">
                Try widening the date range or clearing pair filters.
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">

              {/* Overview strip */}
              <AnalyticsOverviewStrip overview={analytics.overview} />

              {/* Main grid — 1 col mobile, 2 col desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <PairBreakdown    pairs={analytics.byPair} />
                <DirectionBias    directions={analytics.byDirection} />
                <RDistribution    buckets={analytics.rBuckets} />
                <SessionBreakdown sessions={analytics.bySessions} />
              </div>

              {/* Full-width sections */}
              <EquityCurve    curve={analytics.equityCurve} />
              <WeekdayHeatmap weekdays={analytics.byWeekday} />

            </div>
          )}

        </div>
      </div>
    </AppShell>
  );
}