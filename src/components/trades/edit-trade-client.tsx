"use client";
// components/trades/edit/EditTradeClient.tsx

import { TradeForm } from "@/components/form/trade-form";
import { updateTradeAction } from "@/lib/actions/trade-action";
import type { Trade } from "@/types";

interface Props {
  trade: Trade;
}

export function EditTradeClient({ trade }: Props) {
  return (
    <TradeForm
      title="Edit trade"
      submitLabel="Update Trade"
      initialValues={{
        pair:       trade.pair,
        direction:  trade.direction,
        entryPrice: String(trade.entryPrice),
        stopLoss:   String(trade.stopLoss),
        takeProfit: String(trade.takeProfit),
        exitPrice:  String(trade.exitPrice),
        notes:      trade.notes ?? "",
        tradedAt:   new Date(trade.tradedAt).toISOString().slice(0, 16),
      }}
      onSubmit={async (values) => {
        const result = await updateTradeAction(trade.id, values);
        return result.ok
          ? { ok: true, data: result.data }
          : { ok: false, error: result.error };
      }}
    />
  );
}

