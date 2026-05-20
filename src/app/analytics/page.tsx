import { redirect }          from "next/navigation";
import { auth }              from "#/auth";
import { db }                from "@/lib/db";
import { tradeRepository }   from "@/repositories/trade.repository";
import { tradeService }      from "@/services/trade-service";
import { AppShell }          from "@/components/layout/app-shell";
import { UpgradePrompt }     from "@/components/billing/upgrade-prompt";
import { AnalyticsFilters }  from "@/components/analytics/analytics-filters";
import { AnalyticsOverviewStrip } from "@/components/analytics/analytics-overview-strip";
import { EquityCurve }       from "@/components/analytics/equity-curve";
import { PairBreakdown }     from "@/components/analytics/pair-breakdown";
import { DirectionBias }     from "@/components/analytics/direction-bias";
import { RDistribution }     from "@/components/analytics/r-distribution";
import { SessionBreakdown }  from "@/components/analytics/session-breakdown";
import { WeekdayHeatmap }    from "@/components/analytics/weekday-heatmap";
import type { AnalyticsFilters as Filters } from "@/types";

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

function PageHeader({ tradeCount, dateRange }: { tradeCount?: number; dateRange?: string }) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center gap-3 mb-2 sm:mb-3">
        <div className="w-5 h-px bg-teal-400/50" />
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-teal-400/60">
          Analytics
        </span>
      </div>
      <h1 className="font-display font-medium text-[20px] sm:text-[24px] tracking-[-0.03em] text-white mb-1">
        Performance breakdown
      </h1>
      {tradeCount !== undefined && (
        <p className="font-mono text-[11px] sm:text-[12px] text-white/30">
          {tradeCount} trades analysed
          {dateRange && dateRange !== "all" && ` · last ${dateRange}`}
        </p>
      )}
    </div>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await db.user.findUnique({
    where:  { id: session.user.id },
    select: { isPro: true },
  });

  if (!user?.isPro) {
    return (
      <AppShell>
        <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-9">
          <div className="w-full max-w-[1200px] mx-auto">
            <PageHeader />
            <UpgradePrompt
              feature="Analytics Dashboard"
              description="Understand exactly where you make and lose money. Find your best session, worst day, and which pairs actually have edge."
            />
          </div>
        </div>
      </AppShell>
    );
  }

  const params    = await searchParams;
  const filters   = parseFilters(params);
  const [trades, allPairs] = await Promise.all([
    tradeRepository.findFiltered(session.user.id, filters),
    tradeRepository.findDistinctPairs(session.user.id),
  ]);
  const analytics = tradeService.computeAnalytics(trades, filters);

  return (
    <AppShell>
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-9">
        <div className="w-full max-w-[1200px] mx-auto">

          <PageHeader tradeCount={analytics.totalTrades} dateRange={filters.dateRange} />

          <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 py-3 mb-6 sm:mb-8 bg-[#07090d]/90 backdrop-blur-sm border-b border-white/[0.05]">
            <div className="w-full max-w-[1200px] mx-auto">
              <AnalyticsFilters filters={filters} allPairs={allPairs} />
            </div>
          </div>

          {analytics.totalTrades === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
              <p className="font-mono text-[13px] text-white/30 mb-1">No trades match your filters.</p>
              <p className="font-mono text-[11px] text-white/18">Try widening the date range or clearing pair filters.</p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <AnalyticsOverviewStrip overview={analytics.overview} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <PairBreakdown    pairs={analytics.byPair}        />
                <DirectionBias    directions={analytics.byDirection} />
                <RDistribution    buckets={analytics.rBuckets}    />
                <SessionBreakdown sessions={analytics.bySessions} />
              </div>
              <EquityCurve    curve={analytics.equityCurve} />
              <WeekdayHeatmap weekdays={analytics.byWeekday} />
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}