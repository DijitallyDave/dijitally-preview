"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { asset } from "./asset";

const VIDEO_ID = "bPo0mWGIRCc"; // "Dijitally Recap on 2025 to date"
const YT_ORIGIN = "https://www.youtube-nocookie.com";

// Muted autoplay loop with every player control turned off. `playlist` must repeat the
// video ID for `loop` to work on a single video. `enablejsapi` lets the player tell us when
// it's actually playing (see below); `origin` is added at runtime.
const EMBED_PARAMS = {
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
  enablejsapi: "1",
};

// YouTube overlays its title, controls and logo for the first few seconds of playback (until
// its controls auto-hide), and playback often stutters as it starts. Reveal the video only once
// the player's own clock has reached this point — real playback, not wall-clock time.
const REVEAL_AT_S = 3.5;

// YT.PlayerState values
const UNSTARTED = -1;
const PLAYING = 1;
const PAUSED = 2;
const CUED = 5;

/**
 * Recent-work thumbnail: the Figma still as a poster, with the YouTube reel faded in on top
 * only once the player reports it's been playing steadily — so its loading frame, title bar
 * and pause overlay never show. If YouTube never plays (blocked, slow), the poster stays.
 * The iframe ignores the pointer so YouTube's hover UI never shows and clicks reach the card link.
 */
export default function HeroReel() {
  const frame = useRef<HTMLIFrameElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  // Skip the video entirely for people who've asked for reduced motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const params = new URLSearchParams({ ...EMBED_PARAMS, origin: window.location.origin });
    setSrc(`${YT_ORIGIN}/embed/${VIDEO_ID}?${params}`);
  }, []);

  // Listen for the player's state over the IFrame API's postMessage channel (no script needed).
  useEffect(() => {
    if (!src) return;
    // Latest player state and playback position, from onStateChange and the periodic
    // infoDelivery updates the player sends once we're listening.
    let state: number | undefined;
    let time = 0;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== YT_ORIGIN || e.source !== frame.current?.contentWindow) return;
      let data: { event?: string; info?: unknown };
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (data.event === "onStateChange" && typeof data.info === "number") {
        state = data.info;
      } else if (data.info && typeof data.info === "object") {
        const info = data.info as { playerState?: number; currentTime?: number };
        if (typeof info.playerState === "number") state = info.playerState;
        if (typeof info.currentTime === "number") time = info.currentTime;
      }

      if (state === PLAYING && time >= REVEAL_AT_S) {
        setVisible(true);
      } else if (state === PAUSED || state === UNSTARTED || state === CUED) {
        // Paused/stopped shows YouTube's overlay (pause icon, logo), so fall back to the poster.
        // Buffering and the end-of-loop restart (time back to 0) leave it showing, so the loop
        // doesn't flicker.
        setVisible(false);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [src]);

  // Once the iframe has loaded, ask it to start reporting its state to this page.
  const subscribe = () => {
    const win = frame.current?.contentWindow;
    if (!win) return;
    win.postMessage(JSON.stringify({ event: "listening", id: VIDEO_ID, channel: "widget" }), YT_ORIGIN);
    win.postMessage(
      JSON.stringify({ event: "command", func: "addEventListener", args: ["onStateChange"], id: VIDEO_ID }),
      YT_ORIGIN,
    );
  };

  return (
    // Greyscale on the wrapper so the poster and the video match the black-and-white hero.
    <span className="relative block h-[77px] w-[137px] lg:h-[201px] lg:w-[357px] overflow-hidden rounded-[3px] bg-ink grayscale">
      <Image
        src={asset("/figma/recent-work.png")}
        alt="Recent work: Constantinople banking website on a laptop"
        width={420}
        height={237}
        className="block h-[77px] w-[137px] lg:h-[201px] lg:w-[357px] object-cover"
      />
      {src && (
        <iframe
          ref={frame}
          src={src}
          title="Dijitally recap of 2025 to date"
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          tabIndex={-1}
          aria-hidden
          onLoad={subscribe}
          // Scaled up slightly so YouTube's watermark sits outside the frame.
          className={`pointer-events-none absolute left-1/2 top-1/2 h-[77px] w-[137px] lg:h-[201px] lg:w-[357px] -translate-x-1/2 -translate-y-1/2 scale-[1.2] border-0 transition-opacity duration-700 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </span>
  );
}
