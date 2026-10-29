"use client";

import { useEffect, useRef } from "react";

/** How far down the page (as a share of the screen's height) it takes to slide right out. */
const DISTANCE = 0.25;

/**
 * Slides its contents down out of their own box as the page scrolls away from the top, the box
 * clipping them, so they drop away under its bottom edge. Back at the top, they're back in place.
 * Nothing moves with reduced motion.
 */
export default function SlideAway({ children }: { children: React.ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = inner.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * DISTANCE)));
      el.style.transform = p ? `translateY(${p * 100}%)` : "";
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="overflow-hidden">
      <div ref={inner}>{children}</div>
    </div>
  );
}
