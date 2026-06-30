import { AccentKey, ds, palette } from "@/style";

// Factual product metrics only — no fabricated results or user counts.
export const METRICS = [
  { prefix: "$", val: 0,  suffix: "",  label: "To start",         textClass: ds.textAccent,  glowHex: palette.primaryGlow   },
  { prefix: "",  val: 30, suffix: "s", label: "To log a trade",   textClass: ds.textAccent2, glowHex: palette.secondaryGlow },
  { prefix: "",  val: 6,  suffix: "",  label: "Analytics views",  textClass: ds.textAccent3, glowHex: palette.tertiaryGlow  },
  { prefix: "",  val: 4,  suffix: "",  label: "Sessions tracked", textClass: ds.textPrimary, glowHex: "rgba(255,255,255,0.15)" },
] as const;

export const TESTIMONIALS: {
  quote:    string;
  name:     string;
  role:     string;
  initials: string;
  result:   string;
  accent:   AccentKey;
}[] = [
  {
    quote:    "I found out I was losing 80% of my Asia session trades. Cutting that one session alone turned me profitable overnight.",
    name:     "Alex K.",
    role:     "Forex Trader · 3 years",
    initials: "AK",
    result:   "+$3,200/mo",
    accent:   "emerald",
  },
  {
    quote:    "The revenge trading warning was a slap in the face, in a good way. Six revenge trades in a month I couldn't even see myself taking.",
    name:     "Sarah L.",
    role:     "Crypto Trader · 2 years",
    initials: "SL",
    result:   "58% → 71% WR",
    accent:   "violet",
  },
  {
    quote:    "Breakout: 71% win rate. Reversal: 22% win rate. I had no idea. I only trade breakouts now. It's that simple.",
    name:     "Marcus R.",
    role:     "Futures Trader · 5 years",
    initials: "MR",
    result:   "+$7,400/mo",
    accent:   "teal",
  },
];


export const ITEMS = [
  { sym: "EURUSD",  chg: "+0.42%", pos: true  },
  { sym: "BTCUSDT", chg: "+2.18%", pos: true  },
  { sym: "GBPUSD",  chg: "−0.11%", pos: false },
  { sym: "XAUUSD",  chg: "+0.87%", pos: true  },
  { sym: "USDJPY",  chg: "−0.23%", pos: false },
  { sym: "ETHUSDT", chg: "+3.41%", pos: true  },
  { sym: "NQ1!",    chg: "+0.55%", pos: true  },
  { sym: "ES1!",    chg: "+0.31%", pos: true  },
  { sym: "SOLUSDT", chg: "−1.02%", pos: false },
  { sym: "USDCHF",  chg: "+0.14%", pos: true  },
];

export const NAV_LINKS = [
  { label: "Features",     href: "#features"    },
  { label: "How it works", href: "#howItWorks"  },
  // BILLING: { label: "Pricing", href: "/pricing" },
];

export const STEPS = [
  {
    num: "01", title: "Log the Trade",     time: "30 seconds",
    desc:   "Pair, direction, entry, stop, take-profit, exit. Hit save and your R-multiple and win/loss are calculated instantly, no math required.",
    detail: "Six fields, under 30 seconds. The R-multiple, profit factor and result are worked out for you the moment you save.",
  },
  {
    num: "02", title: "Attach the Context", time: "Optional",
    desc:   "Drop in a chart screenshot and a note on what you saw. Your journal becomes a record you can actually review, not just rows of numbers.",
    detail: "A screenshot plus a short note turns a price entry into a story you'll still understand weeks later.",
  },
  {
    num: "03", title: "Read the Patterns", time: "Automatic",
    desc:   "Best pair, strongest session, long vs short bias, R-distribution and weekday performance, all surfaced from your own trades.",
    detail: "EdgeLog cross-references pair, direction, session and weekday to show exactly where you make and lose R.",
  },
  {
    num: "04", title: "Track the Curve",   time: "Real-time",
    desc:   "Watch your equity curve compound in R and review every day on the calendar. See exactly where discipline held, or broke.",
    detail: "The equity curve and daily calendar make a bad streak obvious long before it becomes a bad month.",
  },
] as const;

export const TRADE_ROWS = [
  { asset: "EURUSD",  dir: "Buy",  sess: "London",   r: "+2.4R", win: true  },
  { asset: "BTCUSDT", dir: "Sell", sess: "New York", r: "−1.0R", win: false },
  { asset: "XAUUSD",  dir: "Buy",  sess: "New York", r: "+1.8R", win: true  },
  { asset: "GBPUSD",  dir: "Sell", sess: "London",   r: "+3.1R", win: true  },
] as const;


export const FEATURES: {
  iconId: string;
  num: string;
  title: string;
  desc: string;
  tag: string;
  accent: AccentKey;
}[] = [
  { iconId: "bolt",      num: "01", title: "30-Second Logging",  desc: "Pair, direction, entry, stop, take-profit, exit. R-multiple and win/loss calculated the moment you save.",            tag: "< 30s to log",   accent: "emerald" },
  { iconId: "chart-bar", num: "02", title: "Pattern Analytics",  desc: "Your best pair, strongest session and long vs short bias, pulled straight from the trades you've logged.",            tag: "Analytics",      accent: "violet"  },
  { iconId: "trending",  num: "03", title: "Equity Curve",       desc: "Every trade plotted in R. Watch your account compound, or see exactly where discipline broke down.",                  tag: "In R-multiple",  accent: "teal"    },
  { iconId: "scale",     num: "04", title: "R Calculations",     desc: "Risk-to-reward, R-multiple, profit factor and expectancy, auto-calculated on every entry.",                          tag: "Automatic",      accent: "emerald" },
  { iconId: "crosshair", num: "05", title: "Session Breakdown",  desc: "Asia, London, New York and the overlaps, tagged automatically from each trade's time. See which session actually pays.", tag: "Auto-tagged",  accent: "violet"  },
  { iconId: "upload",    num: "06", title: "CSV Import",         desc: "Bring your history from any broker or spreadsheet. Map the columns once and import in seconds.",                       tag: "Any broker",     accent: "teal"    },
];