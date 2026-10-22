"use client";

import Image from "next/image";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { asset } from "./asset";
import { HERO_MELT, HERO_SLIDES } from "./heroSlides.config";
import { meltDelays } from "./melt";
import { onPreloaded } from "./preloaded";

/** Index of the hero slide currently on show, shared with the name card. */
const SlideContext = createContext<{ index: number; setIndex: (i: number) => void }>({
  index: 0,
  setIndex: () => {},
});

export function HeroSlidesProvider({ children }: { children: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  return <SlideContext.Provider value={{ index, setIndex }}>{children}</SlideContext.Provider>;
}

export const useHeroSlide = () => HERO_SLIDES[useContext(SlideContext).index];

/** Draw `img` into a w×h canvas the way `object-fit: cover` would (centred crop). */
function coverCanvas(img: HTMLImageElement, w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  c.getContext("2d")!.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  return c;
}

/**
 * Hero image slideshow with a sideways DOOM-style melt between images. All tuning lives in
 * heroSlides.config.ts. The first image is rendered as a normal <Image> (fast first paint and
 * no-JS fallback); the canvas takes over once every slide has loaded.
 *
 * `className` positions the photo's box. The canvas covers the whole hero (the positioned
 * parent) so melting strips keep travelling past the photo's edge to the hero's edge; each
 * photo is drawn into the box's position on that canvas.
 */
export default function HeroSlideshow({ className = "" }: { className?: string }) {
  const { setIndex } = useContext(SlideContext);
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = box.current;
    const cv = canvas.current;
    if (!el || !cv || HERO_SLIDES.length < 2) return;
    const ctx = cv.getContext("2d")!;

    let cancelled = false;
    let images: HTMLImageElement[] = [];
    let caches: HTMLCanvasElement[] = [];
    let current = 0;
    let dpr = 1;
    // The photo box within the canvas, in canvas pixels.
    let bx = 0;
    let by = 0;
    let holdTimer: ReturnType<typeof setTimeout> | undefined;
    let frame = 0;
    let onScreen = true;
    let stopWaiting = () => {};
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const drawStill = (i: number) => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      if (caches[i]) ctx.drawImage(caches[i], bx, by);
    };

    // Size the canvas to the hero and re-render each slide at the photo box's pixel size.
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const c = cv.getBoundingClientRect();
      const b = el.getBoundingClientRect();
      cv.width = Math.max(1, Math.round(c.width * dpr));
      cv.height = Math.max(1, Math.round(c.height * dpr));
      bx = Math.round((b.left - c.left) * dpr);
      by = Math.round((b.top - c.top) * dpr);
      const bw = Math.max(1, Math.round(b.width * dpr));
      const bh = Math.max(1, Math.round(b.height * dpr));
      if (caches[0]?.width !== bw || caches[0]?.height !== bh) {
        caches = images.map((img) => coverCanvas(img, bw, bh));
      }
      drawStill(current);
    };

    const melt = () => {
      const { duration, stagger, stripHeight, step, acceleration, direction, loop } = HERO_MELT;
      const next = (current + 1) % HERO_SLIDES.length;
      if (!loop && next === 0) return;

      const from = caches[current];
      const to = caches[next];
      const bw = from.width;
      const bh = from.height;
      const sh = Math.max(1, Math.round(stripHeight * dpr));
      const snap = step > 0 ? Math.max(1, Math.round(step * dpr)) : 0;
      const rows = Math.ceil(bh / sh);
      const delays = meltDelays(rows, HERO_MELT);
      const total = stagger + duration;
      const sign = direction === "left" ? -1 : 1;
      // Distance for a strip to clear the hero's edge entirely, not just the photo's.
      const travel = direction === "left" ? bx + bw : cv.width - bx;
      let swapped = false;
      const start = performance.now();

      const tick = (now: number) => {
        const t = now - start;
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.drawImage(to, bx, by);
        for (let r = 0; r < rows; r++) {
          const p = Math.min(1, Math.max(0, (t - delays[r]) / duration));
          if (p >= 1) continue;
          let x = Math.pow(p, acceleration) * travel;
          if (snap) x = Math.round(x / snap) * snap;
          const y = r * sh;
          const h = Math.min(sh, bh - y);
          ctx.drawImage(from, 0, y, bw, h, bx + sign * x, by + y, bw, h);
        }
        // Swap the name card halfway through, when the new image is mostly revealed.
        if (!swapped && t >= total / 2) {
          swapped = true;
          setIndex(next);
        }
        if (t < total) {
          frame = requestAnimationFrame(tick);
        } else {
          current = next;
          drawStill(current);
          scheduleNext();
        }
      };
      frame = requestAnimationFrame(tick);
    };

    const scheduleNext = () => {
      clearTimeout(holdTimer);
      holdTimer = setTimeout(function wait() {
        // Don't spend frames melting while the hero is scrolled out of view.
        if (!onScreen || document.hidden) holdTimer = setTimeout(wait, 500);
        else melt();
      }, HERO_MELT.hold);
    };

    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting));
    io.observe(el);
    const ro = new ResizeObserver(resize);

    // Load every slide before starting, so a transition never reveals a half-loaded image.
    Promise.all(
      HERO_SLIDES.map(
        (s) =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new window.Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = asset(s.src);
          }),
      ),
    )
      .then((loaded) => {
        if (cancelled) return;
        images = loaded;
        resize();
        ro.observe(el);
        ro.observe(cv);
        setReady(true);
        // The first hold starts once the preloader has lifted, so the opening slide gets its full time.
        if (!reduceMotion) stopWaiting = onPreloaded(scheduleNext);
      })
      .catch(() => {
        // If an image fails, leave the static first slide in place.
      });

    return () => {
      cancelled = true;
      stopWaiting();
      clearTimeout(holdTimer);
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
    };
  }, [setIndex]);

  const first = HERO_SLIDES[0];
  return (
    <>
      <div ref={box} data-hero-photo aria-hidden className={`pointer-events-none ${className}`}>
        <Image
          src={asset(first.src)}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 89vw, 215vw"
          className={`object-cover ${ready ? "invisible" : ""}`}
        />
      </div>
      <canvas
        ref={canvas}
        aria-hidden
        className={`pointer-events-none absolute inset-0 size-full ${ready ? "" : "invisible"}`}
      />
    </>
  );
}
