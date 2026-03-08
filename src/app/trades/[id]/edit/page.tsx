
import { notFound, redirect } from "next/navigation";
import { auth } from "#/auth";
import { tradeService } from "@/services/trade-service";
import { AppShell } from "@/components/layout/app-shell";
import { EditTradeClient } from "@/components/trades/edit-trade-client";

export default async function EditTradePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;
  const trades = await tradeService.getAll(session.user.id);
  const trade = trades.find(t => t.id === parseInt(id));
  if (!trade) notFound();

  return (
    <AppShell>
      <div className="px-10 py-9">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <a
            href="/trades"
            className="font-mono text-[11px] text-white/25 no-underline hover:text-white/45 transition-colors duration-150 tracking-[0.04em]"
          >
            Trades
          </a>
          <span className="font-mono text-[11px] text-white/15">/</span>
          <span className="font-mono text-[11px] text-white/40 tracking-[0.04em]">
            {trade.pair}
          </span>
          <span className="font-mono text-[11px] text-white/15">/</span>
          <span className="font-mono text-[11px] text-white/25 tracking-[0.04em]">Edit</span>
        </div>

        {/* Danger context banner — shows original R so user knows what they're editing */}
        <div className="max-w-[560px] mb-7 flex items-center justify-between px-4 py-[10px] rounded-[6px] bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/20">
              Original result
            </span>
            <span className={[
              "font-mono text-[13px] font-medium tracking-[-0.02em]",
              trade.rMultiple >= 0 ? "text-emerald-400" : "text-red-400",
            ].join(" ")}>
              {trade.rMultiple >= 0 ? "+" : ""}{trade.rMultiple}R
            </span>
          </div>
          <span className="font-mono text-[10px] text-white/18">
            {new Date(trade.tradedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>

        <EditTradeClient trade={trade} />
      </div>
    </AppShell>
  );
}