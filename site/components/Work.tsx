"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Lede from "./Lede";

type Project = {
  title: string;
  meta: string;
  image: string;
  alt: string;
  tall: boolean;
  /** Afterpay sits a product shot inside a black frame rather than filling it. */
  inset?: boolean;
  background?: string;
};

const PROJECTS: Project[] = [
  {
    title: "Afterpay x Ally",
    meta: "PARTNERSHIP: 2020 — PRESENT",
    image: "/figma/work-afterpay.png",
    alt: "Chrome headphones on black",
    tall: true,
    inset: true,
  },
  {
    title: "Airwallex x Ally",
    meta: "PARTNERSHIP: 2024 — PRESENT",
    image: "/figma/work-airwallex.png",
    alt: "Three rugby players in Airwallex-sponsored jerseys",
    tall: false,
    background: "linear-gradient(to bottom, #36222d, #4f3036 50.081%)",
  },
  {
    title: "Constantinople",
    meta: "ENGINEERING, DEVELOPMENT",
    image: "/figma/work-constantinople.png",
    alt: "Hand holding a phone showing the Constantinople banking site",
    tall: true,
  },
  {
    title: "Procore x Ally",
    meta: "PARTNERSHIP: 2025 — PRESENT",
    image: "/figma/work-procore.jpg",
    alt: "Procore construction campaign",
    tall: false,
  },
  {
    title: "RoomStay x Ally",
    meta: "SOCIAL, CREATIVE, IN.HOUSE",
    image: "/figma/work-roomstay.png",
    alt: "RoomStay holiday campaign",
    tall: true,
  },
];

function ProjectCard({ p }: { p: Project }) {
  return (
    <a
      href="#"
      draggable={false}
      className="group flex w-[78vw] max-w-[504px] shrink-0 snap-start flex-col gap-6 outline-none lg:w-[504px]"
    >
      <span
        className={`relative block w-full overflow-hidden rounded-[4px] ${p.tall ? "aspect-[504/680]" : "aspect-square"} ${
          p.inset ? "bg-black" : ""
        } group-focus-visible:ring-2 group-focus-visible:ring-secondary`}
        style={p.background ? { background: p.background } : undefined}
      >
        {p.inset ? (
          <span className="absolute inset-y-[5.7%] left-[8.7%] right-[8.7%] block">
            <Image
              draggable={false}
              src={p.image}
              alt={p.alt}
              fill
              sizes="416px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </span>
        ) : (
          <Image
            draggable={false}
            src={p.image}
            alt={p.alt}
            fill
            sizes="(min-width: 1024px) 504px, 78vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}
      </span>
      <span className="flex flex-col items-start gap-3.5">
        <span className="trim text-[30px] leading-[1.2] tracking-[-0.6px] transition-colors group-hover:text-wcag lg:text-[38px] lg:tracking-[-0.76px]">
          {p.title}
        </span>
        <span className="font-mono text-[10px] leading-none tracking-[-0.2px] text-static">{p.meta}</span>
      </span>
    </a>
  );
}

export default function Work() {
  const scroller = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
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
    <section id="work" className="bg-primary">
      <div className="px-4 pb-16 pt-28 sm:px-6 lg:px-16 lg:pb-32 lg:pt-[196px]">
        <Lede lead="Our work." className="max-w-[720px]">
          From engineering to execution. And everything in between.
        </Lede>
      </div>

      <div
        id="work-carousel"
        ref={scroller}
        tabIndex={0}
        aria-label="Selected projects"
        onPointerDown={onCardsPointerDown}
        onPointerMove={onCardsPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onCardsClickCapture}
        className={`no-scrollbar flex scroll-px-4 items-start gap-6 overflow-x-auto px-4 outline-none sm:scroll-px-6 sm:px-6 lg:scroll-px-16 lg:px-16 ${
          dragging ? "cursor-grabbing select-none" : "snap-x snap-mandatory cursor-grab"
        }`}
      >
        {PROJECTS.map((p) => (
          <ProjectCard key={p.title} p={p} />
        ))}
      </div>

      <div className="px-4 pt-16 sm:px-6 lg:px-16 lg:pt-24">
        {/* Padding gives the 8px bar a comfortable hit area */}
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
          className="group -my-3 cursor-pointer touch-none py-3 outline-none"
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
    </section>
  );
}
