"use client";

import { cn } from "@/util";
import { useEffect, useRef, type ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}


export function RevealOnScroll({ children, delay = 0, className }: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if already visible (e.g. above fold)
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      // Already visible — skip animation
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Use CSS transition already on element, just update props
          if (delay) {
            setTimeout(() => {
              el.style.opacity = "1";
              el.style.transform = "none";
            }, delay);
          } else {
            el.style.opacity = "1";
            el.style.transform = "none";
          }
          obs.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: "translateY(16px)",
        // Use transform + opacity only — both compositor-accelerated
        transition: `opacity 0.5s ease, transform 0.5s ease`,
        // Promote to own layer during animation
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}