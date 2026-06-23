import { redirect }         from "next/navigation";
import type { Metadata }    from "next";
import { auth }             from "#/auth";
import { db }               from "@/lib/db";
import { AppShell }         from "@/components/layout/app-shell";
// BILLING: import { BillingCard } from "@/components/billing/billing-card";
import { ProfileCard }      from "@/components/settings/profile-card";
import { SecurityCard }     from "@/components/settings/security-card";
import { DangerZoneCard }   from "@/components/settings/danger-zone-card";

export const metadata: Metadata = {
  title: "Settings · EdgeLog",
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await db.user.findUnique({
    where:  { id: session.user.id },
    select: {
      name:         true,
      email:        true,
      image:        true,
      createdAt:    true,
      passwordHash: true,
      accounts:     { select: { provider: true } },
      // BILLING: isPro: true,
      // BILLING: subscription: { select: { status: true, endsAt: true } },
    },
  });

  if (!user) redirect("/login");

  // BILLING: const isPro   = user.isPro;
  // BILLING: const status  = user.subscription?.status ?? null;
  // BILLING: const endsAt  = user.subscription?.endsAt?.toISOString() ?? null;
  const providers   = user.accounts.map(a => a.provider);
  const hasPassword = !!user.passwordHash;

  return (
    <AppShell>
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-9">
        <div className="w-full max-w-[680px] mx-auto space-y-8">

          {/* Page header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-5 h-px bg-teal-400/50" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-teal-400/60">
                Settings
              </span>
            </div>
            <h1 className="font-mono font-medium text-[22px] sm:text-[26px] tracking-[-0.03em] text-white">
              Account settings
            </h1>
          </div>

          {/* Profile */}
          <section>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/30 mb-3">
              Profile
            </h2>
            <ProfileCard
              name={user.name}
              email={user.email!}
              image={user.image}
              joinedAt={user.createdAt.toISOString()}
            />
          </section>

          {/* Security */}
          <section>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/30 mb-3">
              Security
            </h2>
            <SecurityCard hasPassword={hasPassword} providers={providers} />
          </section>

          {/* BILLING: re-enable Plan & Billing section
          <section>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/30 mb-3">
              Plan &amp; Billing
            </h2>
            <BillingCard isPro={isPro} status={status} endsAt={endsAt} />
          </section>
          */}

          {/* Danger zone */}
          {/* <section>
            <DangerZoneCard />
          </section> */}

        </div>
      </div>
    </AppShell>
  );
}
