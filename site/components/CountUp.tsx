"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 1100;
// Ease-out quart: fast start, gentle landing on the final value.
const ease = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * Counts from 0 up to `value` the first time it scrolls into view.
 * The server renders the final number (so it's right without JS, and for crawlers);
 * the client resets it to 0 just before it's first seen.
 */
export default function CountUp({ value, className = "" }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    setDisplay(0);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          setDisplay(Math.round(ease(t) * value));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className={`relative ${className}`}>
      {/* Screen readers get the real value once, not every intermediate number. The wrapper is
          relative so this sr-only copy stays inside its card instead of widening scrolling rows. */}
      <span aria-hidden>{display}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
