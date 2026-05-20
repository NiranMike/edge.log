"use server";

import { revalidatePath }              from "next/cache";
import { auth }                        from "#/auth";
import { tradeService, type ImportTradeRow } from "@/services/trade-service";
import type { Result }                 from "@/types";

export type { ImportTradeRow };

export async function importTradesAction(
  rows: ImportTradeRow[],
): Promise<Result<{ imported: number; duplicates: number }>> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Not authenticated" };

  try {
    const result = await tradeService.importTrades(session.user.id, rows);

    if (result.ok) {
      revalidatePath("/dashboard");
      revalidatePath("/trades");
      revalidatePath("/analytics");
    }

    return result;
  } catch (err) {
    console.error("[importTradesAction]", err);
    return { ok: false, error: "Import failed. Please try again." };
  }
}
