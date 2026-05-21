
import { auth } from "#/auth";
import { PricingSection } from "@/components/billing/pricing-section";
import { CtaSection } from "@/components/landing-page/cta-section";
import { FeaturesSection } from "@/components/landing-page/feature-section";
import { HeroSection } from "@/components/landing-page/hero-section";
import { HowItWorksSection } from "@/components/landing-page/how-it-work-section";
import { LandingFooter } from "@/components/landing-page/landing-footer";
import { LandingNav } from "@/components/landing-page/landing-nav";
import { TickerTape } from "@/components/landing-page/ticker-tape";
import type { Metadata } from "next";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
  title: "EDGE.LOG — Stop Losing to Yourself. Start Trading With Edge.",
  description: "A 30-second trade journal that turns your behavioral patterns into an unfair advantage. Know your best sessions, worst emotions, and exactly where your edge lives.",
  viewport: "width=device-width, initial-scale=1",
};

export default async function LandingPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="bg-black text-slate-200 min-h-screen overflow-x-hidden selection:bg-emerald-400/20 selection:text-emerald-300">
      <LandingNav />
      <HeroSection />
      <TickerTape />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <CtaSection />
      <LandingFooter />
    </div>
  );
}