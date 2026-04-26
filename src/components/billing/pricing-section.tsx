import { UpgradeButton } from "@/components/billing/upgrade-button";
import { ds, cx }        from "@/style";

const FREE_FEATURES = [
  "Unlimited trade logging",
  "Win rate & expectancy",
  "R-multiple tracking",
  "Basic trade history",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Full analytics dashboard",
  "Equity curve",
  "Pair & session breakdown",
  "Weekday heatmap",
  "R distribution chart",
  "Direction bias analysis",
  "Priority support",
];

function Check({ pro }: { pro?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={cx(pro ? "text-teal-400" : "text-white/30")}>
      <path d="M2.5 7l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeatureList({ features, pro }: { features: string[]; pro?: boolean }) {
  return (
    <ul className="space-y-3">
      {features.map(f => (
        <li key={f} className="flex items-center gap-3">
          <Check pro={pro} />
          <span className="font-mono text-[12px] text-white/55">{f}</span>
        </li>
      ))}
    </ul>
  );
}

export function PricingSection() {
  return (
    <section id="pricing" className={cx(ds.sectionY, ds.pageX, "relative z-10")}>
      <div className={ds.container}>

        <div className={cx(ds.sectionLabel, "mb-4")}>
          <div className={ds.sectionLabelLine} />
          <span className={ds.label}>Pricing</span>
        </div>
        <h2 className={cx(ds.heading, "text-[clamp(32px,4vw,52px)] mb-4")}>
          Simple pricing.<br />
          <span className="text-emerald-400">No surprises.</span>
        </h2>
        <p className={cx(ds.body, "max-w-md mb-14")}>
          Start free. Upgrade when you're ready for the full picture.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">

          {/* Free */}
          <div className="rounded-xl bg-[#0f1318] border border-white/[0.065] p-7 flex flex-col gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30 mb-2">Free</p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-bold text-[42px] tracking-[-0.04em] text-white">$0</span>
                <span className="font-mono text-[12px] text-white/30">forever</span>
              </div>
            </div>
            <FeatureList features={FREE_FEATURES} />
            <a
              href="/register"
              className={cx(
                ds.btnSecondary,
                "mt-auto flex items-center justify-center px-5 py-2.5 rounded-lg text-center",
              )}
            >
              Get started free
            </a>
          </div>

          {/* Pro */}
          <div className="relative rounded-xl border border-teal-400/25 p-7 flex flex-col gap-6 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0d1520 0%, #0c1a1f 100%)" }}>

            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(45,212,191,0.07), transparent)" }}
            />

            <div className="absolute top-4 right-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full bg-teal-400/10 border border-teal-400/20 text-teal-400">
                Most popular
              </span>
            </div>

            <div className="relative">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-teal-400/70 mb-2">Pro</p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display font-bold text-[42px] tracking-[-0.04em] text-white">$9</span>
                <span className="font-mono text-[12px] text-white/30">/ month</span>
              </div>
              <p className="font-mono text-[11px] text-white/25 mt-1">Billed monthly · Cancel anytime</p>
            </div>

            <div className="relative">
              <FeatureList features={PRO_FEATURES} pro />
            </div>

            <div className="relative mt-auto">
              <UpgradeButton label="Start Pro →" className="w-full justify-center" />
            </div>
          </div>
        </div>

        <p className="font-mono text-[11px] text-white/20 mt-8">
          Payments processed securely by Lemon Squeezy. Cancel anytime from your billing portal.
        </p>
      </div>
    </section>
  );
}