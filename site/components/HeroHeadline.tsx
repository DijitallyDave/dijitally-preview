"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import { useSplitReveal } from "./useSplitReveal";

/**
 * Hero headline whose first line sits flush right while the rest stay left-aligned,
 * giving the Figma "indented" opening line at every width. Words reveal with SplitText on load.
 *
 * CSS can't align a single line, so we measure: lay the text out with no indent, find how
 * much room the first line leaves on the right, and indent by exactly that. The first line
 * already holds as many words as fit, so the indent shifts it without changing where it wraps.
 */
export default function HeroHeadline({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.textIndent = "0px";
    const range = document.createRange();
    range.selectNodeContents(el);
    const rects = [...range.getClientRects()].filter((r) => r.width > 0);
    if (!rects.length) return;

    // Fragments on the first line share (roughly) the first fragment's vertical position.
    const firstTop = Math.min(...rects.map((r) => r.top));
    const lineHeight = rects[0].height;
    const firstLineRight = Math.max(...rects.filter((r) => r.top - firstTop < lineHeight / 2).map((r) => r.right));

    const box = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const contentRight = box.right - parseFloat(style.paddingRight) - parseFloat(style.borderRightWidth);

    // Half a pixel of give so sub-pixel rounding can never push the last word onto line two.
    const slack = contentRight - firstLineRight - 0.5;
    el.style.textIndent = `${Math.max(0, slack).toFixed(2)}px`;
  }, []);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // Breakpoints can change the font size without changing the box width.
    window.addEventListener("resize", measure);
    // Re-measure once the brand font replaces the fallback, since glyph widths change.
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // Split words wrap in inline-blocks, which can shift widths by a hair — re-measure after.
  useSplitReveal(ref, { onLoad: true, afterSplit: measure });

  return (
    <h1 ref={ref} data-split className={className}>
      {children}
    </h1>
  );
}
