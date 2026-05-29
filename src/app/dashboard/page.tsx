import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "#/auth";
import { db } from "@/lib/db";
import { tradeService } from "@/services/trade-service";
import { RecentTrades } from "@/components/dashboard/recent-trades";
import { MetricsGrid } from "@/components/dashboard/metrics-grid";
import { EmptyDashboard } from "@/components/dashboard/empty-dashboard";
import { AppShell } from "@/components/layout/app-shell";
import { UpgradeButton } from "@/components/billing/upgrade-button";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const params = await searchParams;
  const upgraded = params.upgraded === "1";

  const [{ metrics, recent, rHistory }, user] = await Promise.all([
    tradeService.getDashboardData(session.user.id),
    db.user.findUnique({
      where:  { id: session.user.id },
      select: { isPro: true },
    }),
  ]);

  const firstName = session.user.name?.split(" ")[0] ?? "Trader";
  const isPro = user?.isPro ?? false;

  return (
    <AppShell>
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-9">

        <div className="w-full max-w-[1120px] mx-auto">

          {upgraded && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-lg bg-teal-400/[0.08] border border-teal-400/20">
              <span className="text-teal-400 text-[13px]">✓</span>
              <p className="font-mono text-[12px] text-teal-400">
                You&apos;re now on Pro. Welcome to the full analytics suite.
              </p>
            </div>
          )}

          <div className="animate-fade-up mb-6 sm:mb-8 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-2 sm:mb-3">
                <div className="w-5 h-px bg-teal-400/50" />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-teal-400/60">
                  Overview
                </span>
              </div>
              <h1 className="font-mono font-medium text-[22px] sm:text-[26px] tracking-[-0.03em] text-white mb-1">
                {metrics.totalTrades === 0
                  ? `Welcome, ${firstName}.`
                  : `Your edge, ${firstName}.`}
              </h1>
              <p className="font-mono text-[11px] sm:text-[12px] text-white/35">
                {metrics.totalTrades === 0
                  ? "Start logging to discover your patterns."
                  : `${metrics.totalTrades} trades · expectancy ${metrics.expectancy >= 0 ? "+" : ""}${metrics.expectancy}R`}
              </p>
            </div>

            {metrics.totalTrades > 0 && (
              <Link
                href="/trades/new"
                className="shrink-0 inline-flex items-center gap-2 px-3 sm:px-4 py-[9px] bg-teal-400/[0.08] border border-teal-400/20 rounded-lg font-mono text-[11px] text-teal-400 no-underline hover:bg-teal-400/[0.14] hover:border-teal-400/35 transition-all duration-150 tracking-[0.04em] whitespace-nowrap"
              >
                + New trade
              </Link>
            )}
          </div>

          {metrics.totalTrades === 0 ? (
            <EmptyDashboard />
          ) : (
            <>
              <MetricsGrid
                metrics={metrics}
                rHistory={rHistory}
                className="animate-fade-up mb-8 sm:mb-10"
              />

              {!isPro && (
                <div className="animate-fade-up mb-8 sm:mb-10 flex items-center justify-between gap-4 px-5 py-4 rounded-xl bg-[#0d1117] border border-white/[0.065]">
                  <div className="min-w-0">
                    <p className="font-mono text-[12px] text-white/70 mb-0.5">
                      Unlock analytics
                    </p>
                    <p className="font-mono text-[11px] text-white/35">
                      See your edge. Pair stats, equity curve, session breakdown.
                    </p>
                  </div>
                  <UpgradeButton label="Upgrade to Pro" variant="ghost" className="shrink-0" />
                </div>
              )}

              <div className="animate-fade-up">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-3">
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
