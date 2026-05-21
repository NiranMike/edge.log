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
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));

  const { trades, total } = await tradeService.getPage(session.user.id, page);

  const pageCount = Math.ceil(total / TRADES_PAGE_SIZE);
  if (total > 0 && page > pageCount) redirect(`/trades?page=${pageCount}`);

  return (
    <AppShell>
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-9">
        <div className="w-full max-w-[1120px] mx-auto">

          {/* Header */}
          <div className="animate-fade-up flex items-end justify-between mb-6 sm:mb-7 gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-2 sm:mb-3">
                <div className="w-5 h-px bg-[var(--bd-hi)]" />
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--tx-3)]">
                  Journal
                </span>
              </div>
              <h1 className="font-display font-black text-[20px] sm:text-[24px] tracking-[-0.04em] text-[var(--tx-1)] mb-1">
                All trades
              </h1>
              <p className="font-mono text-[11px] sm:text-[12px] text-[var(--tx-3)]">
                {total} {total === 1 ? "trade" : "trades"} logged
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/trades/import"
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-[9px] bg-[var(--bg-overlay)] border border-[var(--bd)] rounded-lg font-mono text-[11px] text-[var(--tx-3)] no-underline hover:border-[var(--bd-hi)] hover:text-[var(--tx-2)] transition-all duration-150 tracking-[0.04em] whitespace-nowrap"
              >
                <span className="text-[13px] leading-none">↑</span>
                <span className="hidden sm:inline">Import</span>
              </Link>
              <Link
                href="/trades/new"
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-[9px] rounded-lg font-mono text-[11px] no-underline transition-all duration-150 tracking-[0.04em] whitespace-nowrap"
                style={{ background: "var(--ac-2-dim)", border: "1px solid var(--ac-2-ring)", color: "var(--ac-2)" }}
              >
                + New trade
              </Link>
            </div>
          </div>

          <TradesList trades={trades} total={total} page={page} pageCount={pageCount} />

        </div>
      </div>
    </AppShell>
  );
}