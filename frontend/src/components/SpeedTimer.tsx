import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";


interface Props {
  seconds: number;
  runKey: string | number; // change to reset
  paused?: boolean;
  onExpire: () => void;
}

/** Circular countdown for speed round. Auto-fires onExpire once at 0. */
export function SpeedTimer({ seconds, runKey, paused, onExpire }: Props) {
  const [remaining, setRemaining] = useState(seconds);
  const firedRef = useRef(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(seconds);
    firedRef.current = false;
  }, [seconds, runKey]);

  useEffect(() => {
    if (paused) return;
    if (remaining <= 0) {
      if (!firedRef.current) {
        firedRef.current = true;
        onExpire();
      }
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, paused, onExpire]);

  const pct = Math.max(0, Math.min(1, remaining / seconds));
  const circumference = 2 * Math.PI * 42;
  const dash = circumference * pct;
  const danger = remaining <= 5;

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="42" strokeWidth="6" fill="none"
          className="stroke-white/10" />
        <circle
          cx="50" cy="50" r="42" strokeWidth="6" fill="none" strokeLinecap="round"
          className={cn("transition-[stroke-dashoffset] duration-1000 ease-linear",
            danger ? "stroke-rose-400" : "stroke-cyan")}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference - dash}
        />
      </svg>
      <div className={cn(
        "absolute inset-0 grid place-items-center font-display font-black text-3xl",
        danger ? "text-rose-300 animate-pulse" : "text-white"
      )}>
        {remaining}
      </div>
    </div>
  );
}
