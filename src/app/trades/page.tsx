import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "#/auth";
import { tradeService } from "@/services/trade-service";
import { AppShell } from "@/components/layout/app-shell";
import { TradesList } from "@/components/trades/trades-list";
import { TRADES_PAGE_SIZE } from "@/const/trades-const";

export default async function TradesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?:      string;
    q?:         string;
    direction?: string;
    outcome?:   string;
  }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const params    = await searchParams;
  const page      = Math.max(1, parseInt(params.page ?? "1", 10));
  const pairQuery = params.q?.trim() || undefined;
  const direction = (params.direction === "LONG" || params.direction === "SHORT")
    ? params.direction : undefined;
  const won       = params.outcome === "win" ? true
    : params.outcome === "loss"              ? false
    : undefined;

  const { trades, total } = await tradeService.getPage(session.user.id, page, {
    pair: pairQuery, direction, won,
  });

  const pageCount = Math.ceil(total / TRADES_PAGE_SIZE);
  if (total > 0 && page > pageCount) redirect(`/trades?page=${pageCount}`);

  return (
    <AppShell>
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-9">
        <div className="w-full max-w-[1200px] mx-auto">

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

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/trades/import"
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-[9px] bg-white/[0.04] border border-white/[0.08] rounded-lg font-mono text-[11px] text-white/40 no-underline hover:bg-white/[0.07] hover:border-white/[0.14] hover:text-white/60 transition-all duration-150 tracking-[0.04em] whitespace-nowrap"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span className="hidden sm:inline">Import</span>
              </Link>
              <Link
                href="/trades/new"
                className="group relative overflow-hidden inline-flex items-center gap-1.5 px-3 sm:px-4 py-[9px] bg-emerald-400 rounded-lg text-[#07090d] font-mono text-[11px] font-medium no-underline hover:brightness-110 active:scale-[0.97] transition-all duration-150 tracking-[0.06em] uppercase whitespace-nowrap"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New trade
                <div className="absolute inset-0 bg-white/15 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12 pointer-events-none" />
              </Link>
            </div>
          </div>

          <TradesList
            trades={trades}
            total={total}
            page={page}
            pageCount={pageCount}
            filters={{ q: params.q, direction: params.direction, outcome: params.outcome }}
          />

        </div>
      </div>
    </AppShell>
  );
}
