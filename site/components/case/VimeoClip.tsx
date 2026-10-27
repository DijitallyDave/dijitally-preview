"use client";

import { useRef } from "react";
import { useReducedMotion, useVimeoShowing, vimeoSrc } from "./vimeo";
import type { CaseVideo } from "./CaseHero";

/**
 * A gallery video hosted on Vimeo, in its "background" mode: autoplaying, muted and looping with
 * no controls, like an image that moves. Until it's playing the frame holds a solid fill with a
 * spinner, and the video fades in over it; the fill then goes. With reduced motion it's the
 * normal Vimeo player, paused on its poster frame, to play by choice.
 */
export default function VimeoClip({ vimeo, alt, width, height }: CaseVideo) {
  const reduced = useReducedMotion();
  const frame = useRef<HTMLIFrameElement>(null);
  const { showing, onLoad } = useVimeoShowing(frame, reduced === false);

  // Portrait videos would fill a phone screen at full width, so on mobile they're half width,
  // centred in a container in the cards' colour. On desktop the container drops away
  // (display: contents) and they sit in the row at full height like everything else.
  const portrait = height > width;

  return (
    <div className={portrait ? "rounded-[4px] bg-ui py-6 lg:contents" : "contents"}>
      <div
        style={{ aspectRatio: `${width} / ${height}` }}
        // The fill is only for loading: once the video's showing it goes, so nothing but the video
        // can ever show at its edges.
        className={`relative overflow-hidden rounded-[4px] lg:rounded-[8px] ${portrait ? "mx-auto w-1/2 lg:w-full" : "w-full"} ${
          showing ? "" : "bg-ui"
        }`}
      >
        {!showing && (
          <span
            role="status"
            aria-label="Loading video"
            className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-static/30 border-t-static motion-reduce:animate-none"
          />
        )}
        {/* Scaled up a hair in background mode: at fractional widths the player can fall a
            sub-pixel short of the frame and leave a sliver of the fill down one edge. */}
        {reduced !== null && (
          <iframe
            ref={frame}
            src={vimeoSrc(vimeo, !reduced)}
            title={alt}
            allow="autoplay; fullscreen; picture-in-picture"
            loading="lazy"
            onLoad={onLoad}
            className={`absolute inset-0 size-full transition-opacity duration-500 ${reduced ? "" : "scale-[1.02]"} ${
              showing ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>
    </div>
  );
}
