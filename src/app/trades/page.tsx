import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "#/auth";
import { tradeService } from "@/services/trade-service";
import { AppShell } from "@/components/layout/app-shell";
import { TradesList } from "@/components/trades/trades-list";

const PAGE_SIZE = 10;

export default async function TradesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));

  const { trades, total } = await tradeService.getPage(session.user.id, page);

  const pageCount = Math.ceil(total / PAGE_SIZE);
  if (total > 0 && page > pageCount) redirect(`/trades?page=${pageCount}`);

  return (
    <AppShell>
      {/* Outer: full width, handles padding */}
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-9">

        {/* Inner: constrained + centered */}
        <div className="w-full max-w-[1120px] mx-auto">

          {/* Header */}
          <div className="animate-fade-up flex items-end justify-between mb-6 sm:mb-7 gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-2 sm:mb-3">
                <div className="w-5 h-px bg-white/15" />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
                  Journal
                </span>
              </div>
              <h1 className="font-mono font-medium text-[20px] sm:text-[24px] tracking-[-0.03em] text-white mb-1">
                All trades
              </h1>
              <p className="font-mono text-[11px] sm:text-[12px] text-white/30">
                {total} {total === 1 ? "trade" : "trades"} logged
              </p>
            </div>

            <Link
              href="/trades/new"
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-[9px] bg-teal-400/[0.08] border border-teal-400/20 rounded-lg text-teal-400 font-mono text-[11px] no-underline hover:bg-teal-400/[0.14] hover:border-teal-400/35 transition-all duration-150 tracking-[0.04em] whitespace-nowrap"
            >
              + New trade
            </Link>
          </div>

          <TradesList trades={trades} total={total} page={page} pageCount={pageCount} />

        </div>
      </div>
    </AppShell>
  );
}