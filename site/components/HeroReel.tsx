"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const VIDEO_ID = "bPo0mWGIRCc"; // "Dijitally Recap on 2025 to date"

// Muted autoplay loop with every player control turned off. `playlist` must repeat the
// video ID for `loop` to work on a single video.
const EMBED_SRC =
  `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?` +
  new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: VIDEO_ID,
    controls: "0",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3",
    rel: "0",
    playsinline: "1",
  }).toString();

// YouTube paints a black frame before playback starts; hold the poster until it's going.
const FADE_IN_DELAY = 900;

/**
 * Recent-work thumbnail: the Figma still as a poster, with the YouTube reel faded in on top.
 * The iframe ignores the pointer so YouTube's hover UI never shows and clicks reach the card link.
 */
export default function HeroReel() {
  const [play, setPlay] = useState(false);
  const [visible, setVisible] = useState(false);

  // Skip the video entirely for people who've asked for reduced motion.
  useEffect(() => {
    setPlay(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    // Greyscale on the wrapper so the poster and the video match the black-and-white hero.
    <span className="relative block h-[77px] w-[137px] lg:h-[201px] lg:w-[357px] overflow-hidden rounded-[3px] bg-ink grayscale">
      <Image
        src="/figma/recent-work.png"
        alt="Recent work: Constantinople banking website on a laptop"
        width={420}
        height={237}
        className="block h-[77px] w-[137px] lg:h-[201px] lg:w-[357px] object-cover"
      />
      {play && (
        <iframe
          src={EMBED_SRC}
          title="Dijitally recap of 2025 to date"
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          tabIndex={-1}
          aria-hidden
          onLoad={() => setTimeout(() => setVisible(true), FADE_IN_DELAY)}
          // Scaled up slightly so YouTube's title bar and watermark sit outside the frame.
          className={`pointer-events-none absolute left-1/2 top-1/2 h-[77px] w-[137px] lg:h-[201px] lg:w-[357px] -translate-x-1/2 -translate-y-1/2 scale-[1.2] border-0 transition-opacity duration-700 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </span>
  );
}
