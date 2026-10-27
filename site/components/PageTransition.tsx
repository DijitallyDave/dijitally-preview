"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ALLY_W, Ally, DIJIT_W, Dijit, OPEN_W } from "./Preloader";
import { studyBySlug, type CaseStudy } from "./case/studies";
import { ON_DIJITALLY } from "./site";

/**
 * The move into a case study. A black screen slides up from the bottom; as its edge passes it
 * uncovers the wordmark at half its splash size, already split into DIJIT and ALLY with the
 * client's logo between them. The page changes underneath (a client-side navigation, so this
 * stays on screen throughout), then the black rolls on up and off the top, uncovering the case
 * study.
 *
 * Opened with openWork(slug) from a work link's click. Only studies with a `logo` have one
 * (all of them, today); anything else, and anywhere motion is reduced, is a plain page load.
 */

const EVENT = "dijitally:open-work";

/** Starts the transition into a case study. Returns false if there isn't one to play. */
export function openWork(slug: string) {
  const study = studyBySlug(slug);
  // On www.dijitally.com the case studies are that site's own pages, not this app's.
  if (ON_DIJITALLY || !study?.logo) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: slug }));
  return true;
}

/** A link's click, if it's a plain left click that should play the transition instead. */
export function workClick(e: React.MouseEvent, slug: string) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (openWork(slug)) e.preventDefault();
}

const COVER = 0.7; // seconds for the black to slide up over the page
const HOLD = 0.35; // seconds on the logo once the new page is in, before rolling off
const REVEAL = 0.8; // seconds for the black to roll off the top
const PAD = 4; // units either side of the logo's square, as around the preloader's card
const LOGO_W = 0.8; // the logo's width, as a share of its square

/**
 * DIJIT [client logo] ALLY, in the wordmark's own units (30 high), at half the preloader's
 * size. The logo sits centred in a dark grey (zero-dark) square as tall as the wordmark.
 */
function Mark({ logo }: { logo: NonNullable<CaseStudy["logo"]> }) {
  const square = 30;
  const gap = square + 2 * PAD;
  const width = DIJIT_W + gap + ALLY_W;
  const pct = (u: number) => `${(u / width) * 100}%`;
  return (
    <div
      className="relative mx-auto text-snow"
      // The preloader's wordmark fills the margins at OPEN_W units wide; half that size here.
      style={{ width: `${(width / OPEN_W / 2) * 100}%`, aspectRatio: `${width} / 30` }}
    >
      <div className="absolute inset-y-0 left-0" style={{ width: pct(DIJIT_W) }}>
        <Dijit />
      </div>
      <div
        className="absolute inset-y-0 flex items-center justify-center rounded-[6.25%] bg-zero-dark"
        style={{ left: pct(DIJIT_W + PAD), width: pct(square) }}
      >
        <img
          src={logo.src}
          alt=""
          className={`block h-auto ${logo.invert ? "invert" : ""}`}
          style={{ width: `${LOGO_W * 100}%`, aspectRatio: `${logo.width} / ${logo.height}` }}
        />
      </div>
      <div className="absolute inset-y-0 right-0" style={{ width: pct(ALLY_W) }}>
        <Ally />
      </div>
    </div>
  );
}

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [study, setStudy] = useState<CaseStudy | null>(null);
  // The page being opened, once the black has covered the screen and navigation has started.
  const going = useRef<string | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const s = studyBySlug((e as CustomEvent<string>).detail);
      if (!s) return;
      router.prefetch(`/work/${s.slug}`);
      setStudy(s);
    };
    window.addEventListener(EVENT, onOpen);
    return () => window.removeEventListener(EVENT, onOpen);
  }, [router]);

  // Cover: the black slides up while its contents slide down by the same amount, so the
  // wordmark stays put and the black's top edge works as a mask passing up over it.
  useLayoutEffect(() => {
    if (!study || going.current) return;
    const href = `/work/${study.slug}`;
    const tl = gsap.timeline({
      onComplete: () => {
        going.current = href;
        router.push(href);
      },
    });
    // y: 0 because GSAP would otherwise read the inline starting transform as a pixel offset
    // and keep it on top of the percentage.
    tl.fromTo(outer.current, { y: 0, yPercent: 100 }, { yPercent: 0, duration: COVER, ease: "expo.inOut" }, 0);
    tl.fromTo(inner.current, { y: 0, yPercent: -100 }, { yPercent: 0, duration: COVER, ease: "expo.inOut" }, 0);
    return () => {
      tl.kill();
    };
  }, [study, router]);

  // Reveal, once the new page is the one showing: the black rolls off the top the same way.
  // Left to finish rather than killed on cleanup: it runs once, and a re-run of this effect
  // (React does that in development) must not strand the screen black.
  useEffect(() => {
    if (!going.current || pathname.replace(/\/$/, "") !== going.current) return;
    going.current = null;
    const tl = gsap.timeline({ delay: HOLD, onComplete: () => setStudy(null) });
    tl.to(outer.current, { yPercent: -100, duration: REVEAL, ease: "expo.inOut" }, 0);
    tl.to(inner.current, { yPercent: 100, duration: REVEAL, ease: "expo.inOut" }, 0);
  }, [pathname]);

  if (!study?.logo) return null;
  return (
    <div ref={outer} aria-hidden className="fixed inset-0 z-[90] overflow-hidden bg-ink" style={{ transform: "translateY(100%)" }}>
      <div ref={inner} className="absolute inset-0 flex items-center px-6 lg:px-[42px]" style={{ transform: "translateY(-100%)" }}>
        <Mark logo={study.logo} />
      </div>
    </div>
  );
}
