"use client";

import Image from "next/image";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { asset } from "./asset";
import { HERO_MELT, HERO_SLIDES } from "./heroSlides.config";

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
 * Per-strip start delays as a random walk, so neighbouring strips move together and the melt
 * edge is jagged rather than noisy (the same idea as DOOM's column offsets).
 */
function stripDelays(count: number) {
  const { stagger, roughness } = HERO_MELT;
  const delays = new Array<number>(count);
  let d = Math.random() * stagger;
  for (let i = 0; i < count; i++) {
    d = Math.min(stagger, Math.max(0, d + (Math.random() * 2 - 1) * roughness * stagger));
    delays[i] = d;
  }
  return delays;
}

/**
 * Hero image slideshow with a sideways DOOM-style melt between images. All tuning lives in
 * heroSlides.config.ts. The first image is rendered as a normal <Image> (fast first paint and
 * no-JS fallback); the canvas takes over once every slide has loaded.
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
    let holdTimer: ReturnType<typeof setTimeout> | undefined;
    let frame = 0;
    let onScreen = true;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const drawStill = (i: number) => {
      if (caches[i]) ctx.drawImage(caches[i], 0, 0);
    };

    // Re-render each slide at the canvas's current pixel size.
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = el.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width * dpr));
      const h = Math.max(1, Math.round(r.height * dpr));
      if (cv.width === w && cv.height === h && caches.length) return;
      cv.width = w;
      cv.height = h;
      caches = images.map((img) => coverCanvas(img, w, h));
      drawStill(current);
    };

    const melt = () => {
      const { duration, stagger, stripHeight, step, acceleration, direction, loop } = HERO_MELT;
      const next = (current + 1) % HERO_SLIDES.length;
      if (!loop && next === 0) return;

      const W = cv.width;
      const sh = Math.max(1, Math.round(stripHeight * dpr));
      const snap = step > 0 ? Math.max(1, Math.round(step * dpr)) : 0;
      const rows = Math.ceil(cv.height / sh);
      const delays = stripDelays(rows);
      const total = stagger + duration;
      const sign = direction === "left" ? -1 : 1;
      const from = caches[current];
      const to = caches[next];
      let swapped = false;
      const start = performance.now();

      const tick = (now: number) => {
        const t = now - start;
        ctx.drawImage(to, 0, 0);
        for (let r = 0; r < rows; r++) {
          const p = Math.min(1, Math.max(0, (t - delays[r]) / duration));
          if (p >= 1) continue;
          let x = Math.pow(p, acceleration) * W;
          if (snap) x = Math.round(x / snap) * snap;
          const y = r * sh;
          const h = Math.min(sh, cv.height - y);
          ctx.drawImage(from, 0, y, W, h, sign * x, y, W, h);
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
        setReady(true);
        if (!reduceMotion) scheduleNext();
      })
      .catch(() => {
        // If an image fails, leave the static first slide in place.
      });

    return () => {
      cancelled = true;
      clearTimeout(holdTimer);
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
    };
  }, [setIndex]);

  const first = HERO_SLIDES[0];
  return (
    <div ref={box} aria-hidden className={`pointer-events-none ${className}`}>
      <Image
        src={asset(first.src)}
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 89vw, 215vw"
        className={`object-cover ${ready ? "invisible" : ""}`}
      />
      <canvas ref={canvas} className={`absolute inset-0 size-full ${ready ? "" : "invisible"}`} />
    </div>
  );
}
