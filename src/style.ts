/**
 * EdgeLog Design System
 * ─────────────────────
 * Single source of truth for all design tokens.
 * Import `ds` wherever you need consistent styles.
 *
 * Usage:
 *   import { ds, cx } from "@/styles";
 *   <div className={cx(ds.surface, ds.border, "p-6")} />
 */

// ─── Utility ──────────────────────────────────────────────────────────────────

/** Lightweight classname joiner (no dependency needed). */
export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ─── Colour Palette ───────────────────────────────────────────────────────────

export const palette = {
  /** Primary accent — emerald */
  primary:       "#10b981",
  primaryDim:    "rgba(16,185,129,0.12)",
  primaryBorder: "rgba(16,185,129,0.22)",
  primaryGlow:   "rgba(16,185,129,0.35)",

  /** Secondary accent — teal */
  secondary:       "#2dd4bf",
  secondaryDim:    "rgba(45,212,191,0.12)",
  secondaryBorder: "rgba(45,212,191,0.22)",
  secondaryGlow:   "rgba(45,212,191,0.3)",

  /** Tertiary accent — violet */
  tertiary:       "#a78bfa",
  tertiaryDim:    "rgba(167,139,250,0.12)",
  tertiaryBorder: "rgba(167,139,250,0.22)",
  tertiaryGlow:   "rgba(167,139,250,0.3)",

  /** Danger */
  danger:       "#ef4444",
  dangerDim:    "rgba(239,68,68,0.1)",
  dangerBorder: "rgba(239,68,68,0.22)",

  /** Backgrounds */
  bgBase:    "#07090d",
  bgSurface: "#0d1117",
  bgCard:    "#0f1318",
  bgOverlay: "rgba(255,255,255,0.03)",

  /** Text */
  textPrimary:   "rgba(255,255,255,1)",
  textSecondary: "rgba(255,255,255,0.55)",
  textMuted:     "rgba(255,255,255,0.28)",
  textFaint:     "rgba(255,255,255,0.12)",

  /** Borders */
  borderBase:   "rgba(255,255,255,0.065)",
  borderStrong: "rgba(255,255,255,0.1)",
} as const;

// ─── Tailwind Atomic Tokens ───────────────────────────────────────────────────

export const ds = {
  // ── Backgrounds ──
  bgBase:    "bg-[#07090d]",
  bgSurface: "bg-[#0d1117]",
  bgCard:    "bg-[#0f1318]",
  bgOverlay: "bg-white/[0.03]",

  // ── Borders ──
  border:       "border border-white/[0.065]",
  borderStrong: "border border-white/10",

  // ── Accent borders ──
  borderPrimary:   "border border-emerald-400/20",
  borderSecondary: "border border-teal-400/20",
  borderTertiary:  "border border-violet-400/20",

  // ── Text ──
  textPrimary:   "text-white",
  textSecondary: "text-white/55",
  textMuted:     "text-white/28",
  textFaint:     "text-white/12",

  // ── Accent text ──
  textAccent:  "text-emerald-400",
  textAccent2: "text-teal-400",
  textAccent3: "text-violet-400",

  // ── Typography ──
  fontDisplay: "font-display",
  fontMono:    "font-mono",

  heading: "font-display font-extrabold text-white leading-[1.06] tracking-tight",
  label:   "font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-400",
  body:    "font-mono text-[13px] leading-relaxed text-white/40",
  micro:   "font-mono text-[9px] uppercase tracking-widest text-white/20",

  // ── Spacing ──
  sectionY:  "py-24 sm:py-32 lg:py-40",
  pageX:     "px-5 sm:px-8 lg:px-14",
  container: "max-w-7xl mx-auto",

  // ── Section label row ──
  sectionLabel:     "flex items-center gap-3 mb-4",
  sectionLabelLine: "w-8 h-px bg-emerald-400 shrink-0",

  // ── Cards ──
  card:      "rounded-xl bg-[#0f1318] border border-white/[0.065]",
  cardHover: "hover:bg-white/[0.025] transition-colors duration-200",
  cardShadow:"shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_24px_64px_rgba(0,0,0,0.55)]",

  // ── Clipped corner shape ──
  clip12: { clipPath: "polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 16px))" },
  clip16: { clipPath: "polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))" },
  clip20: { clipPath: "polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))" },

  // ── Buttons ──
  btnPrimary:   "relative overflow-hidden font-mono font-bold text-[11px] uppercase tracking-[0.14em] text-black bg-emerald-400 hover:bg-emerald-300 transition-colors duration-150",
  btnSecondary: "font-mono text-[11px] uppercase tracking-[0.14em] text-white/40 border border-white/[0.065] hover:border-white/20 hover:text-white/65 transition-colors duration-150",
  btnGhost:     "font-mono text-[11px] uppercase tracking-[0.14em] text-emerald-400 border border-emerald-400/30 hover:bg-emerald-400/8 transition-colors duration-150",
  btnShimmer:   "absolute inset-0 bg-white/15 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12",

  // ── Inputs ──
  input: "bg-white/[0.03] border border-white/10 font-mono text-[12px] text-white/80 placeholder-white/20 outline-none focus:border-emerald-400/40 transition-colors tracking-wide",

  // ── Live badge ──
  liveBadge: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400/80 bg-emerald-400/[0.08] border border-emerald-400/18",

  // ── Divider ──
  divider: "border-t border-white/[0.05]",

  // ── Scanline overlay ──
  scanlines: {
    backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.35) 2px,rgba(0,0,0,0.35) 4px)",
  },

  // ── Dot-grid background ──
  dotGrid: {
    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)",
    backgroundSize:  "40px 40px",
  },

  // ── Fine-line grid background ──
  lineGrid: {
    backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
    backgroundSize:  "48px 48px",
  },
} as const;


// ─── Per-accent colour map ─────────────────────────────────────────────────────

export type AccentKey = "emerald" | "teal" | "violet";

export const accentMap: Record<AccentKey, {
  text:      string;
  textMuted: string;
  border:    string;
  bg:        string;
  glow:      string;
  glowHex:   string;
}> = {
  emerald: {
    text:      "text-emerald-400",
    textMuted: "text-emerald-400/60",
    border:    "border-emerald-400/20",
    bg:        "bg-emerald-400/[0.06]",
    glow:      "shadow-[0_0_36px_rgba(16,185,129,0.12)]",
    glowHex:   "rgba(16,185,129,0.3)",
  },
  teal: {
    text:      "text-teal-400",
    textMuted: "text-teal-400/60",
    border:    "border-teal-400/20",
    bg:        "bg-teal-400/[0.06]",
    glow:      "shadow-[0_0_36px_rgba(45,212,191,0.12)]",
    glowHex:   "rgba(45,212,191,0.3)",
  },
  violet: {
    text:      "text-violet-400",
    textMuted: "text-violet-400/60",
    border:    "border-violet-400/20",
    bg:        "bg-violet-400/[0.06]",
    glow:      "shadow-[0_0_36px_rgba(167,139,250,0.12)]",
    glowHex:   "rgba(167,139,250,0.3)",
  },
};