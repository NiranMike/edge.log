import { db }                                   from "@/lib/db";
import { createCheckout, getCustomerPortalUrl } from "@/lib/lemonsqueezy";
import { subscriptionRepository }               from "@/repositories/subscription.repository";

const ACTIVE_STATUSES = new Set(["active", "on_trial"]);

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
      from:    "alerts@yourdomain.com",
      to:      adminEmail,
      subject: `[Edge.Log] Webhook processing failed — ${details.eventName}`,
      text: [
        `Event ID:   ${details.eventId}`,
        `Event name: ${details.eventName}`,
        `Error:      ${details.error}`,
        `Time:       ${new Date().toISOString()}`,
        "",
        "Check your Vercel logs for the full stack trace.",
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
    const alreadyProcessed = await subscriptionRepository.isEventProcessed(event.eventId);
    if (alreadyProcessed) return { skipped: true };

    const isPro = ACTIVE_STATUSES.has(event.status);

    try {
      await db.$transaction(async (tx) => {
        await tx.webhookEvent.create({
          data: { eventId: event.eventId, eventName: event.eventName },
        });

        await tx.subscription.upsert({
          where:  { lemonSqueezyId: event.lemonSqueezyId },
          create: {
            userId:                 event.userId,
            lemonSqueezyId:         event.lemonSqueezyId,
            lemonSqueezyCustomerId: event.lemonSqueezyCustomerId,
            variantId:              event.variantId,
            status:                 event.status,
            renewsAt:    event.renewsAt    ? new Date(event.renewsAt)    : null,
            endsAt:      event.endsAt      ? new Date(event.endsAt)      : null,
            trialEndsAt: event.trialEndsAt ? new Date(event.trialEndsAt) : null,
          },
          update: {
            status:      event.status,
            variantId:   event.variantId,
            renewsAt:    event.renewsAt    ? new Date(event.renewsAt)    : null,
            endsAt:      event.endsAt      ? new Date(event.endsAt)      : null,
            trialEndsAt: event.trialEndsAt ? new Date(event.trialEndsAt) : null,
          },
        });

        await tx.user.update({
          where: { id: event.userId },
          data:  {
            isPro,
            lemonSqueezyCustomerId: event.lemonSqueezyCustomerId,
          },
        });
      });
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