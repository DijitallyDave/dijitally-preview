"use client";

import { useRef } from "react";
import { AFTERPAY_APD } from "./case/studies";
import { useReducedMotion, useVimeoShowing, vimeoSrc } from "./case/vimeo";

/**
 * Recent-work thumbnail: the Afterpay Day spot (the first video on the Afterpay case study),
 * muted and looping with no controls (Vimeo's background mode), fading in over black once
 * Vimeo reports it's playing. With reduced motion there's no video, just the black. The iframe
 * ignores the pointer so clicks reach the card link.
 */
export default function HeroReel() {
  const reduced = useReducedMotion();
  const frame = useRef<HTMLIFrameElement>(null);
  const { showing, onLoad } = useVimeoShowing(frame, true);

  return (
    // Greyscale so the video matches the black-and-white hero.
    <span className="relative block h-[77px] w-[137px] lg:h-[201px] lg:w-[357px] overflow-hidden rounded-[3px] bg-ink grayscale">
      {reduced === false && (
        <iframe
          ref={frame}
          src={vimeoSrc(AFTERPAY_APD, true)}
          title="Afterpay Day video, 15 seconds"
          allow="autoplay"
          tabIndex={-1}
          aria-hidden
          onLoad={onLoad}
          // A touch over the frame, so its edges never show a sliver of the black.
          className={`pointer-events-none absolute inset-0 size-full scale-[1.02] border-0 transition-opacity duration-700 ${
            showing ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </span>
  );
}
