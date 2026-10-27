"use client";

import { useRef } from "react";
import { useSplitReveal } from "../useSplitReveal";

/**
 * A quotation mark in a box exactly the height of its ink, so spacing around it is measured
 * from the mark itself. In NeuSans the marks' ink runs from 0.051em to 0.29em below the top of a
 * leading-none line, so the box is 0.24em tall and the glyph is lifted 0.051em into it.
 */
function QuoteMark({ char }: { char: string }) {
  return (
    <span aria-hidden className="relative block h-[0.24em] w-[1em] text-[52px] lg:text-[96px]">
      <span className="absolute left-1/2 top-[-0.051em] -translate-x-1/2 leading-none">{char}</span>
    </span>
  );
}

/**
 * A client's words at the H1 size, centred between oversized quotation marks and revealed like
 * the homepage headings, with who said it underneath.
 */
export default function CaseQuote({ quote, name, role }: { quote: string; name: string; role: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useSplitReveal(ref);

  return (
    <section data-nav-bg="page" className="bg-primary px-6 py-16 lg:px-[84px] lg:py-[196px]">
      <figure className="mx-auto flex w-full flex-col items-center gap-10 text-center lg:w-3/5 lg:gap-16">
        {/* The marks stand apart from the words, above and below, at twice the quote's size and
            48px from it. */}
        <blockquote className="flex flex-col items-center gap-12">
          <QuoteMark char="“" />
          <p ref={ref} data-split className="trim text-h1-mobile lg:text-h1">
            {quote}
          </p>
          <QuoteMark char="”" />
        </blockquote>
        <figcaption>
          <span className="trim text-[17px] leading-[1.2] lg:text-[18px]">
            {name}, <span className="text-static">{role}</span>
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
