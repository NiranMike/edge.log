import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
        display: ["'Syne'", "sans-serif"],
      },
      colors: {
        brand: {
          green:       "#22d3a0",
          "green-dim": "rgba(34,211,160,0.10)",
          red:         "#f43f6e",
          "red-dim":   "rgba(244,63,110,0.10)",
        },
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)"   },
        },
        // Ticker: 2 copies → translate exactly -50% for seamless loop
        ticker: {
          "0%":   { transform: "translateX(0)"    },
          "100%": { transform: "translateX(-50%)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.5" },
          "50%":      { opacity: "1"   },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.2s ease forwards",
        // 35s feels smooth; GPU-only via will-change:transform on the element
        ticker:    "ticker 35s linear infinite",
        glow:      "glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;