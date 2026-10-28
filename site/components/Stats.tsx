"use client";

import { useRef } from "react";
import CarouselDots, { useActiveSlide } from "./CarouselDots";
import CountUp from "./CountUp";
import Lede from "./Lede";

/** `suffix` follows the counted number, e.g. "+" for "3+". */
export type Stat = { value: number; suffix?: string; label: string; highlight?: boolean };

const STATS: Stat[] = [
  { value: 14, label: "years of operation.", highlight: true },
  { value: 8, label: "countries and counting." },
  { value: 42, label: "strong, your team of allies." },
  { value: 24, label: "hour service, follow the sun." },
];

// Desktop: a grid of cards. Mobile: a swipeable row of 260px cards with page dots (Figma mobile).
// Defaults to the homepage's "A true ally." numbers; case studies pass their own.
// `plain` sets the intro as body copy, like the homepage's model cards, instead of a heading.
// `compact` halves the cards, and on desktop sets them in the right half of the page.
export default function Stats({
  lead = "A true ally.",
  body = "We bring the understanding of an in-house team and the ease of an agency.",
  items = STATS,
  plain = false,
  compact = false,
}: {
  lead?: string;
  body?: React.ReactNode;
  items?: Stat[];
  plain?: boolean;
  compact?: boolean;
}) {
  const track = useRef<HTMLUListElement>(null);
  const active = useActiveSlide(track);

  return (
    // As body copy it follows straight on from the heading above (the case study's title),
    // so it drops the section's top padding: the gap is that heading's bottom margin.
    <section
      data-nav-bg="page"
      className={`flex flex-col gap-16 bg-primary pb-16 lg:gap-32 lg:pb-[42px] ${plain ? "" : "pt-16 lg:pt-32"}`}
    >
      <div className="px-6 lg:px-[84px]">
        {plain ? (
          <p className="trim max-w-[716px] text-body-mobile lg:text-h3 lg:text-wcag">
            {lead} {body}
          </p>
        ) : (
          <Lede lead={lead} className="max-w-[716px]">
            {body}
          </Lede>
        )}
      </div>

      <ul
        ref={track}
        // One column per stat on wide screens (four on the homepage)
        style={{ "--n": items.length } as React.CSSProperties}
        className={`no-scrollbar flex snap-x snap-mandatory scroll-px-6 overflow-x-auto overflow-y-hidden px-6 lg:grid lg:snap-none lg:grid-cols-2 lg:overflow-visible lg:px-[42px] xl:grid-cols-[repeat(var(--n),minmax(0,1fr))] ${
          // Small cards take the right half on desktop; on wide screens each is a quarter of that half
          // (less gaps), however many there are, so three cards match four elsewhere.
          compact
            ? "gap-3 lg:ml-auto lg:w-1/2 lg:gap-[21px] lg:pl-0 xl:w-[calc((50%_-_105px)/4*var(--n)_+_21px*(var(--n)_-_1)_+_42px)]"
            : "gap-6 lg:gap-[42px]"
        }`}
      >
        {items.map((s) => (
          <li
            key={s.label}
            className={`flex shrink-0 snap-start overflow-clip rounded-[4px] lg:w-auto lg:rounded-[8px] ${
              // Small cards set their numbers from the top, so they line up whatever the label's length
              compact ? "size-[130px] items-start p-3 lg:h-[185px] lg:p-[21px]" : "size-[260px] items-center p-6 lg:h-[370px] lg:p-[42px]"
            } ${s.highlight ? "bg-tech text-coal" : "bg-ui"}`}
          >
            <div className={`flex w-full flex-col ${compact ? "max-w-[143px] gap-1.5 lg:gap-3" : "max-w-[286px] gap-3 lg:gap-6"}`}>
              <span
                className={`trim tabular-nums leading-none ${
                  compact
                    ? "text-[41px] tracking-[-0.82px] lg:text-[64px] lg:tracking-[-1.28px]"
                    : "text-[82px] tracking-[-1.64px] lg:text-[128px] lg:tracking-[-2.56px]"
                }`}
              >
                <CountUp value={s.value} />
                {s.suffix}
              </span>
              <span
                className={`trim leading-none ${
                  compact
                    ? "text-[12px] tracking-[-0.24px] lg:text-[21px] lg:tracking-[-0.42px]"
                    : "text-[24px] tracking-[-0.48px] lg:text-[42px] lg:tracking-[-0.84px]"
                } ${s.highlight ? "" : "text-static"}`}
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
