import type { Metadata } from "next";
import Link from "next/link";
import { cx, ds } from "@/style";
import { LandingNav } from "@/components/landing-page/landing-nav";
import { LandingFooter } from "@/components/landing-page/landing-footer";

export const metadata: Metadata = {
  title: "Terms of Service · EDGE.LOG",
  description: "Terms of Service for Edge.Log, the trading journal platform.",
};

const LAST_UPDATED = "May 27, 2026";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="font-display font-bold text-[18px] sm:text-[20px] text-white tracking-[-0.02em] mb-4 mt-12 first:mt-0">
        {title}
      </h2>
      <div className="space-y-3 font-mono text-[12px] sm:text-[13px] text-white/40 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="bg-[#07090d] text-white min-h-screen overflow-x-hidden selection:bg-emerald-400/20 selection:text-emerald-300">
      <LandingNav />

      {/* Hero */}
      <div className="relative pt-20 sm:pt-28 pb-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]" style={ds.dotGrid} />
        <div className={cx(ds.container, ds.pageX, "relative")}>
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="w-6 h-px bg-white/20" />
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/30">Legal</span>
            <div className="w-6 h-px bg-white/20" />
          </div>
          <h1
            className="font-display font-extrabold text-white leading-[1.06] tracking-tight mb-3"
            style={{ fontSize: "clamp(36px, 6vw, 64px)" }}
          >
            Terms of Service
          </h1>
          <p className="font-mono text-[12px] text-white/25">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className={cx(ds.container, ds.pageX, "pb-20 sm:pb-28")}>
        <div className="max-w-2xl">
          <div className="h-px bg-gradient-to-r from-white/[0.08] to-transparent mb-12" />

          <Section id="agreement" title="1. Agreement to Terms">
            <p>
              By accessing or using Edge.Log (&ldquo;the Service&rdquo;), operated by Edge.Log (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;),
              you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.
            </p>
            <p>
              We may update these terms from time to time. We will notify you of material changes by email or through the Service.
              Continued use after changes constitutes acceptance of the updated terms.
            </p>
          </Section>

          <Section id="description" title="2. Service Description">
            <p>
              Edge.Log is a web-based trading journal platform that allows users to log trades, track performance metrics,
              and analyze trading patterns. The Service includes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Trade logging with automatic P&L and R-multiple calculations</li>
              <li>Performance analytics and pattern recognition</li>
              <li>Calendar and equity curve views</li>
              <li>CSV import functionality</li>
              <li>Free and paid subscription tiers</li>
            </ul>
          </Section>

          <Section id="accounts" title="3. User Accounts">
            <p>
              To use the Service, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access to your account</li>
              <li>Accept responsibility for all activity that occurs under your account</li>
            </ul>
            <p>
              You must be at least 18 years old to create an account and use the Service.
            </p>
          </Section>

          <Section id="free-pro" title="4. Free and Pro Plans">
            <p>
              <strong className="text-white/60">Free Plan:</strong> Available at no cost. Includes core trade logging features,
              P&L tracking, R-multiple calculations, and basic metrics. The Free plan does not expire.
            </p>
            <p>
              <strong className="text-white/60">Pro Plan:</strong> Available for $12/month, billed monthly.
              Includes all Free features plus the full analytics dashboard, equity curve, session/pair breakdowns,
              and advanced performance insights. You can cancel at any time from your account settings.
            </p>
          </Section>

          <Section id="billing" title="5. Billing and Payments">
            <p>
              Pro subscriptions are processed through Lemon Squeezy, our payment processor. By subscribing to Pro, you agree to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Pay the applicable subscription fee on a monthly recurring basis</li>
              <li>Provide valid payment information</li>
              <li>Authorize recurring charges until you cancel</li>
            </ul>
            <p>
              <strong className="text-white/60">Cancellation:</strong> You may cancel your Pro subscription at any time.
              Upon cancellation, you retain access to Pro features until the end of your current billing period.
              No partial refunds are issued for the remaining days in a billing cycle.
            </p>
            <p>
              <strong className="text-white/60">Price Changes:</strong> We may change subscription pricing with at least 30 days&apos; notice.
              Price changes take effect at the start of your next billing cycle.
            </p>
          </Section>

          <Section id="data" title="6. Your Data">
            <p>
              You retain full ownership of all trade data, notes, and other content you submit to the Service (&ldquo;Your Data&rdquo;).
              We do not claim any ownership over Your Data.
            </p>
            <p>
              You grant us a limited license to store, process, and display Your Data solely for the purpose of providing and improving the Service.
            </p>
            <p>
              You may export or delete Your Data at any time. If you delete your account,
              we will delete Your Data within 30 days, except where retention is required by law.
            </p>
          </Section>

          <Section id="acceptable-use" title="7. Acceptable Use">
            <p>
              You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Use the Service for any illegal purpose or in violation of any laws</li>
              <li>Attempt to gain unauthorized access to the Service or its systems</li>
              <li>Interfere with or disrupt the Service or servers connected to it</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
              <li>Use automated systems (bots, scrapers) to access the Service without permission</li>
              <li>Upload malicious code or content</li>
              <li>Share your account credentials with third parties</li>
            </ul>
          </Section>

          <Section id="disclaimer" title="8. Disclaimer: Not Financial Advice">
            <p className="text-amber-400/60 border-l-2 border-amber-400/20 pl-4">
              Edge.Log is a journaling and analytics tool only. The Service does not provide financial advice,
              investment recommendations, trading signals, or any form of advisory service.
              All metrics, analytics, and insights are based solely on data you provide and are intended for
              self-reflection and educational purposes only.
            </p>
            <p>
              Trading financial instruments involves significant risk of loss. Past performance does not guarantee future results.
              You are solely responsible for your trading decisions.
              We are not liable for any trading losses incurred by users of the Service.
            </p>
          </Section>

          <Section id="warranty" title="9. Warranty Disclaimer">
            <p>
              The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind,
              either express or implied, including but not limited to warranties of merchantability,
              fitness for a particular purpose, or non-infringement.
            </p>
            <p>
              We do not warrant that the Service will be uninterrupted, error-free, or secure.
              We are not responsible for the accuracy of any calculations, metrics, or analytics generated by the Service
              based on data you provide.
            </p>
          </Section>

          <Section id="liability" title="10. Limitation of Liability">
            <p>
              To the maximum extent permitted by law, Edge.Log and its operators shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data,
              or trading losses, arising out of or related to your use of the Service.
            </p>
            <p>
              Our total liability for any claims arising from use of the Service shall not exceed the amount you paid
              us in the 12 months preceding the claim.
            </p>
          </Section>

          <Section id="termination" title="11. Termination">
            <p>
              We may suspend or terminate your account if you violate these terms or engage in conduct
              that we determine, in our sole discretion, is harmful to the Service or other users.
            </p>
            <p>
              You may delete your account at any time. Upon termination, your right to use the Service ceases immediately.
              Provisions that by their nature should survive termination (including disclaimers, limitation of liability,
              and dispute resolution) will survive.
            </p>
          </Section>

          <Section id="governing-law" title="12. Governing Law">
            <p>
              These terms are governed by and construed in accordance with applicable laws.
              Any disputes arising from these terms or the Service shall be resolved through binding arbitration
              or in the courts of competent jurisdiction.
            </p>
          </Section>

          <Section id="contact" title="13. Contact">
            <p>
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:support@edgelog.app" className="text-emerald-400/60 hover:text-emerald-400 transition-colors underline underline-offset-2">
                support@edgelog.app
              </a>
            </p>
          </Section>

          {/* Bottom nav */}
          <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="font-mono text-[11px] text-white/25 hover:text-white/50 transition-colors">
              Privacy Policy 
            </Link>
            <Link href="/" className="font-mono text-[11px] text-white/25 hover:text-white/50 transition-colors">
               Back to home
            </Link>
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
