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
    <a href="#" className="group flex w-[78vw] max-w-[504px] shrink-0 snap-start flex-col gap-6 outline-none lg:w-[504px]">
      <span
        className={`relative block w-full overflow-hidden rounded-[4px] ${p.tall ? "aspect-[504/680]" : "aspect-square"} ${
          p.inset ? "bg-black" : ""
        } group-focus-visible:ring-2 group-focus-visible:ring-secondary`}
        style={p.background ? { background: p.background } : undefined}
      >
        {p.inset ? (
          <span className="absolute inset-y-[5.7%] left-[8.7%] right-[8.7%] block">
            <Image
              src={p.image}
              alt={p.alt}
              fill
              sizes="416px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          </span>
        ) : (
          <Image
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
  const [thumb, setThumb] = useState({ size: 0.165, offset: 0 });

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
        ref={scroller}
        tabIndex={0}
        aria-label="Selected projects"
        className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 items-start gap-6 overflow-x-auto px-4 outline-none sm:scroll-px-6 sm:px-6 lg:scroll-px-16 lg:px-16"
      >
        {PROJECTS.map((p) => (
          <ProjectCard key={p.title} p={p} />
        ))}
      </div>

      <div className="px-4 pt-16 sm:px-6 lg:px-16 lg:pt-24">
        <div className="relative h-2 w-full bg-ui" aria-hidden>
          <div
            className="absolute inset-y-0 rounded-full bg-secondary transition-[left] duration-150 ease-out"
            style={{ width: `${thumb.size * 100}%`, left: `${thumb.offset * (1 - thumb.size) * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
}
