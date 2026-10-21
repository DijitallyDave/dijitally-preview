"use client";

import { useEffect, useState } from "react";

/** Index of the child nearest the scroller's left edge (after scroll-padding), updated on scroll. */
export function useActiveSlide(ref: React.RefObject<HTMLElement | null>) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const start = el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).scrollPaddingLeft || "0");
      const slides = [...el.children] as HTMLElement[];
      let best = 0;
      let bestDist = Infinity;
      slides.forEach((s, i) => {
        const d = Math.abs(s.getBoundingClientRect().left - start);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      // At the end of the track the last slide can't reach the left edge; treat it as active.
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) best = slides.length - 1;
      setActive(best);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, [ref]);

  return active;
}

/**
 * Mobile carousel page dots from the Figma: 8px static-grey dots, the active one stretched to a
 * 24px pill. Each dot scrolls its slide into place.
 */
export default function CarouselDots({
  count,
  active,
  target,
  label,
}: {
  count: number;
  active: number;
  target: React.RefObject<HTMLElement | null>;
  label: string;
}) {
  const goTo = (i: number) => {
    const el = target.current;
    const slide = el?.children[i] as HTMLElement | undefined;
    if (!el || !slide) return;
    const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft || "0");
    el.scrollTo({ left: slide.offsetLeft - el.offsetLeft - pad, behavior: "smooth" });
  };

  return (
    <div role="group" aria-label={label} className="flex items-center justify-center gap-2 lg:hidden">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Show item ${i + 1} of ${count}`}
          aria-current={i === active ? "true" : undefined}
          onClick={() => goTo(i)}
          className={`h-2 cursor-pointer rounded-full bg-static transition-[width] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
            i === active ? "w-6" : "w-2"
          }`}
        />
      ))}
    </div>
  );
}
