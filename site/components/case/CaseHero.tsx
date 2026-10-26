import SplitHeading from "../SplitHeading";
import RevealImage from "./RevealImage";

export type CaseImage = { src: string; alt: string; width: number; height: number };

/**
 * Case study opener, on the page colour so it follows the light/dark theme: the headline in the
 * H1 style (second sentence in grey, like the homepage's two-tone headings) under an eyebrow of
 * the client and dates in the mono label style of the work cards, then the lead image framed like the
 * homepage hero's "Recent work" card at twice its size (714 × 402 desktop, 274 × 154 mobile).
 */
export default function CaseHero({
  lead,
  follow,
  meta,
  image,
}: {
  lead: string;
  follow: string;
  meta: string[];
  image: CaseImage;
}) {
  return (
    <section
      id="top"
      data-nav-bg="page"
      className="flex flex-col gap-16 bg-primary px-6 pb-16 pt-[120px] lg:gap-24 lg:px-[42px] lg:pb-24 lg:pt-[230px]"
    >
      <div className="flex flex-col gap-6 lg:gap-8 lg:px-[42px]">
        {/* Eyebrow: client and dates on one line, in capitals except a " x " between names */}
        <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase leading-none tracking-[-0.2px] text-static lg:text-[12px]">
          {meta.map((m, i) => (
            <li key={m} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden className="size-[3px] bg-static" />}
              <span>
                {m.split(/( x )/).map((part, j) => (part === " x " ? <span key={j} className="normal-case">{part}</span> : part))}
              </span>
            </li>
          ))}
        </ul>
        <SplitHeading as="h1" className="trim w-full text-h1-mobile lg:max-w-[530px] lg:text-h1">
          {lead} <span className="text-static">{follow}</span>
        </SplitHeading>
      </div>
      {/* The frame is Figma "UI" in light mode and the card's zero-dark in dark mode */}
      <div className="self-end rounded-[8px] bg-ui p-3 lg:mr-[42px] lg:p-5 dark:bg-zero-dark">
        <div className="w-[274px] overflow-hidden rounded-[3px] lg:w-[714px]">
          <RevealImage {...image} width={16} height={9} priority sizes="(min-width: 1024px) 714px, 274px" className="rounded-none!" />
        </div>
      </div>
    </section>
  );
}
