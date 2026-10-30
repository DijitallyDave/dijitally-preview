"use client";

import { useEffect, useRef, useState } from "react";
import { WIDESCREEN_VIDEOS } from "./case/studies";
import type { CaseVideo } from "./case/CaseHero";
import { useReducedMotion, useVimeoShowing, vimeoSrc } from "./case/vimeo";

const ORIGIN = "https://player.vimeo.com";

/**
 * Recent-work thumbnail: the case studies' 16:9 videos one after another, in an order shuffled on
 * each visit and starting over after the last, muted with no controls (Vimeo's background mode).
 * The next video loads in advance, paused on its first frame, and starts over the one ending,
 * which stays underneath until it's covered, so there's never black between them. The first
 * fades in over black once Vimeo reports it's playing. With reduced motion there's no video,
 * just the black. The iframes ignore the pointer so clicks reach the card link.
 */
export default function HeroReel() {
  const reduced = useReducedMotion();
  // Shuffled in the browser, so the static page doesn't fix one order for every visit.
  const [queue, setQueue] = useState<CaseVideo[]>([]);
  const [at, setAt] = useState(0);
  // The one that just ended, kept underneath for the second the next takes to cover it.
  const [previous, setPrevious] = useState<number | null>(null);
  useEffect(() => {
    if (previous === null) return;
    const t = setTimeout(() => setPrevious(null), 1000);
    return () => clearTimeout(t);
  }, [previous]);
  useEffect(() => {
    const q = [...WIDESCREEN_VIDEOS];
    for (let i = q.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [q[i], q[j]] = [q[j], q[i]];
    }
    setQueue(q);
  }, []);

  const n = queue.length;
  // The one playing, the one just ended (if still underneath) and the one waiting, by queue position.
  const roles = new Map<number, Role>();
  if (n) {
    roles.set((at + 1) % n, "next");
    if (previous !== null) roles.set(previous, "previous");
    roles.set(at, "playing");
  }

  return (
    // Greyscale so the video matches the black-and-white hero.
    <span className="relative block h-[77px] w-[137px] lg:h-[201px] lg:w-[357px] overflow-hidden rounded-[3px] bg-ink grayscale">
      {reduced === false &&
        [...roles].map(([i, role]) => (
          <ReelClip
            key={i}
            video={queue[i]}
            role={role}
            // With one video it simply loops.
            onEnd={
              n > 1
                ? () => {
                    setPrevious(at);
                    setAt((at + 1) % n);
                  }
                : undefined
            }
          />
        ))}
    </span>
  );
}

type Role = "playing" | "previous" | "next";

function ReelClip({ video, role, onEnd }: { video: CaseVideo; role: Role; onEnd?: () => void }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const { showing, onLoad } = useVimeoShowing(frame, true, role === "playing" ? onEnd : undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== ORIGIN || e.source !== frame.current?.contentWindow) return;
      try {
        if (JSON.parse(e.data)?.event === "ready") setReady(true);
      } catch {}
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Waiting: held on its first frame. Playing: started from there.
  useEffect(() => {
    const player = frame.current?.contentWindow;
    if (!ready || !player || role === "previous") return;
    const send = (method: string, value?: number) => player.postMessage(JSON.stringify({ method, value }), ORIGIN);
    if (role === "next") {
      send("pause");
      send("setCurrentTime", 0);
    } else send("play");
  }, [ready, role]);

  return (
    <iframe
      ref={frame}
      src={vimeoSrc(video.vimeo, true)}
      title={video.alt}
      allow="autoplay"
      tabIndex={-1}
      aria-hidden={role !== "playing"}
      onLoad={onLoad}
      // A touch over the frame, so its edges never show a sliver of the black. The one playing
      // on top, over the one it follows.
      className={`pointer-events-none absolute inset-0 size-full scale-[1.02] border-0 transition-opacity duration-700 ${
        role === "playing" ? "z-[2]" : role === "previous" ? "z-[1]" : ""
      } ${role === "next" || !showing ? "opacity-0" : "opacity-100"}`}
    />
  );
}
