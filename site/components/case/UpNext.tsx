"use client";

import Image from "next/image";
import Lede from "../Lede";
import { workClick } from "../PageTransition";

/** Dark text on a light brand colour, light text on a dark one (by relative luminance). */
function inkFor(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.18 ? "text-coal" : "text-snow";
}

/**
 * The close of a case study: a parting line, then the next case study: its photo beside a
 * square panel in the client's brand colour with the title and partnership details.
 */
export default function UpNext({
  lead,
  body,
  title,
  meta,
  href,
  slug,
  image,
  alt,
  inset = false,
  color,
  textColor,
}: {
  lead: string;
  body: string;
  title: string;
  meta: string;
  href: string;
  /** The next study, for the transition into it. */
  slug: string;
  image: string;
  alt: string;
  /** A cut-out product shot: shown whole on the card's fill, as on the homepage card, not cropped. */
  inset?: boolean;
  /** The next client's brand colour, for the square title panel. */
  color: string;
  /** The panel's text colour; by default black or white, whichever reads on `color`. */
  textColor?: string;
}) {
  return (
    <section data-nav-bg="page" className="flex flex-col gap-16 bg-primary px-6 py-16 lg:gap-32 lg:px-[42px] lg:py-32">
      <div className="lg:px-[42px]">
        <Lede lead={lead} className="max-w-[820px]">
          {body}
        </Lede>
      </div>

      {/* The photo, with a square panel in the client's colour to its right holding the title,
          set apart by the page margin (24px mobile, 42px desktop). Stacked on mobile. */}
      <a href={href} onClick={(e) => workClick(e, slug)} className="group grid grid-cols-1 gap-6 outline-none lg:grid-cols-[1fr_auto] lg:gap-[42px]">
        <span
          className="relative block aspect-[16/9] w-full overflow-hidden rounded-[4px] group-focus-visible:ring-2 group-focus-visible:ring-secondary lg:aspect-auto lg:h-full lg:rounded-[8px] bg-ui dark:bg-wcag"
        >
          <Image
            src={image}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className={`transition-transform duration-700 ease-out group-hover:scale-[1.03] ${inset ? "object-contain p-[6%]" : "object-cover"}`}
          />
        </span>
        <span
          className={`flex aspect-square w-full flex-col justify-between rounded-[4px] p-6 lg:w-[clamp(320px,32vw,560px)] lg:rounded-[8px] lg:p-[42px] ${textColor ? "" : inkFor(color)}`}
          style={{ background: color, color: textColor }}
        >
          <span className="font-mono text-[10px] uppercase leading-none lg:text-[12px]">Up next</span>
          <span className="flex flex-col items-start gap-3.5">
            <span className="trim text-[32px] leading-none tracking-[-0.64px] lg:text-[48px] lg:tracking-[-0.96px]">{title}</span>
            <span className="font-mono text-[8px] leading-none tracking-[-0.16px] lg:text-[10px] lg:tracking-[-0.2px]">{meta}</span>
          </span>
        </span>
      </a>
    </section>
  );
}
