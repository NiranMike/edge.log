
import { ITEMS } from "@/const/landing-page-const";
import { cx } from "@/style";




export function TickerTape() {
  const all = [...ITEMS, ...ITEMS];
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