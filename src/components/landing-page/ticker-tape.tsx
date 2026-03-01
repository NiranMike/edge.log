// Server component — pure CSS animation, zero JS

import { cx } from "@/style";


const ITEMS = [
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

export function TickerTape() {
  const all = [...ITEMS, ...ITEMS]; // duplicate for seamless loop
  return (
    <div className={cx("relative overflow-hidden border-y border-white/[0.05] bg-black/80 py-2.5 z-10")}>
      {/* Edge fades */}
      <div className="pointer-events-none absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-black to-transparent z-10" />

      <div className="flex animate-ticker w-max" style={{ willChange: "transform" }}>
        {all.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-6 border-r border-white/[0.05] font-mono text-[10px] whitespace-nowrap"
          >
            <span className="text-white/45 font-medium tracking-wider">{item.sym}</span>
            <span className={item.pos ? "text-emerald-400" : "text-rose-400"}>{item.chg}</span>
            <span className={cx("text-[7px]", item.pos ? "text-emerald-400/40" : "text-rose-400/40")}>
              {item.pos ? "▲" : "▼"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}