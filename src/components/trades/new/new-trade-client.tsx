"use client";

import { TradeForm } from "@/components/form/trade-form";
import { createTradeAction } from "@/lib/actions/trade-action";

// app/trades/new/NewTradeClient.tsx


export function NewTradeClient() {
  return (
    <TradeForm
      title="Log a trade"
      submitLabel="Save Trade"
      onSubmit={async (values) => {
        const result = await createTradeAction(values);
        return result.ok
          ? { ok: true, data: result.data }
          : { ok: false, error: result.error };
      }}
    />
  );
}