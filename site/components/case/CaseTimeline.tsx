"use client";

import { useRef } from "react";
import CarouselDots, { useActiveSlide } from "../CarouselDots";
import Lede from "../Lede";

export type Milestone = { year: string; title: string; body: string };

/**
 * The partnership year by year, in the cards of the homepage's "A true ally." stats: the
 * latest year in Tech green, the rest on UI grey. A swipeable row with page dots on mobile, a
 * grid on desktop.
 */
export default function CaseTimeline({ lead, body, items }: { lead: string; body: string; items: Milestone[] }) {
  const track = useRef<HTMLOListElement>(null);
  const active = useActiveSlide(track);

  return (
    <section data-nav-bg="page" className="flex flex-col gap-16 bg-primary py-16 lg:gap-32 lg:py-32">
      <div className="px-6 lg:px-[84px]">
        <Lede lead={lead} className="max-w-[716px]">
          {body}
        </Lede>
      </div>

      <ol
        ref={track}
        className="no-scrollbar flex snap-x snap-mandatory scroll-px-6 gap-6 overflow-x-auto overflow-y-hidden px-6 lg:grid lg:snap-none lg:grid-cols-4 lg:gap-[42px] lg:overflow-visible lg:px-[42px]"
      >
        {items.map((m, i) => {
          const latest = i === items.length - 1;
          return (
            <li
              key={m.year}
              className={`flex w-[260px] shrink-0 snap-start flex-col justify-between gap-10 rounded-[4px] p-6 lg:min-h-[370px] lg:w-auto lg:rounded-[8px] lg:p-[42px] ${
                latest ? "bg-tech text-coal" : "bg-ui"
              }`}
            >
              <span className="trim tabular-nums text-[64px] leading-none tracking-[-1.28px] lg:text-[82px] lg:tracking-[-1.64px]">
                {m.year}
              </span>
              <div className="flex flex-col gap-3">
                <h3 className="trim text-[24px] leading-none tracking-[-0.48px] lg:text-[26px] lg:tracking-[-0.52px]">{m.title}</h3>
                <p className={`text-[16px] leading-[1.3] ${latest ? "" : "text-wcag"}`}>{m.body}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <CarouselDots count={items.length} active={active} target={track} label="Timeline" />
    </section>
  );
}
