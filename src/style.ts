
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


export const ds = {
  // ── Backgrounds ──
  bgBase:    "bg-[var(--bg-base)]",
  bgSurface: "bg-[var(--bg-surface)]",
  bgCard:    "bg-[var(--bg-elevated)]",
  bgOverlay: "bg-[var(--bg-overlay)]",

  // ── Borders ──
  border:       "border border-[var(--bd)]",
  borderStrong: "border border-[var(--bd-hi)]",

  // ── Accent borders ──
  borderPrimary:   "border border-[var(--ac-1-ring)]",
  borderSecondary: "border border-[var(--ac-2-ring)]",
  borderTertiary:  "border border-violet-400/20",

  // ── Text ──
  textPrimary:   "text-[var(--tx-1)]",
  textSecondary: "text-[var(--tx-2)]",
  textMuted:     "text-[var(--tx-3)]",
  textFaint:     "text-[var(--tx-4)]",

  // ── Accent text ──
  textAccent:  "text-[var(--ac-1)]",
  textAccent2: "text-[var(--ac-2)]",
  textAccent3: "text-violet-400",

  // ── Typography ──
  fontDisplay: "font-display",
  fontMono:    "font-mono",

  heading: "font-display font-extrabold text-[var(--tx-1)] leading-[1.06] tracking-tight",
  label:   "font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ac-1)]",
  body:    "font-mono text-[13px] leading-relaxed text-[var(--tx-3)]",
  micro:   "font-mono text-[9px] uppercase tracking-widest text-[var(--tx-4)]",

  // ── Spacing ──
  sectionY:  "py-24 sm:py-32 lg:py-40",
  pageX:     "px-5 sm:px-8 lg:px-14",
  container: "max-w-7xl mx-auto",

  // ── Section label row ──
  sectionLabel:     "flex items-center gap-3 mb-4",
  sectionLabelLine: "w-8 h-px bg-[var(--ac-1)] shrink-0",

  // ── Cards ──
  card:      "rounded-xl bg-[var(--bg-elevated)] border border-[var(--bd)]",
  cardHover: "hover:border-[var(--bd-hi)] transition-colors duration-200",
  cardShadow:"shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_24px_64px_rgba(0,0,0,0.55)]",

  // ── Clipped corner shape ──
  clip12: { clipPath: "polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 16px))" },
  clip16: { clipPath: "polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))" },
  clip20: { clipPath: "polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))" },

  // ── Buttons ──
  btnPrimary:   "relative overflow-hidden font-mono font-bold text-[11px] uppercase tracking-[0.14em] text-[var(--bg-base)] bg-[var(--ac-1)] hover:opacity-90 transition-all duration-150",
  btnSecondary: "font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--tx-3)] border border-[var(--bd)] hover:border-[var(--bd-hi)] hover:text-[var(--tx-2)] transition-colors duration-150",
  btnGhost:     "font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ac-1)] border border-[var(--ac-1-ring)] hover:bg-[var(--ac-1-dim)] transition-colors duration-150",
  btnShimmer:   "absolute inset-0 bg-white/15 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12",

  // ── Inputs ──
  input: "bg-[var(--bg-input)] border border-[var(--bd)] font-mono text-[12px] text-[var(--tx-1)] placeholder:text-[var(--tx-4)] outline-none focus:border-[var(--ac-1-ring)] transition-colors tracking-wide",

  // ── Live badge ──
  liveBadge: "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ac-1)] bg-[var(--ac-1-dim)] border border-[var(--ac-1-ring)]",

  // ── Divider ──
  divider: "border-t border-[var(--bd)]",

  // ── Scanline overlay ──
  scanlines: {
    backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.35) 2px,rgba(0,0,0,0.35) 4px)",
  },

  // ── Dot-grid background ──
  dotGrid: {
    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)",
    backgroundSize:  "40px 40px",
  },

  lineGrid: {
    backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
    backgroundSize:  "48px 48px",
  },
} as const;



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