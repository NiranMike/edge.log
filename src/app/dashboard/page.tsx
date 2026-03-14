import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "#/auth";
import { tradeService } from "@/services/trade-service";
import { RecentTrades } from "@/components/dashboard/recent-trades";
import { MetricsGrid } from "@/components/dashboard/metrics-grid";
import { EmptyDashboard } from "@/components/dashboard/empty-dashboard";
import { AppShell } from "@/components/layout/app-shell";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const trades   = await tradeService.getAll(session.user.id);
  const metrics  = tradeService.computeMetrics(trades);
  const recent   = trades.slice(0, 8);
  const rHistory = trades.map(t => t.rMultiple);
  const firstName = session.user.name?.split(" ")[0] ?? "Trader";

  return (
    <AppShell>
      {/* Outer: full width, handles padding */}
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-9">

        {/* Inner: constrained + centered */}
        <div className="w-full max-w-[1120px] mx-auto">

          {/* Page header */}
          <div className="animate-fade-up mb-6 sm:mb-8 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-2 sm:mb-3">
                <div className="w-5 h-px bg-teal-400/50" />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-teal-400/60">
                  Overview
                </span>
              </div>
              <h1 className="font-mono font-medium text-[22px] sm:text-[26px] tracking-[-0.03em] text-white mb-1">
                {trades.length === 0
                  ? `Welcome, ${firstName}.`
                  : `Your edge, ${firstName}.`}
              </h1>
              <p className="font-mono text-[11px] sm:text-[12px] text-white/35">
                {trades.length === 0
                  ? "Start logging to discover your patterns."
                  : `${metrics.totalTrades} trades · expectancy ${metrics.expectancy >= 0 ? "+" : ""}${metrics.expectancy}R`}
              </p>
            </div>

            {trades.length > 0 && (
              <Link
                href="/trades/new"
                className="shrink-0 inline-flex items-center gap-2 px-3 sm:px-4 py-[9px] bg-teal-400/[0.08] border border-teal-400/20 rounded-lg font-mono text-[11px] text-teal-400 no-underline hover:bg-teal-400/[0.14] hover:border-teal-400/35 transition-all duration-150 tracking-[0.04em] whitespace-nowrap"
              >
                + New trade
              </Link>
            )}
          </div>

          {trades.length === 0 ? (
            <EmptyDashboard />
          ) : (
            <>
              <MetricsGrid
                metrics={metrics}
                rHistory={rHistory}
                className="animate-fade-up mb-8 sm:mb-10"
              />

              <div className="animate-fade-up">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-px bg-white/15" />
                    <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/30">
                      Recent trades
                    </h2>
                  </div>
                  <Link
                    href="/trades"
                    className="font-mono text-[11px] text-teal-400/60 no-underline hover:text-teal-400 transition-colors duration-150 tracking-[0.04em]"
                  >
                    View all →
                  </Link>
                </div>
                <RecentTrades trades={recent} />
              </div>
            </>
          )}

        </div>
      </div>
    </AppShell>
  );
}