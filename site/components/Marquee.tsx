"use client";

import { Fragment, useEffect, useRef } from "react";

// Infinite horizontal loop: the track holds two identical copies and slides by -50%.
// Each copy's trailing spacing must equal the gap between items, so the seam is invisible —
// put that spacing on the items (e.g. pr-*), not as a flex gap on the track.
export default function Marquee({
  children,
  duration = 40,
  repeat = 1,
  className = "",
  label,
  sync = false,
}: {
  children: React.ReactNode;
  /** Seconds for one copy to scroll past. */
  duration?: number;
  /** Repeat the children inside each copy, so short lists still fill wide screens. */
  repeat?: number;
  className?: string;
  label?: string;
  /**
   * Run on the page's clock rather than from when this mounted, so every synced marquee of the
   * same size is at the same point (for a match cut between two). It doesn't pause on hover.
   */
  sync?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sync) return;
    const run = track.current?.getAnimations()[0];
    if (run) run.currentTime = performance.now() % (duration * 1000);
  }, [sync, duration]);
  const copy = Array.from({ length: repeat }, (_, i) => <Fragment key={i}>{children}</Fragment>);

  return (
    <div className={`group min-w-0 overflow-x-clip ${className}`} role={label ? "region" : undefined} aria-label={label}>
      <div
        ref={track}
        className={`flex w-max animate-marquee motion-reduce:animate-none ${sync ? "" : "group-hover:[animation-play-state:paused]"}`}
        style={{ animationDuration: `${duration}s` }}
      >
        <div className="flex shrink-0">{copy}</div>
        <div className="flex shrink-0" aria-hidden>
          {copy}
        </div>
      </div>
    </div>
  );
}
