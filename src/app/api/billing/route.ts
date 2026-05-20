import { NextRequest, NextResponse } from "next/server";
import crypto                        from "crypto";
import { db }                        from "@/lib/db";
import { billingService }            from "@/services/billing-service";

function verifySignature(rawBody: string, signature: string): boolean {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  const digest = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

const SUBSCRIPTION_EVENTS = new Set([
  "subscription_created",
  "subscription_updated",
  "subscription_cancelled",
  "subscription_resumed",
  "subscription_expired",
  "subscription_paused",
  "subscription_unpaused",
]);

interface LemonEvent {
  meta: {
    event_name:   string;
    webhook_id?:  string; // unique per webhook delivery — used for idempotency
    custom_data?: { user_id?: string };
  };
  data: {
    id:         string;
    attributes: {
      customer_id:       number;
      variant_id:        number;
      status:            string;
      renews_at?:        string | null;
      ends_at?:          string | null;
      trial_ends_at?:    string | null;
      user_email?:       string;
    };
  };
}

export async function POST(req: NextRequest) {
  const rawBody  = await req.text();
  const signature = req.headers.get("x-signature") ?? "";

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event: LemonEvent = JSON.parse(rawBody);
  const { event_name, custom_data } = event.meta;

  if (!SUBSCRIPTION_EVENTS.has(event_name)) {
    return NextResponse.json({ received: true });
  }

  const userId = custom_data?.user_id;

  if (!userId) {
    return NextResponse.json({ error: "No user_id in custom_data" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { id: lemonSqueezyId, attributes: attrs } = event.data;

  await billingService.handleSubscriptionEvent({
    eventId:                event.meta.webhook_id ?? `${lemonSqueezyId}-${event_name}`,
    eventName:              event_name,
    userId,
    lemonSqueezyId,
    lemonSqueezyCustomerId: String(attrs.customer_id),
    variantId:              String(attrs.variant_id),
    status:                 attrs.status,
    renewsAt:               attrs.renews_at,
    endsAt:                 attrs.ends_at,
    trialEndsAt:            attrs.trial_ends_at,
  });
  

  return NextResponse.json({ received: true });
}