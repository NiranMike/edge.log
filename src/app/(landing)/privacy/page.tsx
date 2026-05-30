import type { Metadata } from "next";
import Link from "next/link";
import { cx, ds } from "@/style";
import { LandingNav } from "@/components/landing-page/landing-nav";
import { LandingFooter } from "@/components/landing-page/landing-footer";

export const metadata: Metadata = {
  title: "Privacy Policy — EDGE.LOG",
  description: "Privacy Policy for Edge.Log. Learn how we collect, use, and protect your data.",
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

function DataTable({ rows }: { rows: { data: string; purpose: string; retention: string }[] }) {
  return (
    <div className="border border-white/[0.06] rounded-lg overflow-hidden my-4">
      <div className="grid grid-cols-3 gap-px bg-white/[0.04]">
        <div className="bg-[#0a0f12] px-4 py-2.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">Data</span>
        </div>
        <div className="bg-[#0a0f12] px-4 py-2.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">Purpose</span>
        </div>
        <div className="bg-[#0a0f12] px-4 py-2.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">Retention</span>
        </div>
      </div>
      {rows.map(({ data, purpose, retention }) => (
        <div key={data} className="grid grid-cols-3 gap-px border-t border-white/[0.04]">
          <div className="px-4 py-3">
            <span className="font-mono text-[11px] text-white/50">{data}</span>
          </div>
          <div className="px-4 py-3">
            <span className="font-mono text-[11px] text-white/35">{purpose}</span>
          </div>
          <div className="px-4 py-3">
            <span className="font-mono text-[11px] text-white/35">{retention}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PrivacyPage() {
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
            Privacy Policy
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

          {/* TLDR */}
          <div className="px-5 py-4 rounded-xl bg-emerald-400/[0.04] border border-emerald-400/10 mb-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400/60 mb-2">TL;DR</p>
            <ul className="space-y-1.5 font-mono text-[12px] text-white/45 leading-relaxed">
              <li>We only collect what&apos;s necessary to run the Service.</li>
              <li>Your trade data is yours. We never sell it or share it with third parties.</li>
              <li>We don&apos;t use your data for advertising or profiling.</li>
              <li>You can export or delete your data at any time.</li>
            </ul>
          </div>

          <Section id="overview" title="1. Overview">
            <p>
              This Privacy Policy explains how Edge.Log (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;)
              collects, uses, stores, and protects your information when you use our web-based trading journal platform
              (&ldquo;the Service&rdquo;).
            </p>
            <p>
              By using the Service, you consent to the practices described in this policy.
            </p>
          </Section>

          <Section id="what-we-collect" title="2. Information We Collect">
            <p className="text-white/50 font-medium">2.1 Information you provide</p>
            <DataTable rows={[
              { data: "Email address",      purpose: "Account creation, login, notifications", retention: "Until account deletion" },
              { data: "Name (optional)",    purpose: "Display in your profile",                retention: "Until account deletion" },
              { data: "Trade data",         purpose: "Core Service functionality",              retention: "Until you delete it"    },
              { data: "Notes & tags",       purpose: "Trade journaling features",               retention: "Until you delete it"    },
              { data: "Payment info",       purpose: "Subscription billing",                    retention: "Managed by Lemon Squeezy" },
            ]} />

            <p className="text-white/50 font-medium mt-6">2.2 Information collected automatically</p>
            <DataTable rows={[
              { data: "IP address",         purpose: "Security, rate limiting",                 retention: "90 days" },
              { data: "Browser/device info", purpose: "Bug fixing, compatibility",              retention: "90 days" },
              { data: "Usage analytics",    purpose: "Improving the Service",                   retention: "Aggregated, anonymized" },
            ]} />

            <p className="text-white/50 font-medium mt-6">2.3 Information we do NOT collect</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Brokerage credentials or API keys</li>
              <li>Social security numbers or government IDs</li>
              <li>Real-time market data or trading account balances</li>
              <li>Location tracking data</li>
            </ul>
          </Section>

          <Section id="how-we-use" title="3. How We Use Your Information">
            <p>We use your information to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Provide and maintain the Service (trade logging, analytics, metrics)</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send transactional emails (account verification, billing receipts, password resets)</li>
              <li>Improve the Service based on aggregated, anonymized usage patterns</li>
              <li>Detect and prevent fraud, abuse, or security incidents</li>
            </ul>
            <p className="text-amber-400/50 border-l-2 border-amber-400/20 pl-4 mt-4">
              We do not sell, rent, or trade your personal information or trade data to any third party.
              We do not use your data for advertising, profiling, or AI model training.
            </p>
          </Section>

          <Section id="third-parties" title="4. Third-Party Services">
            <p>
              We use a limited number of third-party services to operate. Each is bound by their own privacy policies:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong className="text-white/50">Lemon Squeezy</strong> — Payment processing.
                Handles credit card data directly; we never see or store your full card number.
              </li>
              <li>
                <strong className="text-white/50">Vercel</strong> — Hosting and infrastructure.
              </li>
              <li>
                <strong className="text-white/50">Authentication provider</strong> — Secure login (OAuth / email-based).
              </li>
            </ul>
            <p>
              We do not integrate with any advertising networks, social media trackers, or data brokers.
            </p>
          </Section>

          <Section id="data-security" title="5. Data Security">
            <p>We protect your data through:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Encryption in transit (TLS/HTTPS) and at rest</li>
              <li>Secure authentication with hashed passwords and session tokens</li>
              <li>Access controls limiting employee access to production data</li>
              <li>Regular security reviews of dependencies and infrastructure</li>
            </ul>
            <p>
              While we implement industry-standard security measures, no system is 100% secure.
              We cannot guarantee absolute security of your data.
            </p>
          </Section>

          <Section id="your-rights" title="6. Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-white/50">Access</strong> — View all data we hold about you</li>
              <li><strong className="text-white/50">Export</strong> — Download your trade data at any time</li>
              <li><strong className="text-white/50">Correct</strong> — Update your account information</li>
              <li><strong className="text-white/50">Delete</strong> — Request deletion of your account and all associated data</li>
              <li><strong className="text-white/50">Withdraw consent</strong> — Stop using the Service at any time</li>
            </ul>
            <p>
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:support@edgelog.app" className="text-emerald-400/60 hover:text-emerald-400 transition-colors underline underline-offset-2">
                support@edgelog.app
              </a>.
              We will respond within 30 days.
            </p>
          </Section>

          <Section id="cookies" title="7. Cookies">
            <p>
              We use only essential cookies required for the Service to function:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong className="text-white/50">Session cookie</strong> — Keeps you logged in. Expires when you sign out or after 30 days of inactivity.</li>
              <li><strong className="text-white/50">CSRF token</strong> — Prevents cross-site request forgery attacks.</li>
            </ul>
            <p>
              We do not use tracking cookies, analytics cookies, or advertising cookies.
            </p>
          </Section>

          <Section id="data-retention" title="8. Data Retention">
            <p>
              We retain your data for as long as your account is active. When you delete your account:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Your trade data, notes, and profile information are permanently deleted within 30 days</li>
              <li>Billing records may be retained for up to 7 years as required by tax and accounting laws</li>
              <li>Anonymized, aggregated analytics data may be retained indefinitely</li>
            </ul>
          </Section>

          <Section id="children" title="9. Children&apos;s Privacy">
            <p>
              The Service is not intended for anyone under the age of 18. We do not knowingly collect
              personal information from children. If you believe a child under 18 has provided us with
              personal information, please contact us and we will delete it.
            </p>
          </Section>

          <Section id="international" title="10. International Data Transfers">
            <p>
              Your data may be processed and stored on servers located outside your country of residence.
              By using the Service, you consent to the transfer of your data to these locations.
              We ensure appropriate safeguards are in place to protect your data in compliance with applicable laws.
            </p>
          </Section>

          <Section id="changes" title="11. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes
              by email or through a notice on the Service. The &ldquo;Last updated&rdquo; date at the top of this page
              indicates when the policy was last revised.
            </p>
          </Section>

          <Section id="contact" title="12. Contact Us">
            <p>
              If you have questions about this Privacy Policy or how we handle your data, contact us at:
            </p>
            <div className="mt-3 px-5 py-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <p className="font-mono text-[12px] text-white/50">
                Email:{" "}
                <a href="mailto:support@edgelog.app" className="text-emerald-400/60 hover:text-emerald-400 transition-colors underline underline-offset-2">
                  support@edgelog.app
                </a>
              </p>
            </div>
          </Section>

          {/* Bottom nav */}
          <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-wrap items-center gap-6">
            <Link href="/terms" className="font-mono text-[11px] text-white/25 hover:text-white/50 transition-colors">
              Terms of Service 
            </Link>
            <Link href="/" className="font-mono text-[11px] text-white/25 hover:text-white/50 transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>

      <LandingFooter />
    </div>
  );
}
