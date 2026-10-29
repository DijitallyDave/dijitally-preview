"use client";

import Image from "next/image";
import { useRef } from "react";
import { useReducedMotion, useVimeoShowing, vimeoSrc } from "./vimeo";

/**
 * A blurred Vimeo video filling its box behind a case study's sheet, in Vimeo's "background"
 * mode (autoplaying, muted, looping, no controls), fading in over a solid fill once it's playing.
 * With reduced motion, the hero image instead, still and blurred the same way.
 */
export default function HeroVideo({
  vimeo,
  poster,
  mono = false,
  aspect = 16 / 9,
}: {
  vimeo: string;
  poster: string;
  mono?: boolean;
  /** The video's width over its height. */
  aspect?: number;
}) {
  // `mono` desaturates it to greys.
  const grey = mono ? "grayscale" : "";
  const reduced = useReducedMotion();
  const frame = useRef<HTMLIFrameElement>(null);
  const { showing, onLoad } = useVimeoShowing(frame, true);

  if (reduced)
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -inset-12 blur-[24px] ${grey}`}>
          <Image src={poster} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
      </div>
    );

  return (
    <div className={`absolute inset-0 overflow-hidden ${showing ? "" : "bg-ui"}`}>
      {/* Larger than the box, so the blur's soft edges fall outside it. A size container, so the
          player can cover it whatever its shape, like object-fit: cover. */}
      {reduced === false && (
        <div className={`absolute -inset-12 blur-[24px] [container-type:size] ${grey}`}>
          <iframe
            ref={frame}
            src={vimeoSrc(vimeo, true)}
            title=""
            tabIndex={-1}
            allow="autoplay"
            onLoad={onLoad}
            style={{ "--ar": aspect } as React.CSSProperties}
            className={`pointer-events-none absolute left-1/2 top-1/2 h-[max(100cqh,calc(100cqw/var(--ar)))] w-[max(100cqw,calc(100cqh*var(--ar)))] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 ${
              showing ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      )}
    </div>
  );
}
