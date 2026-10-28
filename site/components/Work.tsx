"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import CarouselDots, { useActiveSlide } from "./CarouselDots";
import Lede from "./Lede";
import PixelReveal, { dominantColour } from "./PixelReveal";
import { pageLink } from "./site";
import { STUDIES, type CaseStudy } from "./case/studies";
import { workClick } from "./PageTransition";
import { useReducedMotion, useVimeoShowing, vimeoSrc } from "./case/vimeo";

type Project = CaseStudy["card"] & { slug: string; href: string };

// The case studies, in order, each linking to its page (components/case/studies.ts).
const PROJECTS: Project[] = STUDIES.map((s) => ({ ...s.card, slug: s.slug, href: pageLink(`/work/${s.slug}`) }));

/**
 * A card's video, muted and looping in Vimeo's background mode, covering the card like the
 * image beneath it (object-fit: cover, via a size container), and fading in once it's playing.
 */
function CardVideo({ video, onShowing }: { video: NonNullable<Project["video"]>; onShowing: () => void }) {
  const reduced = useReducedMotion();
  const frame = useRef<HTMLIFrameElement>(null);
  const { showing, onLoad } = useVimeoShowing(frame, true);
  useEffect(() => {
    if (showing) onShowing();
  }, [showing, onShowing]);
  if (reduced !== false) return null;
  const ratio = video.width / video.height;
  return (
    // Decorative: the image beneath carries the card's description.
    <span
      aria-hidden
      className="absolute inset-0 block transition-transform duration-700 ease-out [container-type:size] group-hover:scale-[1.04]"
      style={{ "--r": ratio } as React.CSSProperties}
    >
      <iframe
        ref={frame}
        src={vimeoSrc(video.vimeo, true)}
        title=""
        tabIndex={-1}
        allow="autoplay"
        loading="lazy"
        onLoad={onLoad}
        className={`pointer-events-none absolute left-1/2 top-1/2 h-[max(100cqh,calc(100cqw/var(--r)))] w-[max(100cqw,calc(100cqh*var(--r)))] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ${
          showing ? "opacity-100" : "opacity-0"
        }`}
      />
    </span>
  );
}

function ProjectCard({ p, order, revealAt }: { p: Project; order: number; revealAt: number | null }) {
  const [color, setColor] = useState<string | null>(null);
  // Once a card's video is playing, the image under it is hidden, so it can't show through
  // along the card's softened (antialiased) edges.
  const [videoShowing, setVideoShowing] = useState(false);
  const onVideoShowing = useCallback(() => setVideoShowing(true), []);
  const img = useRef<HTMLImageElement>(null);
  const box = useRef<HTMLSpanElement>(null);
  // Cover colour for the reveal; a failed image just fades its cover out. Inset cards are
  // mostly their frame (the card's own fill), so they cover in that.
  const sample = (el: HTMLImageElement) =>
    setColor(
      p.inset && box.current ? getComputedStyle(box.current).backgroundColor : (dominantColour(el) ?? "transparent"),
    );
  const onLoad = (e: React.SyntheticEvent<HTMLImageElement>) => sample(e.currentTarget);
  const onError = () => setColor("transparent");
  // A cached image can finish loading before hydration, when onLoad isn't listening yet.
  useEffect(() => {
    const el = img.current;
    if (el?.complete && el.naturalWidth) sample(el);
  }, []);
  return (
    <a
      href={p.href}
      onClick={(e) => workClick(e, p.slug)}
      draggable={false}
      className="group flex w-[290px] shrink-0 snap-start flex-col gap-6 outline-none lg:w-[504px]"
    >
      <span
        ref={box}
        // Mobile cards are all 290×420; desktop mixes tall (504×680) and square (504×504).
        // Every card sits on the UI colour (light) or the WCAG grey (dark): the frame around an
        // inset card, and what shows while an image loads.
        className={`relative block h-[420px] w-full overflow-hidden rounded-[4px] lg:h-auto ${p.tall ? "lg:aspect-[504/680]" : "lg:aspect-square"} bg-ui dark:bg-wcag group-focus-visible:ring-2 group-focus-visible:ring-secondary`}
      >
        {p.inset ? (
          <span className="absolute inset-x-[31.5px] inset-y-[45.75px] block lg:inset-x-[8.7%] lg:inset-y-[5.7%]">
            <Image
              draggable={false}
              src={p.image}
              alt={p.alt}
              fill
              sizes="(min-width: 1024px) 416px, 227px"
              unoptimized
              ref={img}
              onLoad={onLoad}
              onError={onError}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </span>
        ) : (
          <Image
            draggable={false}
            src={p.image}
            alt={p.alt}
            fill
            sizes="(min-width: 1024px) 504px, 290px"
            // The original file, as the published sites serve it. Next's dev resizing goes by the
            // card's width, but these crop landscape shots into tall cards, so it came out soft.
            unoptimized
            ref={img}
            onLoad={onLoad}
            onError={onError}
            className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${videoShowing ? "invisible" : ""}`}
          />
        )}
        {p.video && !p.inset && <CardVideo video={p.video} onShowing={onVideoShowing} />}
        <PixelReveal color={color} order={order} startAt={revealAt} />
      </span>
      <div className="flex flex-col items-start gap-3.5">
        <span className="trim text-[22px] leading-[1.2] transition-colors group-hover:text-wcag lg:text-[38px] lg:tracking-[-0.76px]">
          {p.title}
        </span>
        <p className="font-mono text-[8px] leading-none tracking-[-0.16px] text-static lg:text-[10px] lg:tracking-[-0.2px]">{p.meta}</p>
      </div>
    </a>
  );
}

export default function Work() {
  const scroller = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const active = useActiveSlide(scroller);
  // When the carousel first comes into view; the cards' reveals are staggered from here.
  const [revealAt, setRevealAt] = useState<number | null>(null);
  const [thumb, setThumb] = useState({ size: 0.165, offset: 0 });
  // Snap is switched off while the user drags, otherwise it fights every scrollLeft write.
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ pointerId: -1, startX: 0, startLeft: 0, ratio: 1, moved: false, captured: false });

  // Grab-to-scroll on the cards (mouse only; touch already scrolls natively).
  const onCardsPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scroller.current;
    if (!el || e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = { pointerId: e.pointerId, startX: e.clientX, startLeft: el.scrollLeft, ratio: 1, moved: false, captured: false };
  };

  const onCardsPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scroller.current;
    const d = drag.current;
    if (!el || d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) < 5) return;
    if (!d.captured) {
      // Capture only once it's a real drag, so plain clicks still reach the card links.
      el.setPointerCapture(e.pointerId);
      d.captured = true;
      d.moved = true;
      setDragging(true);
    }
    el.scrollLeft = d.startLeft - dx;
  };

  // Drag the thumb, or click the track to jump there.
  const onTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scroller.current;
    const t = track.current;
    if (!el || !t || e.button !== 0) return;
    const rect = t.getBoundingClientRect();
    const thumbW = rect.width * thumb.size;
    const max = el.scrollWidth - el.clientWidth;
    const ratio = max / Math.max(1, rect.width - thumbW);
    const thumbLeft = rect.left + thumb.offset * (rect.width - thumbW);
    const onThumb = e.clientX >= thumbLeft && e.clientX <= thumbLeft + thumbW;
    if (!onThumb) {
      // Centre the thumb on the click point.
      el.scrollLeft = (e.clientX - rect.left - thumbW / 2) * ratio;
    }
    t.setPointerCapture(e.pointerId);
    drag.current = { pointerId: e.pointerId, startX: e.clientX, startLeft: el.scrollLeft, ratio, moved: false, captured: true };
    setDragging(true);
    e.preventDefault();
  };

  const onTrackPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scroller.current;
    const d = drag.current;
    if (!el || d.pointerId !== e.pointerId) return;
    el.scrollLeft = d.startLeft + (e.clientX - d.startX) * d.ratio;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current.pointerId !== e.pointerId) return;
    drag.current.pointerId = -1;
    setDragging(false);
  };

  // Swallow the click that ends a drag so it doesn't open a project.
  const onCardsClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  const onTrackKeyDown = (e: React.KeyboardEvent) => {
    const el = scroller.current;
    if (!el) return;
    const step = 528; // card + gap
    if (e.key === "ArrowRight") el.scrollBy({ left: step, behavior: "smooth" });
    else if (e.key === "ArrowLeft") el.scrollBy({ left: -step, behavior: "smooth" });
    else if (e.key === "Home") el.scrollTo({ left: 0, behavior: "smooth" });
    else if (e.key === "End") el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    else return;
    e.preventDefault();
  };

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setRevealAt(performance.now());
        io.disconnect();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setThumb({
        size: Math.min(1, el.clientWidth / el.scrollWidth),
        offset: max > 0 ? el.scrollLeft / max : 0,
      });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section id="work" data-nav-bg="page" className="flex flex-col gap-16 bg-primary py-16 lg:block lg:py-0">
      <div className="px-6 lg:px-16 lg:pb-32 lg:pt-[196px]">
        <Lede lead="Our work." className="max-w-[720px]">
          {/* Line breaks as set in both the desktop and mobile Figma frames */}
          From engineering
          <br /> to execution. And everything
          <br /> in between.
        </Lede>
      </div>

      <div
        id="work-carousel"
        // overflow-y-hidden: overflow-x:auto alone makes the y axis scrollable too, and a
        // sub-pixel overflow would latch the page's wheel scrolling onto this row.
        ref={scroller}
        tabIndex={0}
        aria-label="Selected projects"
        onPointerDown={onCardsPointerDown}
        onPointerMove={onCardsPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onCardsClickCapture}
        className={`no-scrollbar flex scroll-px-6 items-start gap-6 overflow-x-auto overflow-y-hidden px-6 outline-none lg:scroll-px-16 lg:px-16 ${
          dragging ? "cursor-grabbing select-none" : "snap-x snap-mandatory cursor-grab"
        }`}
      >
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.title} p={p} order={i} revealAt={revealAt} />
        ))}
      </div>

      {/* Desktop scrollbar; mobile uses page dots (below) as in the Figma */}
      <div className="hidden px-16 pt-24 lg:block">
        {/* An invisible ::before extends the 8px bar into a 32px-tall hit area without affecting layout */}
        <div
          ref={track}
          role="scrollbar"
          aria-controls="work-carousel"
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(thumb.offset * 100)}
          tabIndex={0}
          onPointerDown={onTrackPointerDown}
          onPointerMove={onTrackPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onTrackKeyDown}
          className="group relative cursor-pointer touch-none outline-none before:absolute before:inset-x-0 before:-inset-y-3 before:content-['']"
        >
          <div className="relative h-2 w-full bg-ui group-focus-visible:ring-2 group-focus-visible:ring-tech">
            <div
              className={`absolute inset-y-0 rounded-full bg-secondary transition-[background-color] ${
                dragging ? "cursor-grabbing bg-wcag" : "cursor-grab group-hover:bg-wcag"
              }`}
              style={{ width: `${thumb.size * 100}%`, left: `${thumb.offset * (1 - thumb.size) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <CarouselDots count={PROJECTS.length} active={active} target={scroller} label="Projects" />
    </section>
  );
}
