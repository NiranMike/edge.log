"use server";

import { auth }           from "#/auth";
import { db }             from "@/lib/db";
import { billingService } from "@/services/billing-service";
import type { Result }    from "@/types";
import { redirect } from "next/navigation";

export async function createCheckoutAction(): Promise<Result<{ url: string }>> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    redirect("/login");
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

export async function cancelSubscriptionAction(): Promise<Result<{ message: string }>> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Not authenticated" };

  try {
    await billingService.cancelSubscription(session.user.id);
    return { ok: true, data: { message: "Subscription renewal cancelled. You'll keep access until the end of your billing period." } };
  } catch (err) {
    console.error("[cancelSubscriptionAction]", err);
    return { ok: false, error: err instanceof Error ? err.message : "Failed to cancel subscription." };
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