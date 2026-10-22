"use client";

import { useEffect, useRef, useState } from "react";
import { meltDelays } from "./melt";

/**
 * Work thumbnail reveal: a cover in the image's most-used colour melts away to the left in
 * horizontal strips, the same DOOM-style melt as the hero.
 */
export const WORK_REVEAL = {
  /** Delay between one card's reveal and the next along the carousel (ms). */
  cardStagger: 140,
  /** How long one strip takes to slide out once it starts moving (ms). */
  duration: 700,
  /** Spread of the strips' start times (ms). */
  stagger: 450,
  /** How jagged the melt edge is (see heroSlides.config.ts). */
  roughness: 0.3,
  /** Strip height in CSS pixels. */
  stripHeight: 2,
  /** Horizontal movement snaps to this many CSS pixels. */
  step: 6,
  /** 1 = constant speed; 2+ = strips start slowly and accelerate away. */
  acceleration: 2.2,
};

/**
 * The image's most-used colour: shrink it to 32×32, bucket the opaque pixels into 512 colours
 * (3 bits per channel) and average the fullest bucket. Returns null if the canvas can't be read.
 */
export function dominantColour(img: HTMLImageElement) {
  try {
    const size = 32;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d", { willReadFrequently: true })!;
    ctx.drawImage(img, 0, 0, size, size);
    const d = ctx.getImageData(0, 0, size, size).data;
    const buckets = new Map<number, [number, number, number, number]>();
    let best: [number, number, number, number] | undefined;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 128) continue;
      const key = ((d[i] >> 5) << 6) | ((d[i + 1] >> 5) << 3) | (d[i + 2] >> 5);
      const b = buckets.get(key) ?? [0, 0, 0, 0];
      b[0]++;
      b[1] += d[i];
      b[2] += d[i + 1];
      b[3] += d[i + 2];
      buckets.set(key, b);
      if (!best || b[0] > best[0]) best = b;
    }
    if (!best) return null;
    const [n, r, g, b] = best;
    return `rgb(${Math.round(r / n)} ${Math.round(g / n)} ${Math.round(b / n)})`;
  } catch {
    return null;
  }
}

/**
 * Cover that sits over a thumbnail until it's revealed. Before the image has loaded it shows
 * the UI colour; then it fills with `color` and, once the carousel has come into view
 * (`startAt`) plus `order` × cardStagger, melts away the next time this card is on screen.
 *
 * Kept cheap: the canvas is only (width / step) × (height / stripHeight) pixels, stretched up
 * with pixelated scaling, so each frame is a few hundred solid fillRects on a tiny bitmap.
 * Nothing is drawn before or after the reveal, and the canvas is removed once it's done.
 */
export default function PixelReveal({
  color,
  order,
  startAt,
}: {
  color: string | null;
  order: number;
  startAt: number | null;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setDone(true);
  }, []);

  useEffect(() => {
    const cv = ref.current;
    if (!cv || done || !color || startAt === null) return;
    const due = startAt + order * WORK_REVEAL.cardStagger;
    let visible = false;
    let started = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let frame = 0;

    const play = () => {
      const { duration, step, stripHeight, acceleration } = WORK_REVEAL;
      const r = cv.getBoundingClientRect();
      const w = (cv.width = Math.max(1, Math.ceil(r.width / step)));
      const h = (cv.height = Math.max(1, Math.ceil(r.height / stripHeight)));
      const ctx = cv.getContext("2d")!;
      const delays = meltDelays(h, WORK_REVEAL);
      const start = performance.now();

      const tick = (now: number) => {
        const t = now - start;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = color;
        let remaining = false;
        for (let y = 0; y < h; y++) {
          const p = Math.min(1, Math.max(0, (t - delays[y]) / duration));
          if (p >= 1) continue;
          remaining = true;
          ctx.fillRect(0, y, w - Math.round(Math.pow(p, acceleration) * w), 1);
        }
        // The canvas now draws the cover itself, so drop the solid CSS fill under it.
        cv.style.backgroundColor = "transparent";
        if (remaining) frame = requestAnimationFrame(tick);
        else setDone(true);
      };
      frame = requestAnimationFrame(tick);
    };

    // Wait for both this card's turn in the stagger and for it to be on screen.
    const tryStart = () => {
      if (started || !visible) return;
      const wait = due - performance.now();
      clearTimeout(timer);
      if (wait > 0) {
        timer = setTimeout(tryStart, wait);
        return;
      }
      started = true;
      io.disconnect();
      play();
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        tryStart();
      },
      { threshold: 0.25 },
    );
    io.observe(cv);

    return () => {
      io.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [color, order, startAt, done]);

  if (done) return null;
  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pixel-reveal pointer-events-none absolute inset-0 z-10 size-full transition-[background-color] duration-300 [image-rendering:pixelated]"
      style={{ backgroundColor: color ?? "var(--ui)" }}
    />
  );
}
