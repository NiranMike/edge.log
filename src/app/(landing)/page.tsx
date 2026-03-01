
import { CtaSection } from "@/components/landing-page/cta-section";
import { FeaturesSection } from "@/components/landing-page/feature-section";
import { HeroSection } from "@/components/landing-page/hero-section";
import { HowItWorksSection } from "@/components/landing-page/how-it-work-section";
import { LandingFooter } from "@/components/landing-page/landing-footer";
import { LandingNav } from "@/components/landing-page/landing-nav";
import { MetricsSection } from "@/components/landing-page/matric-section";
import { TestimonialsSection } from "@/components/landing-page/testimonials-section";
import { TickerTape } from "@/components/landing-page/ticker-tape";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "EDGE.LOG — Stop Losing to Yourself. Start Trading With Edge.",
  description: "A 30-second trade journal that turns your behavioral patterns into an unfair advantage. Know your best sessions, worst emotions, and exactly where your edge lives.",
  viewport: "width=device-width, initial-scale=1",
};

export default function LandingPage() {
  return (
    <div className="bg-black text-slate-200 min-h-screen overflow-x-hidden selection:bg-emerald-400/20 selection:text-emerald-300">
      <LandingNav />
      <HeroSection />
      <TickerTape />
      <FeaturesSection />
      <MetricsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection />
      <LandingFooter />
    </div>
  );
}