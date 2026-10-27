"use client";

import { useEffect, useState } from "react";

const ORIGIN = "https://player.vimeo.com";

/**
 * A Vimeo player URL with our options: "background" mode (autoplaying, muted, looping, no
 * controls), or with reduced motion the normal player, paused, to play by choice. Either way
 * without Vimeo's tracking.
 */
export function vimeoSrc(url: string, background: boolean) {
  const opts = background ? "background=1&dnt=1" : "dnt=1&title=0&byline=0&portrait=0";
  return `${url}${url.includes("?") ? "&" : "?"}${opts}`;
}

/** Whether the viewer has asked for reduced motion; false until mounted. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState<boolean | null>(null);
  useEffect(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  return reduced;
}

/**
 * True once a Vimeo player's video is showing: when it reports playing, through Vimeo's
 * postMessage API, or for a player that isn't autoplaying, once it's loaded. If the player never
 * reports in, it counts as showing a few seconds after loading anyway, so a video that is in fact
 * playing is never left hidden.
 */
export function useVimeoShowing(iframe: React.RefObject<HTMLIFrameElement | null>, autoplay: boolean) {
  const [loaded, setLoaded] = useState(false);
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const frame = iframe.current?.contentWindow;
      if (e.origin !== ORIGIN || !frame || e.source !== frame) return;
      let data = e.data;
      try {
        if (typeof data === "string") data = JSON.parse(data);
      } catch {
        return;
      }
      if (data?.event === "ready") {
        for (const value of ["play", "playing", "timeupdate", "playProgress"])
          frame.postMessage(JSON.stringify({ method: "addEventListener", value }), ORIGIN);
      } else if (["play", "playing", "timeupdate", "playProgress"].includes(data?.event)) {
        setShowing(true);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [iframe]);

  useEffect(() => {
    if (!loaded) return;
    if (!autoplay) return setShowing(true);
    const t = setTimeout(() => setShowing(true), 4000);
    return () => clearTimeout(t);
  }, [loaded, autoplay]);

  return { showing, onLoad: () => setLoaded(true) };
}
