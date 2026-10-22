"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { asset } from "./asset";
import { HERO_SLIDES } from "./heroSlides.config";
import { markPreloaded } from "./preloaded";

/**
 * Intro timings (seconds). The progress bar runs for the whole intro (rise, split and the
 * face flicks) and reaches the right edge just as the exit starts.
 */
export const PRELOADER = {
  /** The wordmark rising into place. */
  rise: 0.9,
  /** Pause before the wordmark splits. */
  beat: 0.15,
  /** DIJIT and ALLY sliding apart as the card opens between them. */
  split: 0.8,
  /** How long each ally's face shows. */
  flick: 0.13,
  /** The preloader lifting away to reveal the site. */
  exit: 0.9,
};

/*
 * Geometry, in the wordmark's own viewBox units (it's 215.856 × 30). DIJIT spans x 0–113.425
 * and ALLY 106.849–215.856 (the A tucks under the T). Opened, the 24 × 30 card (the 4:5 of the
 * hero name card's thumbnail) sits between them with 4 units either side, and the whole row
 * fills the space between the site margins. Everything is laid out in percentages of that
 * open width, so it scales with CSS alone, no measuring.
 */
const W = 215.856;
const DIJIT_W = 113.425;
const ALLY_X = 106.849;
const ALLY_W = W - ALLY_X;
const CARD_W = 24;
const PAD = 4;
// How far each half moves out: enough to open a gap of CARD_W + 2 × PAD past the overlap.
const SHIFT = (CARD_W + 2 * PAD + (DIJIT_W - ALLY_X)) / 2;
const OPEN_W = W + 2 * SHIFT;
const pct = (u: number) => `${(u / OPEN_W) * 100}%`;

function Dijit() {
  return (
    <svg viewBox={`0 0 ${DIJIT_W} 30`} fill="currentColor" className="block size-full" aria-hidden>
      <path d="M20.3573 0C29.1228 7.87558e-05 35.3573 5.97939 35.3573 14.3836V15.6164C35.3573 24.0206 29.1228 29.9999 20.3573 30H0V0H20.3573ZM7.00516 22.982H20.1117C24.8113 22.982 28.2723 20.0313 28.2723 15.6164V14.3836C28.2722 9.96871 24.8113 7.0718 20.1117 7.07178H7.00516V22.982Z" fillRule="evenodd" />
      <path d="M45.6164 30H38.6301V0H45.6164V30Z" />
      <path d="M70.6849 25.0685C70.6849 27.7921 68.477 30 65.7534 30H49.3151V23.0137H63.6986V0H70.6849V25.0685Z" />
      <path d="M81.3699 30H74.3836V0H81.3699V30Z" />
      <path d="M113.425 6.9863H102.74V30H95.7534V6.9863H85.0685V0H113.425V6.9863Z" />
    </svg>
  );
}

function Ally() {
  return (
    <svg viewBox={`${ALLY_X} 0 ${ALLY_W} 30`} fill="currentColor" className="block size-full" aria-hidden>
      <path d="M138.493 30H131.507V23.0137H118.581L114.658 30H106.849L123.699 0H138.493V30ZM122.505 16.0274H131.507V6.9863H127.583L122.505 16.0274Z" fillRule="evenodd" />
      <path d="M149.178 23.0137H163.562V30H142.192V0H149.178V23.0137Z" />
      <path d="M174.247 23.0137H188.63V30H167.26V0H174.247V23.0137Z" />
      <path d="M201.369 11.7075L207.945 0H215.753L198.904 30H191.096L197.465 18.6585L186.986 0H194.795L201.369 11.7075Z" />
      <path d="M210.668 27.1233H209.332V30H208.459V27.1233H207.123V26.25H210.668V27.1233Z" />
      <path d="M213.442 28.8109L214.88 26.25H215.856V30H214.88V27.9877L213.75 30H213.134L212.003 27.9877V30H211.027V26.25H212.003L213.442 28.8109Z" />
    </svg>
  );
}

/** Resolves once every face has loaded and decoded, or after `timeout` regardless. */
function loadFaces(timeout: number) {
  const all = Promise.all(
    HERO_SLIDES.map((s) => {
      const img = new window.Image();
      img.src = asset(s.src);
      return img.decode().catch(() => {});
    }),
  );
  return Promise.race([all, new Promise((r) => setTimeout(r, timeout))]);
}

/**
 * Intro over a #040404 screen: a progress bar runs across the top while the wordmark rises,
 * splits into DIJIT and ALLY around a card that flicks through every ally's face, then the
 * whole thing lifts away to the site.
 *
 * Only transforms and a small clip-path are animated, the faces swap by visibility (no
 * blending), and the element is removed from the page once it's done. It's server-rendered
 * so it covers the page from the first paint; without JS, or with reduced motion, CSS hides it.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      markPreloaded();
      setDone(true);
      return;
    }

    const html = document.documentElement;
    html.style.overflow = "hidden";
    const faces = loadFaces(2500);

    const ctx = gsap.context(() => {
      const { rise, beat, split, flick, exit } = PRELOADER;
      const q = gsap.utils.selector(el);
      const faceEls = q("[data-face]");
      // GSAP writes the whole transform, so start from its own values rather than the inline CSS.
      gsap.set(q("[data-piece]"), { y: 0, yPercent: 101 });
      gsap.set(q("[data-bar]"), { scaleX: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          html.style.overflow = "";
          setDone(true);
        },
      });

      tl.to(q("[data-piece]"), { yPercent: 0, duration: rise, ease: "expo.out", stagger: 0.06 }, 0.1);

      // The card shows faces from here on, so hold (bar and all) until they've loaded.
      const splitAt = tl.duration() + beat;
      tl.addPause(splitAt, () => void faces.then(() => tl.resume()));
      tl.to(q("[data-dijit]"), { xPercent: (-SHIFT / DIJIT_W) * 100, duration: split, ease: "expo.inOut" }, splitAt);
      tl.to(q("[data-ally]"), { xPercent: (SHIFT / ALLY_W) * 100, duration: split, ease: "expo.inOut" }, splitAt);
      tl.to(q("[data-card]"), { clipPath: "inset(0% 0% 0% 0%)", duration: split, ease: "expo.inOut" }, splitAt);

      // Each face is stacked above the last, so showing the next one covers the previous.
      const flickAt = splitAt + split * 0.6;
      faceEls.slice(1).forEach((f, i) => tl.set(f, { visibility: "visible" }, flickAt + (i + 1) * flick));

      const exitAt = flickAt + faceEls.length * flick;
      tl.to(q("[data-bar]"), { scaleX: 1, duration: exitAt, ease: "none" }, 0);
      tl.to(el, { yPercent: -100, duration: exit, ease: "expo.inOut" }, exitAt);
      // Start the hero's own intro as the curtain clears it.
      tl.call(markPreloaded, [], exitAt + exit * 0.4);
    }, el);

    return () => {
      ctx.revert();
      html.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      aria-hidden
      className="preloader fixed inset-0 z-[100] flex items-center bg-ink px-6 lg:px-[42px]"
    >
      {/* Progress bar: Figma "Primary" (light), 6px on desktop and half that on mobile */}
      <div
        data-bar
        className="absolute inset-x-0 top-0 h-[3px] origin-left bg-snow lg:h-[6px]"
        style={{ transform: "scaleX(0)" }}
      />

      <div className="relative w-full overflow-hidden text-snow" style={{ aspectRatio: `${OPEN_W} / 30` }}>
        <div
          data-card
          className="absolute inset-y-0 overflow-hidden rounded-[6.25%/5%] bg-ink"
          style={{ left: pct(DIJIT_W + PAD), width: pct(CARD_W), clipPath: "inset(0% 50% 0% 50%)" }}
        >
          {HERO_SLIDES.map((s, i) => (
            <div
              key={s.src}
              data-face
              className="absolute inset-0 bg-no-repeat"
              // Same face crop as the hero name card's thumbnail.
              style={{
                backgroundImage: `url(${asset(s.src)})`,
                backgroundSize: "204.69% 92.11%",
                backgroundPosition: "50% 143.7%",
                visibility: i === 0 ? "visible" : "hidden",
              }}
            />
          ))}
        </div>

        <div data-dijit className="absolute inset-y-0" style={{ left: pct(SHIFT), width: pct(DIJIT_W) }}>
          <div data-piece className="size-full" style={{ transform: "translateY(101%)" }}>
            <Dijit />
          </div>
        </div>
        <div data-ally className="absolute inset-y-0" style={{ left: pct(SHIFT + ALLY_X), width: pct(ALLY_W) }}>
          <div data-piece className="size-full" style={{ transform: "translateY(101%)" }}>
            <Ally />
          </div>
        </div>
      </div>
    </div>
  );
}
