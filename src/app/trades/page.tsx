
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "#/auth";
import { tradeService } from "@/services/trade-service";
import { AppShell } from "@/components/layout/app-shell";
import { TradesList } from "@/components/trades/trades-list";

export default async function TradesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10));
  const { trades, total } = await tradeService.getPage(session.user.id, page);
  const totalPages = Math.ceil(total / 25);

  return (
    <AppShell>
      <div className="px-10 py-9 max-w-[1120px]">

        {/* Header */}
        <div className="animate-fade-up flex items-end justify-between mb-7">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-px bg-white/15" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
                Journal
              </span>
            </div>
            <h1 className="font-mono font-medium text-[24px] tracking-[-0.03em] text-white mb-1">
              All trades
            </h1>
            <p className="font-mono text-[12px] text-white/30">
              {total} {total === 1 ? "trade" : "trades"} logged
            </p>
          </div>

          <Link
            href="/trades/new"
            className="inline-flex items-center gap-1.5 px-4 py-[9px] bg-amber-400/[0.08] border border-amber-400/20 rounded-lg text-amber-400 font-mono text-[11px] no-underline hover:bg-amber-400/[0.14] hover:border-amber-400/35 transition-all duration-150 tracking-[0.04em] whitespace-nowrap"
          >
            + New trade
          </Link>
        </div>

        <TradesList trades={trades} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            {page > 1 && (
              <Link
                href={`/trades?page=${page - 1}`}
                className="px-4 py-[8px] border border-white/[0.065] rounded-lg font-mono text-[11px] text-white/40 no-underline hover:border-white/10 hover:text-white/60 transition-all duration-150 tracking-[0.04em]"
              >
                ← Prev
              </Link>
            )}
            <span className="font-mono text-[11px] text-white/20 tracking-[0.06em]">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/trades?page=${page + 1}`}
                className="px-4 py-[8px] border border-white/[0.065] rounded-lg font-mono text-[11px] text-white/40 no-underline hover:border-white/10 hover:text-white/60 transition-all duration-150 tracking-[0.04em]"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}