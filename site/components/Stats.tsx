"use client";

import { useRef } from "react";
import CarouselDots, { useActiveSlide } from "./CarouselDots";
import CountUp from "./CountUp";
import Lede from "./Lede";

export type Stat = { value: number; label: string; highlight?: boolean };

const STATS: Stat[] = [
  { value: 14, label: "years of operation.", highlight: true },
  { value: 8, label: "countries and counting." },
  { value: 42, label: "strong, your team of allies." },
  { value: 24, label: "hour service, follow the sun." },
];

// Desktop: a grid of cards. Mobile: a swipeable row of 260px cards with page dots (Figma mobile).
// Defaults to the homepage's "A true ally." numbers; case studies pass their own.
export default function Stats({
  lead = "A true ally.",
  body = "We bring the understanding of an in-house team and the ease of an agency.",
  items = STATS,
}: {
  lead?: string;
  body?: React.ReactNode;
  items?: Stat[];
}) {
  const track = useRef<HTMLUListElement>(null);
  const active = useActiveSlide(track);

  return (
    <section data-nav-bg="page" className="flex flex-col gap-16 bg-primary py-16 lg:gap-32 lg:pb-[42px] lg:pt-32">
      <div className="px-6 lg:px-[84px]">
        <Lede lead={lead} className="max-w-[716px]">
          {body}
        </Lede>
      </div>

      <ul
        ref={track}
        className="no-scrollbar flex snap-x snap-mandatory scroll-px-6 gap-6 overflow-x-auto overflow-y-hidden px-6 lg:grid lg:snap-none lg:grid-cols-2 lg:gap-[42px] lg:overflow-visible lg:px-[42px] xl:grid-cols-4"
      >
        {items.map((s) => (
          <li
            key={s.label}
            className={`flex size-[260px] shrink-0 snap-start items-center overflow-clip rounded-[4px] p-6 lg:h-[370px] lg:w-auto lg:rounded-[8px] lg:p-[42px] ${
              s.highlight ? "bg-tech text-coal" : "bg-ui"
            }`}
          >
            <div className="flex w-full max-w-[286px] flex-col gap-3 lg:gap-6">
              <CountUp
                value={s.value}
                className="trim tabular-nums text-[82px] leading-none tracking-[-1.64px] lg:text-[128px] lg:tracking-[-2.56px]"
              />
              <span
                className={`trim text-[24px] leading-none tracking-[-0.48px] lg:text-[42px] lg:tracking-[-0.84px] ${
                  s.highlight ? "" : "text-static"
                }`}
              >
                {s.label}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <CarouselDots count={items.length} active={active} target={track} label="Stats" />
    </section>
  );
}
