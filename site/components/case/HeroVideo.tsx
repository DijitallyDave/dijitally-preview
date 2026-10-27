"use client";

import { useEffect, useRef } from "react";

/**
 * A muted, looping background video filling its box, with the hero image as its poster. With
 * reduced motion it stays paused on its first frame.
 */
export default function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) el.pause();
    // React doesn't reliably set the muted attribute, which browsers need before they'll autoplay.
    else {
      el.muted = true;
      el.play().catch(() => {});
    }
  }, []);

  return (
    <video
      ref={video}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-hidden
      className="absolute inset-0 size-full object-cover"
    />
  );
}
