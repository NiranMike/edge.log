import { AccentKey, ds, palette } from "@/style";

export const METRICS = [
  { prefix: "+", val: 68,   suffix: "%",   label: "Win Rate Increase",     textClass: ds.textAccent,  glowHex: palette.primaryGlow  },
  { prefix: "",  val: 30,   suffix: "s",   label: "To Log a Trade",        textClass: ds.textAccent2, glowHex: palette.secondaryGlow },
  { prefix: "",  val: 2,    suffix: ".4R", label: "R-Multiple Improvement",textClass: ds.textAccent3, glowHex: palette.tertiaryGlow  },
  { prefix: "",  val: 1247, suffix: "+",   label: "Traders Journaling",    textClass: ds.textPrimary, glowHex: "rgba(255,255,255,0.15)" },
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
    quote:    "The revenge trading warning was a slap in the face — in a good way. Six revenge trades in a month I couldn't even see myself taking.",
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
  { label: "Pricing",      href: "/pricing"     },
];

export const STEPS = [
  {
    num: "01", title: "Log the Trade",     time: "30 seconds",
    desc:   "Asset, direction, entry, stop, exit, size. Hit save. P&L, R-multiple, and result appear instantly — no math required.",
    detail: "Quick mode captures 6 fields in under 30 seconds. Advanced mode adds session, strategy, emotion, and confidence for deep behavioural analysis.",
  },
  {
    num: "02", title: "Tag Your State",    time: "Optional",
    desc:   "Session, strategy, emotion, confidence. These 4 tags are the difference between data and behavioural edge.",
    detail: "Traders who tag consistently identify their worst emotional states within 3 weeks. Most discover they're losing 40%+ of profits to 1–2 repeatable mistakes.",
  },
  {
    num: "03", title: "Read the Patterns", time: "Automatic",
    desc:   "After 10 trades, your behavioural fingerprint emerges. Best session, worst emotion, strongest strategy — all surfaced.",
    detail: "The insight engine cross-references session, emotion, strategy, and confidence to find your hidden edges and leaks simultaneously.",
  },
  {
    num: "04", title: "Review & Refine",   time: "Weekly",
    desc:   "Auto-generated weekly summary. Five guided reflection questions. Behavioural warnings when revenge trading or streak danger appears.",
    detail: "Traders who complete weekly reviews improve their win rate 2–3× faster than those who only track numbers. The journal becomes your second brain.",
  },
] as const;

export const TRADE_ROWS = [
  { asset: "EURUSD",  dir: "Buy",  sess: "London", strat: "Breakout",    emo: "Calm",       conf: 4, pnl: "+$1,050", win: true  },
  { asset: "BTCUSDT", dir: "Sell", sess: "NY",     strat: "FVG",         emo: "FOMO",       conf: 1, pnl: "−$400",   win: false },
  { asset: "XAUUSD",  dir: "Buy",  sess: "NY",     strat: "Liq. Sweep",  emo: "Calm",       conf: 5, pnl: "+$750",   win: true  },
  { asset: "GBPUSD",  dir: "Sell", sess: "London", strat: "Order Block", emo: "Confident",  conf: 4, pnl: "+$1,200", win: true  },
] as const;


export const FEATURES: {
  icon: string;
  num: string;
  title: string;
  desc: string;
  tag: string;
  accent: AccentKey;
}[] = [
  { icon: "⚡", num: "01", title: "30-Second Logging",  desc: "Quick mode: asset, direction, entry, stop, exit, size. P&L, R-multiple, win/loss — all instant.",                   tag: "< 30s to log",   accent: "emerald" },
  { icon: "🧠", num: "02", title: "Pattern Analytics",  desc: "Discover your best session, worst emotion, and which setups print vs which ones bleed you dry.",                     tag: "Analytics",      accent: "violet"     },
  { icon: "📈", num: "03", title: "Equity Curve",       desc: "Every trade plotted. Watch your account compound — or see exactly where discipline broke down.",                      tag: "Real-time",      accent: "teal"   },
  { icon: "⚖️", num: "04", title: "R Calculations",     desc: "Risk-to-reward, R-multiple, profit factor, expectancy — auto-calculated on every entry.",                            tag: "Automatic",      accent: "emerald" },
  { icon: "🎯", num: "05", title: "Strategy Tracker",   desc: "Tag every trade. Your Breakout vs Reversal edge surfaces after 10 trades, not 10 months.",                           tag: "Per-setup stats", accent: "violet"    },
  { icon: "🪞", num: "06", title: "Weekly Review",      desc: "Auto-generated summaries. Guided prompts. Revenge trading warnings before they destroy a week.",                     tag: "Behavioral",     accent: "teal"   },
];