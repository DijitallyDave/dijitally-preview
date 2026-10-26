"use client";

import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { onPreloaded } from "./preloaded";

gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * SplitText only breaks words at spaces, and each word is an unbreakable inline-block, so a
 * hyphenated word ("ever-changing") can only wrap as a whole and leaves a ragged gap. Cut such
 * words after each hyphen into separate masked words joined by a <wbr>: they sit together when
 * they fit and break after the hyphen when they don't, like normal text.
 * Returns the full word list (with the pieces) for the animation.
 */
function breakAtHyphens(words: Element[]): Element[] {
  const out: Element[] = [];
  for (const word of words) {
    const text = word.textContent ?? "";
    const mask = word.parentElement;
    // Only plain-text words with an inner hyphen; leave anything with nested markup alone.
    if (!mask || word.children.length || !/[^-]-[^-]/.test(text)) {
      out.push(word);
      continue;
    }
    text.split(/(?<=-)/).forEach((part, i) => {
      if (i > 0) mask.before(document.createElement("wbr"));
      const pieceMask = mask.cloneNode(false) as Element;
      const piece = word.cloneNode(false) as Element;
      piece.textContent = part;
      pieceMask.append(piece);
      mask.before(pieceMask);
      out.push(piece);
    });
    mask.remove();
  }
  return out;
}

/**
 * GSAP SplitText reveal for the H1-style headings: each word rises out of its own mask,
 * staggered. Words (not lines) are split so headings keep wrapping naturally on resize —
 * and so the hero's first-line text-indent still works.
 *
 * Headings opt in with `data-split`; CSS hides them until they're split (see globals.css)
 * so they don't flash at full opacity first.
 *
 * @param onLoad play on load (the hero, once the preloader hands over) instead of when scrolled into view.
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

    let stopWaiting = () => {};
    const ctx = gsap.context(() => {
      // Spans, not the default divs: a div inside a heading is invalid HTML.
      const split = SplitText.create(el, { type: "words", tag: "span", wordsClass: "split-word", mask: "words" });
      const words = breakAtHyphens(split.words);
      afterSplit?.();
      el.dataset.splitReady = "";

      const tween = gsap.from(words, {
        // Far enough to clear the mask's extra descender padding (see .split-word-mask).
        yPercent: 140,
        duration: 1,
        ease: "expo.out",
        stagger: 0.04,
        delay: onLoad ? 0.15 : 0,
        paused: onLoad,
        scrollTrigger: onLoad ? undefined : { trigger: el, start: "top 85%", once: true },
      });
      if (onLoad) stopWaiting = onPreloaded(() => tween.play());
    }, el);

    return () => {
      stopWaiting();
      ctx.revert();
    };
    // afterSplit is deliberately left out: re-splitting whenever its identity changes isn't wanted.
  }, [ref, onLoad]);
}
