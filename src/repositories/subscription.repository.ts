import { db } from "@/lib/db";

export interface UpsertSubscriptionInput {
  userId:                string;
  lemonSqueezyId:        string;
  lemonSqueezyCustomerId:string;
  variantId:             string;
  status:                string;
  renewsAt?:             Date | null;
  endsAt?:               Date | null;
  trialEndsAt?:          Date | null;
}

export const subscriptionRepository = {
  async upsert(input: UpsertSubscriptionInput) {
    return db.subscription.upsert({
      where:  { lemonSqueezyId: input.lemonSqueezyId },
      create: input,
      update: {
        status:      input.status,
        variantId:   input.variantId,
        renewsAt:    input.renewsAt,
        endsAt:      input.endsAt,
        trialEndsAt: input.trialEndsAt,
      },
    });
  },

  async findByUserId(userId: string) {
    return db.subscription.findUnique({ where: { userId } });
  },

  async findByLemonSqueezyId(lemonSqueezyId: string) {
    return db.subscription.findUnique({ where: { lemonSqueezyId } });
  },

  async isEventProcessed(eventId: string): Promise<boolean> {
    const existing = await db.webhookEvent.findUnique({ where: { eventId } });
    return !!existing;
  },

  async markEventProcessed(eventId: string, eventName: string): Promise<void> {
    await db.webhookEvent.create({ data: { eventId, eventName } });
  },
};