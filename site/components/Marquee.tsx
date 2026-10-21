import { Fragment } from "react";

// Infinite horizontal loop: the track holds two identical copies and slides by -50%.
// Each copy's trailing spacing must equal the gap between items, so the seam is invisible —
// put that spacing on the items (e.g. pr-*), not as a flex gap on the track.
export default function Marquee({
  children,
  duration = 40,
  repeat = 1,
  className = "",
  label,
}: {
  children: React.ReactNode;
  /** Seconds for one copy to scroll past. */
  duration?: number;
  /** Repeat the children inside each copy, so short lists still fill wide screens. */
  repeat?: number;
  className?: string;
  label?: string;
}) {
  const copy = Array.from({ length: repeat }, (_, i) => <Fragment key={i}>{children}</Fragment>);

  return (
    <div className={`group min-w-0 overflow-x-clip ${className}`} role={label ? "region" : undefined} aria-label={label}>
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none"
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
