"use client";

import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * GSAP SplitText reveal for the H1-style headings: each word rises out of its own mask,
 * staggered. Words (not lines) are split so headings keep wrapping naturally on resize —
 * and so the hero's first-line text-indent still works.
 *
 * Headings opt in with `data-split`; CSS hides them until they're split (see globals.css)
 * so they don't flash at full opacity first.
 *
 * @param onLoad play straight away (the hero) instead of when scrolled into view.
 * @param afterSplit runs once the DOM is split, e.g. to re-measure layout.
 */
export function useSplitReveal(
  ref: React.RefObject<HTMLElement | null>,
  { onLoad = false, afterSplit }: { onLoad?: boolean; afterSplit?: () => void } = {},
) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.splitReady = "";
      return;
    }

    const ctx = gsap.context(() => {
      const split = SplitText.create(el, { type: "words", wordsClass: "split-word", mask: "words" });
      afterSplit?.();
      el.dataset.splitReady = "";

      gsap.from(split.words, {
        // Far enough to clear the mask's extra descender padding (see .split-word-mask).
        yPercent: 140,
        duration: 1,
        ease: "expo.out",
        stagger: 0.04,
        delay: onLoad ? 0.15 : 0,
        scrollTrigger: onLoad ? undefined : { trigger: el, start: "top 85%", once: true },
      });
    }, el);

    return () => ctx.revert();
    // afterSplit is deliberately left out: re-splitting whenever its identity changes isn't wanted.
  }, [ref, onLoad]);
}
