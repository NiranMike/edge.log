import { db }                                   from "@/lib/db";
import { Prisma }                               from "@prisma/client";
import { createCheckout, getCustomerPortalUrl, cancelSubscription } from "@/lib/lemonsqueezy";
import { subscriptionRepository }               from "@/repositories/subscription.repository";

const ACTIVE_STATUSES = new Set(["active", "on_trial"]);

// Events that always mean the user should lose Pro access,
// regardless of what the `status` field says.
// LemonSqueezy keeps status="active" on cancel-at-period-end, so we
// cannot rely on status alone for these events.
const DEACTIVATING_EVENTS = new Set([
  "subscription_cancelled",
  "subscription_expired",
  "subscription_paused",
]);

async function sendWebhookFailureAlert(details: {
  eventId:   string;
  eventName: string;
  error:     string;
}): Promise<void> {
  const adminEmail = process.env.ALERT_EMAIL;
  if (!adminEmail) return;

  await fetch("https://api.resend.com/emails", {
    method:  "POST",
    headers: {
      Authorization:  `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:    "edge@gmail.com",
      to:      adminEmail,
      subject: `[Edge.Log] Webhook processing failed — ${details.eventName}`,
      text: [
        `Event ID:   ${details.eventId}`,
        `Event name: ${details.eventName}`,
        `Error:      ${details.error}`,
        `Time:       ${new Date().toISOString()}`,
        "",
        // "Check your Vercel logs for the full stack trace.",
        `Lemonsqueezy dashboard: https://app.lemonsqueezy.com/webhooks`,
      ].join("\n"),
    }),
  }).catch(() => {
    // Alert delivery failure must never crash the webhook response
  });
}

export const billingService = {
  async getCheckoutUrl(userId: string, email: string): Promise<string> {
    return createCheckout({
      variantId:   process.env.LEMONSQUEEZY_VARIANT_ID!,
      email,
      userId,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=1`,
    });
  },

  async getPortalUrl(userId: string): Promise<string | null> {
    const user = await db.user.findUnique({
      where:  { id: userId },
      select: { lemonSqueezyCustomerId: true },
    });
    if (!user?.lemonSqueezyCustomerId) return null;
    return getCustomerPortalUrl(user.lemonSqueezyCustomerId);
  },

  async cancelSubscription(userId: string): Promise<void> {
    const subscription = await subscriptionRepository.findByUserId(userId);
    if (!subscription) throw new Error("No subscription found");
    if (DEACTIVATING_EVENTS.has(`subscription_${subscription.status}`)) {
      throw new Error("Subscription is already cancelled");
    }

    await cancelSubscription(subscription.lemonSqueezyId);

    // Optimistically mark subscription as cancelled in the DB immediately.
    // The webhook will arrive later and confirm — but without this, a page
    // refresh before the webhook fires shows status="active" and the cancel
    // button reappears, letting the user cancel again.
    // NOTE: isPro stays true — cancel-at-period-end means access continues
    // until endsAt. Only the subscription_expired webhook removes Pro access.
    await db.subscription.update({
      where: { userId },
      data:  { status: "cancelled" },
    });
  },

  async handleSubscriptionEvent(event: {
    eventId:               string;
    eventName:             string;
    userId:                string;
    lemonSqueezyId:        string;
    lemonSqueezyCustomerId:string;
    variantId:             string;
    status:                string;
    renewsAt?:             string | null;
    endsAt?:               string | null;
    trialEndsAt?:          string | null;
  }): Promise<{ skipped?: boolean }> {
    // Fast path: skip if already processed (handles the common case)
    const alreadyProcessed = await subscriptionRepository.isEventProcessed(event.eventId);
    if (alreadyProcessed) return { skipped: true };

    // LemonSqueezy keeps status="active" on cancel-at-period-end, so we
    // derive the DB status from the event name for deactivating events.
    // This ensures our DB reflects the real intent, not just the payload.
    const effectiveStatus = DEACTIVATING_EVENTS.has(event.eventName)
      ? event.eventName.replace("subscription_", "") // "cancelled" | "expired" | "paused"
      : event.status;

    // isPro is based solely on the payload status — NOT the event name.
    // "cancel renewal" keeps status="active" until the period ends, so the
    // user retains Pro access. Only "expired"/"paused" statuses remove access.
    const isPro = ACTIVE_STATUSES.has(event.status);

    try {
      // Insert FIRST — unique constraint on eventId is the idempotency gate.
      // If two webhook deliveries race, one will hit P2002 and be skipped below.
      await db.webhookEvent.create({
        data: { eventId: event.eventId, eventName: event.eventName },
      });
    } catch (err) {
      // Unique constraint violation means a concurrent delivery already
      // processed this event — not a real error, just skip silently.
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        return { skipped: true };
      }
      await sendWebhookFailureAlert({
        eventId:   event.eventId,
        eventName: event.eventName,
        error:     err instanceof Error ? err.message : String(err),
      });
      throw err;
    }

    try {
      // Neon HTTP adapter doesn't support transactions — run writes in parallel
      // (idempotency is already guaranteed by the webhookEvent insert above).
      await Promise.all([
        db.subscription.upsert({
          where:  { lemonSqueezyId: event.lemonSqueezyId },
          create: {
            userId:                 event.userId,
            lemonSqueezyId:         event.lemonSqueezyId,
            lemonSqueezyCustomerId: event.lemonSqueezyCustomerId,
            variantId:              event.variantId,
            status:                 effectiveStatus,
            renewsAt:    event.renewsAt    ? new Date(event.renewsAt)    : null,
            endsAt:      event.endsAt      ? new Date(event.endsAt)      : null,
            trialEndsAt: event.trialEndsAt ? new Date(event.trialEndsAt) : null,
          },
          update: {
            status:      effectiveStatus,
            variantId:   event.variantId,
            renewsAt:    event.renewsAt    ? new Date(event.renewsAt)    : null,
            endsAt:      event.endsAt      ? new Date(event.endsAt)      : null,
            trialEndsAt: event.trialEndsAt ? new Date(event.trialEndsAt) : null,
          },
        }),
        db.user.update({
          where: { id: event.userId },
          data:  {
            isPro,
            lemonSqueezyCustomerId: event.lemonSqueezyCustomerId,
          },
        }),
      ]);
    } catch (err) {
      await sendWebhookFailureAlert({
        eventId:   event.eventId,
        eventName: event.eventName,
        error:     err instanceof Error ? err.message : String(err),
      });
      throw err;
    }

    return {};
  },
};