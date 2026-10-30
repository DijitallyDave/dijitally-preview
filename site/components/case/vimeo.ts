"use client";

import { useEffect, useRef, useState } from "react";

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
 * playing is never left hidden. `onEnd`, if given, is called when an autoplaying video reaches
 * its end, instead of it looping.
 */
export function useVimeoShowing(
  iframe: React.RefObject<HTMLIFrameElement | null>,
  autoplay: boolean,
  onEnd?: () => void,
) {
  const [loaded, setLoaded] = useState(false);
  const [showing, setShowing] = useState(false);
  const ended = useRef(onEnd);
  ended.current = onEnd;
  // `onEnd` fires once each time it's handed in, so a player can be ended, set aside and reused.
  const fired = useRef(false);
  const ending = !!onEnd;
  useEffect(() => {
    if (ending) fired.current = false;
  }, [ending]);

  // Some videos play a few milliseconds past the duration Vimeo reports and then sit on their
  // last frame, never looping. So an autoplaying video that reaches its end, or stalls within a
  // second of it, is sent back to the start (or handed to `onEnd`, once).
  useEffect(() => {
    if (!autoplay) return;
    let seconds = 0;
    let duration = 0;
    let moved = 0;
    const restart = () => {
      moved = performance.now();
      if (ended.current) {
        if (!fired.current) ended.current();
        fired.current = true;
        return;
      }
      iframe.current?.contentWindow?.postMessage(JSON.stringify({ method: "setCurrentTime", value: 0 }), ORIGIN);
    };
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== ORIGIN || e.source !== iframe.current?.contentWindow) return;
      let data = e.data;
      try {
        if (typeof data === "string") data = JSON.parse(data);
      } catch {
        return;
      }
      if (data?.event !== "timeupdate" && data?.event !== "playProgress") return;
      const s = data.data?.seconds;
      if (typeof s !== "number") return;
      duration = data.data.duration || duration;
      // Vimeo looping back on its own from near the end counts as reaching it.
      if (ended.current && duration && s < seconds && seconds >= duration - 1) return restart();
      if (s !== seconds) moved = performance.now();
      seconds = s;
      if (duration && seconds >= duration - 0.05) restart();
    };
    const stall = setInterval(() => {
      if (duration && seconds >= duration - 1 && performance.now() - moved > 1500) restart();
    }, 1000);
    window.addEventListener("message", onMessage);
    return () => {
      clearInterval(stall);
      window.removeEventListener("message", onMessage);
    };
  }, [iframe, autoplay]);

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
