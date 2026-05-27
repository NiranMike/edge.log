"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  value:      number;
  duration?:  number;
  decimals?:  number;
  prefix?:    string;
  suffix?:    string;
  className?: string;
}

export function CountUp({
  value,
  duration  = 900,
  decimals  = 0,
  prefix    = "",
  suffix    = "",
  className,
}: Props) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);
  const rafRef  = useRef(0);

  useEffect(() => {
    const from = prevRef.current;
    const to   = value;
    if (from === to) { setDisplay(to); return; }

    const start = performance.now();

    function tick(now: number) {
      const t     = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else prevRef.current = to;
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  const formatted = decimals === 0
    ? String(Math.round(display))
    : display.toFixed(decimals);

  return <span className={className}>{prefix}{formatted}{suffix}</span>;
}
