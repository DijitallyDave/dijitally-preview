"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { asset } from "./asset";
import { HERO_SLIDES } from "./heroSlides.config";
import { markPreloaded } from "./preloaded";
import { SKIP_INTRO_KEY } from "./theme";

/**
 * Intro timings (seconds). The progress bar runs through the rise, the split and one pass of
 * the faces, then sits full for `hold` while the faces keep cycling, before the exit.
 */
export const PRELOADER = {
  /** The wordmark rising into place. */
  rise: 0.9,
  /** Pause before the wordmark splits. */
  beat: 0.15,
  /** DIJIT and ALLY sliding apart as the card's mask opens between them. */
  split: 0.8,
  /** The faces start at this scale inside the card and ease up to full size. */
  faceScale: 0.85,
  /** How long each ally's face shows. */
  flick: 0.13,
  /** Pause once the bar is full, before the site is revealed. */
  hold: 0.4,
  /** The card (on Zara) expanding into the hero photo. */
  exit: 1.1,
  /** The preloader fading off the hero once the photo is in place. */
  fade: 0.4,
};

/*
 * Geometry, in the wordmark's own viewBox units (it's 215.856 × 30). DIJIT spans x 0–113.425
 * and ALLY 106.849–215.856 (the A tucks under the T). Opened, the 24 × 30 card (the 4:5 of the
 * hero name card's thumbnail) sits between them with 4 units either side, and the whole row
 * fills the space between the site margins. Everything is laid out in percentages of that
 * open width, so it scales with CSS alone, no measuring.
 */
export const W = 215.856;
export const DIJIT_W = 113.425;
export const ALLY_X = 106.849;
export const ALLY_W = W - ALLY_X;
const CARD_W = 24;
const PAD = 4;
// How far each half moves out: enough to open a gap of CARD_W + 2 × PAD past the overlap.
const SHIFT = (CARD_W + 2 * PAD + (DIJIT_W - ALLY_X)) / 2;
export const OPEN_W = W + 2 * SHIFT;
const pct = (u: number) => `${(u / OPEN_W) * 100}%`;
/** Card corner radius as a fraction of its width (rounded-[6.25%/5%] on a 4:5 card). */
const CARD_RADIUS = 0.0625;

/**
 * The faces' crop inside the card: the hero name card's crop, 25% closer in and nudged up so
 * the head sits nearer the top. Sizes are of the card's width/height (they keep the photos'
 * 16:9 because the card is 4:5); y is the background-position. Also used to line the card up
 * with the hero photo for the exit.
 */
const FACE_CROP = { w: 2.5586, h: 1.1514, y: 0.766 };

/** Glow behind the card: its diameter, and the colours at its centre and edge. */
const GLOW = {
  // In wordmark units, so it scales with the card: 78 is ~100px on a 375px-wide phone.
  size: 78,
  // Figma "UI" (light) fading to the preloader's background, so the circle has no hard edge.
  center: "#f6f6f6",
  edge: "#040404",
  opacity: 0.07,
};

// Static grey noise, rasterised once by the browser and tiled over the glow.
const NOISE = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`;

export function Dijit() {
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

export function Ally() {
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

/**
 * Starts loading every face. `ready` resolves once they've all decoded, or after `timeout`
 * regardless; `images` gives their natural sizes for lining the card up with the hero.
 */
function loadFaces(timeout: number) {
  const images = HERO_SLIDES.map((s) => {
    const img = new window.Image();
    img.src = asset(s.src);
    return img;
  });
  const all = Promise.all(images.map((img) => img.decode().catch(() => {})));
  return { images, ready: Promise.race([all, new Promise((r) => setTimeout(r, timeout))]) };
}

/**
 * Where the expander (a hero-photo-sized copy of the first slide) must start so that it shows
 * exactly what the card shows: the transform that maps the hero photo onto the card's crop of
 * the same image, and the clip (in the expander's own pixels) that trims it to the card.
 * Returns null if the hero photo isn't on screen, e.g. after a reload part-way down the page.
 */
function measureExpand(card: Element, img: HTMLImageElement) {
  const box = document.querySelector("[data-hero-photo]");
  if (!box) return null;
  const b = box.getBoundingClientRect();
  if (b.bottom <= 0 || b.top >= window.innerHeight) return null;
  const c = card.getBoundingClientRect();
  const iw = img.naturalWidth || 2720;
  const ih = img.naturalHeight || 1530;

  // The hero draws the photo like object-fit: cover, centred in its box.
  const s = Math.max(b.width / iw, b.height / ih);
  const hx = (b.width - iw * s) / 2;
  const hy = (b.height - ih * s) / 2;
  // The card draws it at FACE_CROP's size and position.
  const cw = c.width * FACE_CROP.w;
  const cx = (c.width - cw) * 0.5;
  const cy = (c.height - c.height * FACE_CROP.h) * FACE_CROP.y;

  const k = cw / iw / s;
  const x = c.left + cx - b.left - k * hx;
  const y = c.top + cy - b.top - k * hy;
  const left = (c.left - b.left - x) / k;
  const top = (c.top - b.top - y) / k;
  const right = b.width - left - c.width / k;
  const bottom = b.height - top - c.height / k;
  const r = (CARD_RADIUS * c.width) / k;
  return {
    rect: { left: b.left, top: b.top, width: b.width, height: b.height },
    from: { x, y, scale: k, clipPath: `inset(${top}px ${right}px ${bottom}px ${left}px round ${r}px)` },
  };
}

/**
 * Intro over a #040404 screen: a progress bar runs across the top while the wordmark rises,
 * splits into DIJIT and ALLY around a card that flicks through every ally's face, then the
 * card lands on Zara and expands into the hero photo.
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
    // Coming back to the homepage from a case study goes straight to the page; arriving
    // fresh, or reloading it, plays the intro. The flag is used once, then cleared.
    // The head script marks a return from a case study (see theme.ts); a client-side back
    // navigation only has the flag.
    const html = document.documentElement;
    let skip = html.dataset.skipIntro !== undefined;
    delete html.dataset.skipIntro;
    try {
      skip ||= sessionStorage.getItem(SKIP_INTRO_KEY) !== null;
      sessionStorage.removeItem(SKIP_INTRO_KEY);
    } catch {
      // Storage blocked: go by the head script alone.
    }
    if (skip || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      markPreloaded();
      setDone(true);
      return;
    }

    html.style.overflow = "hidden";
    const faces = loadFaces(2500);

    const ctx = gsap.context(() => {
      const { rise, beat, split, faceScale, flick, hold, exit, fade } = PRELOADER;
      const q = gsap.utils.selector(el);
      const faceEls = q("[data-face]");
      // GSAP writes the whole transform, so start from its own values rather than the inline CSS.
      gsap.set(q("[data-piece]"), { y: 0, yPercent: 101 });
      gsap.set(q("[data-bar]"), { scaleX: 0 });
      gsap.set(q("[data-faces]"), { scale: faceScale });

      const tl = gsap.timeline({
        onComplete: () => {
          html.style.overflow = "";
          setDone(true);
        },
      });

      tl.to(q("[data-piece]"), { yPercent: 0, duration: rise, ease: "expo.out", stagger: 0.06 }, 0.1);

      // The card shows faces from here on, so hold (bar and all) until they've loaded.
      const splitAt = tl.duration() + beat;
      tl.addPause(splitAt, () => void faces.ready.then(() => tl.resume()));
      tl.to(q("[data-dijit]"), { xPercent: (-SHIFT / DIJIT_W) * 100, duration: split, ease: "expo.inOut" }, splitAt);
      tl.to(q("[data-ally]"), { xPercent: (SHIFT / ALLY_W) * 100, duration: split, ease: "expo.inOut" }, splitAt);
      // The mask grows from the centre to the full card in step with the split. Both ends are
      // given explicitly: the browser collapses the inline "inset(50% 50% 50% 50%)" to
      // "inset(50%)", which GSAP would then interpolate as a single value.
      tl.fromTo(
        q("[data-card]"),
        { clipPath: "inset(50% 50% 50% 50%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: split, ease: "expo.inOut", immediateRender: false },
        splitAt,
      );
      tl.to(q("[data-glow]"), { opacity: GLOW.opacity, duration: split, ease: "power2.out" }, splitAt + split * 0.3);

      // The bar fills after one pass through the faces, then a beat before the site comes in.
      const flickAt = splitAt + split * 0.6;
      const barEnd = flickAt + faceEls.length * flick;
      const exitAt = barEnd + hold;
      tl.to(q("[data-bar]"), { scaleX: 1, duration: barEnd, ease: "none" }, 0);
      // The faces settle more slowly, through the flicks, until the bar fills.
      tl.to(q("[data-faces]"), { scale: 1, duration: barEnd - splitAt, ease: "power2.out" }, splitAt);

      // The faces keep cycling through the beat, counted so the last one, a flick before the
      // exit, is Zara: the hero's first slide, which the card then expands into.
      const steps = Math.max(0, Math.round((exitAt - flick - flickAt) / flick));
      const faceAt = (step: number) => (((step - steps) % faceEls.length) + faceEls.length) % faceEls.length;
      gsap.set(faceEls, { visibility: "hidden" });
      gsap.set(faceEls[faceAt(0)], { visibility: "visible" });
      for (let i = 1; i <= steps; i++) {
        const at = flickAt + i * flick;
        tl.set(faceEls[faceAt(i - 1)], { visibility: "hidden" }, at);
        tl.set(faceEls[faceAt(i)], { visibility: "visible" }, at);
      }

      // Exit: swap the card for a hero-photo-sized copy of Zara that starts exactly where the
      // card is and expands into the hero photo, while everything else fades away. The page
      // underneath is showing the same photo, so the preloader then fades off without a seam.
      const expander = q("[data-expander]")[0];
      let expand: ReturnType<typeof measureExpand> = null;
      tl.call(
        () => {
          expand = measureExpand(q("[data-card]")[0], faces.images[0]);
          if (expand) {
            gsap.set(expander, { ...expand.rect, transformOrigin: "0 0", visibility: "visible" });
            gsap.set(q("[data-card]"), { visibility: "hidden" });
          }
        },
        [],
        exitAt,
      );
      // Start values are read when the exit begins, after the measurement above. Both clips are
      // spelled out in full so GSAP pairs up all five numbers (the browser would shorten them).
      tl.fromTo(
        expander,
        {
          x: () => expand?.from.x ?? 0,
          y: () => expand?.from.y ?? 0,
          scale: () => expand?.from.scale ?? 1,
          clipPath: () => expand?.from.clipPath ?? "inset(0px 0px 0px 0px round 0px)",
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          clipPath: "inset(0px 0px 0px 0px round 0px)",
          duration: exit,
          ease: "expo.inOut",
          immediateRender: false,
        },
        exitAt,
      );
      tl.to(q("[data-bar], [data-glow], [data-dijit], [data-ally]"), { opacity: 0, duration: exit * 0.4, ease: "power2.out" }, exitAt);
      // With no hero on screen to land on, the card fades with the rest.
      tl.to(q("[data-card]"), { opacity: () => (expand ? 1 : 0), duration: exit * 0.4 }, exitAt);
      // Hand over: the hero's headline starts as the preloader fades off it.
      tl.call(markPreloaded, [], exitAt + exit);
      tl.to(el, { opacity: 0, duration: fade, ease: "power1.out" }, exitAt + exit);
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
      className="preloader fixed inset-0 z-[100] flex items-center overflow-hidden bg-ink px-6 lg:px-[42px]"
    >
      {/* Progress bar: Figma "Primary" (light), 6px on desktop and half that on mobile */}
      <div
        data-bar
        className="absolute inset-x-0 top-0 h-[3px] origin-left bg-snow lg:h-[6px]"
        style={{ transform: "scaleX(0)" }}
      />

      <div className="relative w-full text-snow" style={{ aspectRatio: `${OPEN_W} / 30` }}>
        {/* Noisy radial glow centred behind the card; outside the clipping box below so it can
            be taller than the wordmark. */}
        <div
          data-glow
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full"
          style={{
            left: pct(DIJIT_W + PAD + CARD_W / 2),
            width: pct(GLOW.size),
            aspectRatio: "1",
            background: `radial-gradient(closest-side, ${GLOW.center}, ${GLOW.edge})`,
            opacity: 0,
          }}
        >
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: NOISE,
              // Fade the grain out with the gradient so it doesn't outline the circle.
              maskImage: "radial-gradient(closest-side, #000, transparent)",
            }}
          />
        </div>

        {/* Clips the wordmark as it rises */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            data-card
            className="absolute inset-y-0 overflow-hidden rounded-[6.25%/5%] bg-ink"
            style={{ left: pct(DIJIT_W + PAD), width: pct(CARD_W), clipPath: "inset(50% 50% 50% 50%)" }}
          >
            <div data-faces className="absolute inset-0" style={{ transform: `scale(${PRELOADER.faceScale})` }}>
              {HERO_SLIDES.map((s, i) => (
                <div
                  key={s.src}
                  data-face
                  className="absolute inset-0 bg-no-repeat"
                  style={{
                    backgroundImage: `url(${asset(s.src)})`,
                    backgroundSize: `${FACE_CROP.w * 100}% ${FACE_CROP.h * 100}%`,
                    backgroundPosition: `50% ${FACE_CROP.y * 100}%`,
                    visibility: i === 0 ? "visible" : "hidden",
                  }}
                />
              ))}
            </div>
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

      {/* The exit: the first slide at the hero photo's size, positioned and clipped by GSAP */}
      <div
        data-expander
        className="invisible fixed bg-ink bg-cover bg-center"
        style={{ backgroundImage: `url(${asset(HERO_SLIDES[0].src)})` }}
      />
    </div>
  );
}

