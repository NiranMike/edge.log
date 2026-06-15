"use server";
// Pattern: get session → call service → revalidate → return Result.

import { revalidatePath }   from "next/cache";
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

export async function updateTradeAction(id: string, values: TradeFormValues): Promise<Result<Trade>> {
  const userId = await getUserId();
  if (!userId) return { ok: false, error: "Not authenticated" };

  const result = await tradeService.update(userId, id, values);
  if (result.ok) {
    revalidatePath("/dashboard");
    revalidatePath("/trades");
  }
  return result;
}

export async function deleteTradeAction(id: string): Promise<Result<void>> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };

  const result = await tradeService.delete(session.user.id, id);
  if (result.ok) {
    revalidatePath("/dashboard");
    revalidatePath("/trades");
  }
  return result;
}