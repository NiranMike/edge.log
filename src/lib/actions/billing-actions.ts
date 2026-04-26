"use server";

import { auth }           from "#/auth";
import { db }             from "@/lib/db";
import { billingService } from "@/services/billing-service";
import type { Result }    from "@/types";

export async function createCheckoutAction(): Promise<Result<{ url: string }>> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return { ok: false, error: "Not authenticated" };
  }

  try {
    const url = await billingService.getCheckoutUrl(session.user.id, session.user.email);
    return { ok: true, data: { url } };
  } catch (err) {
    console.error("[createCheckoutAction]", err);
    return { ok: false, error: "Failed to create checkout. Please try again." };
  }
}

export async function getPortalUrlAction(): Promise<Result<{ url: string }>> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Not authenticated" };

  try {
    const url = await billingService.getPortalUrl(session.user.id);
    if (!url) return { ok: false, error: "No active subscription found." };
    return { ok: true, data: { url } };
  } catch {
    return { ok: false, error: "Failed to load billing portal." };
  }
}

export async function getSubscriptionStatusAction(): Promise<Result<{
  isPro:   boolean;
  status:  string | null;
  endsAt:  string | null;
}>> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Not authenticated" };

  const user = await db.user.findUnique({
    where:  { id: session.user.id },
    select: { isPro: true, subscription: { select: { status: true, endsAt: true } } },
  });

  if (!user) return { ok: false, error: "User not found" };

  return {
    ok:   true,
    data: {
      isPro:   user.isPro,
      status:  user.subscription?.status ?? null,
      endsAt:  user.subscription?.endsAt?.toISOString() ?? null,
    },
  };
}