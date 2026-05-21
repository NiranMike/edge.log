import { redirect } from "next/navigation";
import { auth }     from "#/auth";
import { db }       from "@/lib/db";
import { AppShell } from "@/components/layout/app-shell";
import { BillingCard } from "@/components/billing/billing-card";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await db.user.findUnique({
    where:  { id: session.user.id },
    select: {
      isPro: true,
      subscription: { select: { status: true, endsAt: true } },
    },
  });

  const isPro   = user?.isPro   ?? false;
  const status  = user?.subscription?.status  ?? null;
  const endsAt  = user?.subscription?.endsAt
    ? user.subscription.endsAt.toISOString()
    : null;

  return (
    <AppShell>
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-9">
        <div className="w-full max-w-[760px] mx-auto">

          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="w-5 h-px bg-teal-400/50" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-teal-400/60">
                Settings
              </span>
            </div>
            <h1 className="font-mono font-medium text-[22px] sm:text-[26px] tracking-[-0.03em] text-white mb-1">
              Account settings
            </h1>
          </div>

          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/30 mb-3">
              Plan &amp; Billing
            </h2>
            <BillingCard isPro={isPro} status={status} endsAt={endsAt} />
          </div>

        </div>
      </div>
    </AppShell>
  );
}
