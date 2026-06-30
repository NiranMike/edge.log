"use server";

import { revalidatePath }              from "next/cache";
import { auth }                        from "#/auth";
import { tradeService }                from "@/services/trade-service";
import type { ImportTradeRow }         from "@/services/trade-service";
import type { Result }                 from "@/types";

// NOTE: a "use server" module may only export async functions — do not
// re-export types/values from here, or Turbopack's action transform will
// emit a runtime reference that throws on module load. Import ImportTradeRow
// from "@/services/trade-service" directly where it's needed.

export async function importTradesAction(
  rows: ImportTradeRow[],
): Promise<Result<{ imported: number; duplicates: number }>> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Not authenticated" };

  if (!Array.isArray(rows) || rows.length === 0) {
    return { ok: false, error: "No rows to import." };
  }

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
