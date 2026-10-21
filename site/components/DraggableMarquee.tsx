"use client";

import { Fragment, useEffect, useRef, useState } from "react";

// Feel of the grab-and-flick behaviour. Velocities are in px per millisecond.
const TUNING = {
  /** How long a flick takes to settle back to the cruising speed (ms). Higher = longer glide. */
  momentumDecay: 900,
  /** Fastest a flick can send the row (px/ms). */
  maxFlickSpeed: 6,
  /** Only the last this-many ms of the drag count towards the flick speed. */
  flickWindow: 100,
};

/**
 * Infinite horizontal loop the user can grab, drag and flick. Drives the position in JS
 * (instead of a CSS animation) so a release carries its momentum, which then decays back to
 * the cruising speed. Like Marquee, the track holds two identical copies and wraps by one
 * copy's width; put item spacing on the items (e.g. pr-*) so the seam is invisible.
 * Unlike Marquee it doesn't pause on hover: the cursor is always over the row after a mouse
 * flick, so pausing would kill the momentum. Grabbing it stops it instead.
 */
export default function DraggableMarquee({
  children,
  duration = 40,
  repeat = 1,
  className = "",
  label,
}: {
  children: React.ReactNode;
  /** Seconds for one copy to scroll past at cruising speed. */
  duration?: number;
  /** Repeat the children inside each copy, so short lists still fill wide screens. */
  repeat?: number;
  className?: string;
  label?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  // Shared between the frame loop and the pointer handlers.
  const state = useRef({
    x: 0,
    velocity: 0,
    copyWidth: 0,
    dragging: false,
    pointerId: -1,
    lastPointerX: 0,
    samples: [] as { t: number; x: number }[],
  });

  useEffect(() => {
    const rootEl = root.current;
    const trackEl = track.current;
    if (!rootEl || !trackEl) return;
    const s = state.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      s.copyWidth = (trackEl.firstElementChild as HTMLElement).getBoundingClientRect().width;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trackEl);

    // Cruising velocity: one copy per `duration` seconds, leftwards.
    const cruise = () => (reduceMotion || !s.copyWidth ? 0 : -s.copyWidth / (duration * 1000));
    s.velocity = cruise();

    let frame = 0;
    let last = performance.now();
    let onScreen = true;

    const tick = (now: number) => {
      const dt = Math.min(64, now - last); // don't jump after a stalled or hidden tab
      last = now;
      if (!s.dragging) {
        // Ease back towards the cruising speed. A flick starts far from it and decays back
        // exponentially, which reads as momentum.
        const target = cruise();
        s.velocity = target + (s.velocity - target) * Math.exp(-dt / TUNING.momentumDecay);
        s.x += s.velocity * dt;
      }
      if (s.copyWidth) {
        // Wrap into (-copyWidth, 0] so the two copies always cover the view.
        s.x = ((s.x % s.copyWidth) - s.copyWidth) % s.copyWidth;
      }
      trackEl.style.transform = `translate3d(${s.x}px, 0, 0)`;
      if (onScreen) frame = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([e]) => {
      const was = onScreen;
      onScreen = e.isIntersecting;
      if (onScreen && !was) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    });
    io.observe(rootEl);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
    };
  }, [duration]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const s = state.current;
    s.dragging = true;
    s.pointerId = e.pointerId;
    s.lastPointerX = e.clientX;
    s.samples = [{ t: performance.now(), x: s.x }];
    root.current?.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = state.current;
    if (!s.dragging || e.pointerId !== s.pointerId) return;
    s.x += e.clientX - s.lastPointerX;
    s.lastPointerX = e.clientX;
    const now = performance.now();
    s.samples.push({ t: now, x: s.x });
    while (s.samples.length > 2 && now - s.samples[0].t > TUNING.flickWindow) s.samples.shift();
  };

  const endDrag = (e: React.PointerEvent) => {
    const s = state.current;
    if (!s.dragging || e.pointerId !== s.pointerId) return;
    s.dragging = false;
    s.pointerId = -1;
    // Release speed from the recent samples becomes the starting momentum.
    const first = s.samples[0];
    const last = s.samples[s.samples.length - 1];
    const dt = last.t - first.t;
    const v = dt > 0 && performance.now() - last.t < TUNING.flickWindow ? (last.x - first.x) / dt : 0;
    s.velocity = Math.max(-TUNING.maxFlickSpeed, Math.min(TUNING.maxFlickSpeed, v));
    setDragging(false);
  };

  const copy = Array.from({ length: repeat }, (_, i) => <Fragment key={i}>{children}</Fragment>);

  return (
    <div
      ref={root}
      role={label ? "region" : undefined}
      aria-label={label}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      // pan-y: vertical swipes still scroll the page on touch; horizontal ones drag the row.
      className={`min-w-0 touch-pan-y overflow-x-clip select-none ${dragging ? "cursor-grabbing" : "cursor-grab"} ${className}`}
    >
      <div ref={track} className="flex w-max will-change-transform">
        <div className="flex shrink-0">{copy}</div>
        <div className="flex shrink-0" aria-hidden>
          {copy}
        </div>
      </div>
    </div>
  );
}
