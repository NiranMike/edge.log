"use server";
// lib/actions/trade-actions.ts
// ─── Trade Server Actions ─────────────────────────────────────────────────────
// Routes are thin. These are also thin.
// Pattern: get session → call service → revalidate → return Result.

import { revalidatePath }   from "next/cache";
import  getServerSession  from "next-auth";
import type { TradeFormValues, Result, Trade } from "@/types";
import { tradeService } from "@/services/trade-service";
import { auth } from "#/auth";

async function getUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function createTradeAction(values: TradeFormValues): Promise<Result<Trade>> {
  const userId = await getUserId();
  if (!userId) return { ok: false, error: "Not authenticated" };

  const result = await tradeService.create(userId, values);
  if (result.ok) {
    revalidatePath("/dashboard");
    revalidatePath("/trades");
  }
  return result;
}

export async function updateTradeAction(id: number, values: TradeFormValues): Promise<Result<Trade>> {
  const userId = await getUserId();
  if (!userId) return { ok: false, error: "Not authenticated" };

  const result = await tradeService.update(userId, id, values);
  if (result.ok) {
    revalidatePath("/dashboard");
    revalidatePath("/trades");
  }
  return result;
}

export async function deleteTradeAction(id: number): Promise<Result<void>> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  const result = await tradeService.delete(session.user.id, id);
  if (result.ok) {
    revalidatePath("/dashboard");
    revalidatePath("/trades");
  }
  return result;
}