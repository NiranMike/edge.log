"use client";

import { useRef, useState, useCallback, type ReactNode, type CSSProperties } from "react";

interface Props {
  children:     ReactNode;
  className?:   string;
  style?:       CSSProperties;
  tiltMax?:     number;
  glowOpacity?: number;
}

const BORDER_GLOW_CSS = `
@property --tilt-border-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
@keyframes tiltBorderSpin {
  0%   { --tilt-border-angle: 0deg; }
  100% { --tilt-border-angle: 360deg; }
}
`;

let styleInjected = false;

export function TiltCard({
  children,
  className,
  style,
  tiltMax     = 18,
  glowOpacity = 0.05,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt]       = useState({ rx: 0, ry: 0, x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  // Inject the @property + keyframes once
  if (typeof document !== "undefined" && !styleInjected) {
    const s = document.createElement("style");
    s.textContent = BORDER_GLOW_CSS;
    document.head.appendChild(s);
    styleInjected = true;
  }

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x  = e.clientX - left;
    const y  = e.clientY - top;
    const nx = (x - width / 2) / (width / 2);
    const ny = (y - height / 2) / (height / 2);
    setTilt({ rx: -ny * tiltMax, ry: nx * tiltMax, x, y });
  }, [tiltMax]);

  const onLeave = useCallback(() => {
    setHovered(false);
    setPressed(false);
    setTilt({ rx: 0, ry: 0, x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transform: pressed
          ? `perspective(800px) rotateX(${tilt.rx * 0.5}deg) rotateY(${tilt.ry * 0.5}deg) scale3d(0.97,0.97,0.97)`
          : hovered
            ? `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(1.02,1.02,1.02)`
            : "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
        transition: pressed
          ? "transform 0.1s cubic-bezier(0.22,0.68,0,1), border-color 0.2s, box-shadow 0.2s"
          : hovered
            ? "transform 0.12s ease-out, border-color 0.2s, box-shadow 0.2s"
            : "transform 0.4s ease-out, border-color 0.2s, box-shadow 0.2s",
        transformStyle: "preserve-3d",
      }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
    >
      {children}

      {/* Cursor spotlight */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-10"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${tilt.x}px ${tilt.y}px, rgba(255,255,255,${glowOpacity}), transparent 40%)`,
          transition: "opacity 0.25s ease-out",
        }}
      />

      {/* Rotating border glow */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-[1]"
        style={{
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease-out",
          padding: "1px",
          background: "conic-gradient(from var(--tilt-border-angle, 0deg), transparent 30%, rgba(16,185,129,0.45) 50%, transparent 70%)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          animation: "tiltBorderSpin 3s linear infinite",
        }}
      />
    </div>
  );
}
