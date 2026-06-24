// BILLING: restore this page when billing is re-enabled (remove the redirect below)
import { redirect } from "next/navigation";

// BILLING: import type { Metadata } from "next";
// BILLING: import Link from "next/link";
// BILLING: import { cx, ds, palette } from "@/style";
// BILLING: import { LandingNav }            from "@/components/landing-page/landing-nav";
// BILLING: import { LandingFooter }         from "@/components/landing-page/landing-footer";
// BILLING: import { PricingFAQ }            from "@/components/billing/pricing-faq";
// BILLING: import { PricingCheckoutButton } from "@/components/billing/pricing-checkout-button";

// BILLING: export const metadata: Metadata = {
// BILLING:   title: "Pricing — EDGE.LOG",
// BILLING:   description: "Free forever for core trade journaling. Upgrade to Pro for the full analytics suite.",
// BILLING: };

export default function PricingPage() {
  redirect("/register");
}
