import { redirect }          from "next/navigation";
import { auth }              from "#/auth";
import { tradeService }      from "@/services/trade-service";
import { AppShell }          from "@/components/layout/app-shell";
import { CalendarClient }    from "@/components/calendar/calendar-client";


export default async function CalendarPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const trades  = await tradeService.getAll(session.user.id);

  return (
    <AppShell>
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-9">
        <div className="w-full max-w-[1120px] mx-auto">

          <div className="animate-fade-up mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="w-5 h-px bg-[var(--ac-2)] opacity-50" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--ac-2)] opacity-60">
                Calendar
              </span>
            </div>
            <h1 className="font-display font-black text-[22px] sm:text-[26px] tracking-[-0.04em] text-[var(--tx-1)] mb-1">
              Daily P&amp;L
            </h1>
            <p className="font-mono text-[11px] sm:text-[12px] text-[var(--tx-3)]">
              {trades.length > 0
                ? `${trades.length} trades logged`
                : "No trades logged yet."}
            </p>
          </div>

          <CalendarClient trades={trades} />
        </div>
      </div>
    </AppShell>
  );
}