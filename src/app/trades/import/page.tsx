import { redirect } from "next/navigation";
import { auth }     from "#/auth";
import { AppShell } from "@/components/layout/app-shell";
import { ImportClient } from "@/components/trades/import-client";

export default async function ImportPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <AppShell>
      <div className="min-h-full px-4 py-6 sm:px-6 sm:py-10 lg:py-14 flex flex-col items-center">
        <div className="w-full max-w-[760px]">

          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <nav className="flex items-center gap-1.5 mb-6">
              <a href="/trades" className="font-mono text-[11px] text-[var(--tx-3)] no-underline hover:text-[var(--tx-1)] transition-colors duration-150 tracking-[0.04em]">
                Trades
              </a>
              <span className="font-mono text-[11px] text-[var(--tx-4)]">/</span>
              <span className="font-mono text-[11px] text-[var(--tx-2)] tracking-[0.04em]">Import</span>
            </nav>
            <div className="flex items-start gap-3">
              <div className="w-[3px] h-10 mt-1 rounded-full shrink-0 bg-gradient-to-b from-[var(--ac-2)] to-transparent" />
              <div>
                <h1 className="font-display font-black text-[20px] sm:text-[24px] tracking-[-0.04em] text-[var(--tx-1)] mb-[5px] leading-[1.15]">
                  Import trades
                </h1>
                <p className="font-mono text-[11px] sm:text-[12px] text-[var(--tx-3)] leading-[1.6]">
                  Upload a CSV from your broker, Excel, or another journal. We'll handle the rest.
                </p>
              </div>
            </div>
          </div>

          <ImportClient />
        </div>
      </div>
    </AppShell>
  );
}