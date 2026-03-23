import { redirect } from "next/navigation";
import { auth } from "#/auth";
import { AppShell } from "@/components/layout/app-shell";
import { NewTradeClient } from "@/components/trades/new/new-trade-client";

export default async function NewTradePage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <AppShell>
      <div className="px-10 py-9">
        <NewTradeClient />
      </div>
    </AppShell>
  );
}