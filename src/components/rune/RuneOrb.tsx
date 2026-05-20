import { useEffect, useState } from "react";

type OrbState = "idle" | "listening" | "thinking" | "executing" | "warning" | "secure";

interface RuneOrbProps {
  state?: OrbState;
}

const stateColors: Record<OrbState, { a: string; b: string; ring: string }> = {
  idle:      { a: "oklch(0.85 0.18 200 / 0.9)", b: "oklch(0.55 0.22 270 / 0.7)", ring: "oklch(0.78 0.16 200 / 0.5)" },
  listening: { a: "oklch(0.88 0.18 195 / 0.95)", b: "oklch(0.6 0.2 220 / 0.75)", ring: "oklch(0.82 0.16 200 / 0.7)" },
  thinking:  { a: "oklch(0.78 0.2 290 / 0.9)", b: "oklch(0.5 0.22 310 / 0.7)", ring: "oklch(0.7 0.2 290 / 0.6)" },
  executing: { a: "oklch(0.85 0.18 160 / 0.9)", b: "oklch(0.55 0.2 180 / 0.7)", ring: "oklch(0.78 0.16 160 / 0.6)" },
  warning:   { a: "oklch(0.85 0.18 75 / 0.9)", b: "oklch(0.65 0.22 40 / 0.7)", ring: "oklch(0.82 0.18 60 / 0.6)" },
  secure:    { a: "oklch(0.55 0.1 260 / 0.95)", b: "oklch(0.3 0.08 280 / 0.7)", ring: "oklch(0.65 0.15 280 / 0.7)" },
};

export function RuneOrb({ state = "idle" }: RuneOrbProps) {
  const c = stateColors[state];
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 120);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 460, height: 460 }}>
      {/* Outer ambient glow */}
      <div
        className="absolute inset-0 rounded-full blur-3xl animate-glow-breathe"
        style={{ background: `radial-gradient(circle, ${c.a} 0%, transparent 65%)`, opacity: 0.6 }}
      />

      {/* Outer rotating ring with ticks */}
      <svg className="absolute animate-orb-rotate" width="460" height="460" viewBox="0 0 460 460">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c.ring} stopOpacity="0.9" />
            <stop offset="50%" stopColor={c.ring} stopOpacity="0.1" />
            <stop offset="100%" stopColor={c.ring} stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <circle cx="230" cy="230" r="222" fill="none" stroke="url(#ringGrad)" strokeWidth="1" />
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i / 60) * Math.PI * 2;
          const x1 = 230 + Math.cos(angle) * 214;
          const y1 = 230 + Math.sin(angle) * 214;
          const len = i % 5 === 0 ? 10 : 4;
          const x2 = 230 + Math.cos(angle) * (214 - len);
          const y2 = 230 + Math.sin(angle) * (214 - len);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c.ring} strokeWidth="1" opacity={i % 5 === 0 ? 0.8 : 0.35} />;
        })}
      </svg>

      {/* Mid counter-rotating arc */}
      <svg className="absolute animate-orb-rotate-rev" width="380" height="380" viewBox="0 0 380 380">
        <circle cx="190" cy="190" r="180" fill="none" stroke={c.ring} strokeWidth="1" strokeDasharray="2 8" opacity="0.6" />
        <path d="M 190 10 A 180 180 0 0 1 370 190" fill="none" stroke={c.a} strokeWidth="1.5" opacity="0.7" />
        <path d="M 190 370 A 180 180 0 0 1 10 190" fill="none" stroke={c.a} strokeWidth="1.5" opacity="0.7" />
      </svg>

      {/* Pulse ring */}
      <div
        className="absolute rounded-full animate-ring-pulse"
        style={{
          width: 320, height: 320,
          border: `1px solid ${c.ring}`,
          boxShadow: `0 0 60px ${c.a}, inset 0 0 40px ${c.b}`,
        }}
      />

      {/* Inner audio waveform (always present but tuned via state) */}
      <div className="absolute flex items-center gap-[3px]" style={{ width: 240, height: 60, top: "calc(50% + 130px)" }}>
        {Array.from({ length: 28 }).map((_, i) => {
          const h = state === "listening"
            ? 6 + Math.abs(Math.sin((tick + i * 2) * 0.4)) * 22
            : state === "thinking"
            ? 4 + Math.abs(Math.sin((tick + i) * 0.2 + i)) * 14
            : state === "executing"
            ? 4 + ((i + tick) % 7) * 3
            : 3 + Math.abs(Math.sin((tick * 0.1) + i)) * 5;
          return (
            <span
              key={i}
              className="rounded-full"
              style={{ width: 2, height: h, background: c.a, opacity: 0.75, transition: "height 120ms ease-out" }}
            />
          );
        })}
      </div>

      {/* The orb sphere */}
      <div
        className="relative rounded-full animate-orb-pulse"
        style={{
          width: 240, height: 240,
          background: `radial-gradient(circle at 32% 30%, ${c.a} 0%, ${c.b} 45%, oklch(0.18 0.05 270 / 0.5) 75%, oklch(0.1 0.02 260) 100%)`,
          boxShadow: `0 0 80px ${c.a}, 0 0 160px ${c.b}, inset 0 -20px 60px oklch(0 0 0 / 0.6), inset 20px 30px 60px ${c.a}`,
        }}
      >
        {/* surface highlight */}
        <div
          className="absolute rounded-full"
          style={{ inset: 12, background: "radial-gradient(circle at 35% 25%, oklch(1 0 0 / 0.35), transparent 40%)" }}
        />
        {/* meridian lines */}
        <svg className="absolute inset-0 animate-orb-rotate-rev" viewBox="0 0 240 240">
          <ellipse cx="120" cy="120" rx="115" ry="38" fill="none" stroke="oklch(1 0 0 / 0.12)" strokeWidth="0.5" />
          <ellipse cx="120" cy="120" rx="115" ry="70" fill="none" stroke="oklch(1 0 0 / 0.1)" strokeWidth="0.5" />
          <ellipse cx="120" cy="120" rx="38" ry="115" fill="none" stroke="oklch(1 0 0 / 0.12)" strokeWidth="0.5" />
        </svg>
        {/* core */}
        <div
          className="absolute rounded-full animate-glow-breathe"
          style={{
            inset: "40%",
            background: `radial-gradient(circle, oklch(1 0 0 / 0.9), ${c.a} 60%, transparent)`,
            filter: "blur(2px)",
          }}
        />
      </div>

      {/* State label */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full glass">
        <span className="w-1.5 h-1.5 rounded-full animate-blink" style={{ background: c.a, boxShadow: `0 0 8px ${c.a}` }} />
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
          RUNE · {state}
        </span>
      </div>
    </div>
  );
}
