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

  const trades  = await tradeService.getAll(session.user.id);
  const metrics = tradeService.computeMetrics(trades);
  const recent  = trades.slice(0, 8);

  // Pass R history for equity curve + streak detection
  const rHistory = trades.map(t => t.rMultiple);

  const firstName = session.user.name?.split(" ")[0] ?? "Trader";

  return (
    <AppShell>
      <div className="px-10 py-9 max-w-[1120px]">

        {/* Page header */}
        <div className="animate-fade-up mb-8 flex items-end justify-between">
          <div>
            {/* Section label */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-px bg-amber-400/50" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-amber-400/60">
                Overview
              </span>
            </div>
            <h1 className="font-mono font-medium text-[26px] tracking-[-0.03em] text-white mb-1">
              {trades.length === 0
                ? `Welcome, ${firstName}.`
                : `Your edge, ${firstName}.`}
            </h1>
            <p className="font-mono text-[12px] text-white/35">
              {trades.length === 0
                ? "Start logging to discover your patterns."
                : `${metrics.totalTrades} trades · expectancy ${metrics.expectancy >= 0 ? "+" : ""}${metrics.expectancy}R`}
            </p>
          </div>

          {trades.length > 0 && (
            <Link
              href="/trades/new"
              className="inline-flex items-center gap-2 px-4 py-[9px] bg-amber-400/[0.08] border border-amber-400/20 rounded-lg font-mono text-[11px] text-amber-400 no-underline hover:bg-amber-400/[0.14] hover:border-amber-400/35 transition-all duration-150 tracking-[0.04em] whitespace-nowrap"
            >
              + New trade
            </Link>
          )}
        </div>

        {trades.length === 0 ? (
          <EmptyDashboard />
        ) : (
          <>
            {/* Metrics */}
            <MetricsGrid
              metrics={metrics}
              rHistory={rHistory}
              className="animate-fade-up mb-10"
            />

            {/* Recent trades section */}
            <div className="animate-fade-up">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-px bg-white/15" />
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/30">
                    Recent trades
                  </h2>
                </div>
                <Link
                  href="/trades"
                  className="font-mono text-[11px] text-amber-400/60 no-underline hover:text-amber-400 transition-colors duration-150 tracking-[0.04em]"
                >
                  View all →
                </Link>
              </div>
              <RecentTrades trades={recent} />
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}