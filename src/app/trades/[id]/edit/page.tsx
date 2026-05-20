import { notFound, redirect } from "next/navigation";
import { auth } from "#/auth";
import { tradeService } from "@/services/trade-service";
import { AppShell } from "@/components/layout/app-shell";
import { EditTradeClient } from "@/components/trades/edit-trade-client";
import { DeleteTradeButton } from "@/components/ui/delete-trade-button";

export default async function EditTradePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;
  const trade = await tradeService.getById(session.user.id, parseInt(id));
  if (!trade) notFound();

  const rPositive = trade.rMultiple >= 0;

  return (
    <AppShell>
      <div className="min-h-full px-4 py-6 sm:px-6 sm:py-10 lg:py-14 flex flex-col items-center">

        <div className="w-full max-w-[640px]">
          <nav className="flex items-center gap-1.5 mb-8 sm:mb-10">
            <a
              href="/trades"
              className="font-mono text-[11px] text-white/25 no-underline hover:text-white/50 transition-colors duration-150 tracking-[0.04em]"
            >
              Trades
            </a>
            <span className="font-mono text-[11px] text-white/15">/</span>
            <span className="font-mono text-[11px] text-white/50 tracking-[0.04em]">
              {trade.pair}
            </span>
            <span className="font-mono text-[11px] text-white/15">/</span>
            <span className="font-mono text-[11px] text-white/25 tracking-[0.04em]">Edit</span>
          </nav>

          <div className="w-full mb-7 sm:mb-9 rounded-[6px] bg-white/[0.02] border border-white/[0.06] px-4 py-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/20">
                  Original result
                </span>
                <span className={[
                  "font-mono text-[14px] font-medium tracking-[-0.02em]",
                  rPositive ? "text-emerald-400" : "text-red-400",
                ].join(" ")}>
                  {rPositive ? "+" : ""}{trade.rMultiple}R
                </span>
              </div>
              <span className="font-mono text-[10px] text-white/25">
                <span className="sm:hidden">
                  {new Date(trade.tradedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
                <span className="hidden sm:inline">
                  {new Date(trade.tradedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </span>
            </div>
          </div>

          <EditTradeClient trade={trade} />

          <div className="w-full mt-10 sm:mt-12 pt-7 sm:pt-8 border-t border-white/[0.05]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-[11px] text-white/30 mb-[3px] tracking-[0.04em]">
                  Delete trade
                </p>
                <p className="font-mono text-[10px] text-white/18">
                  This cannot be undone.
                </p>
              </div>
              <div className="w-full sm:w-auto">
                <DeleteTradeButton tradeId={trade.id} pair={trade.pair} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  );
}