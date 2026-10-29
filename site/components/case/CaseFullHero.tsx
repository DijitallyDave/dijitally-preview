import SplitHeading from "../SplitHeading";
import LogoStrip from "./LogoStrip";
import SlideAway from "./SlideAway";
import type { CaseStudy } from "./studies";

/**
 * A full-screen case study opener (Figma "Hero", 5541:7633), over the hero video or image that
 * CaseStudyPage lays behind it: the eyebrow and headline set in a 460px column,
 * vertically centred at the page margin, and along the bottom DIJIT [client pill] ALLY,
 * repeating and drifting slowly sideways (LogoStrip, which the transition into the page
 * match-cuts to). Always dark, in either theme.
 */
export default function CaseFullHero({
  lead,
  follow,
  meta,
  study,
}: {
  lead: string;
  follow: string;
  meta: string[];
  /** For the client's pill between DIJIT and ALLY (see LogoStrip). */
  study: Pick<CaseStudy, "pill" | "logo">;
}) {
  return (
    <section data-nav-bg="dark" className="relative flex h-screen min-h-[640px] flex-col text-snow">
      <div className="flex flex-1 items-center px-6 pt-[var(--nav-h,68px)] lg:px-[42px] lg:pt-[var(--nav-h,115px)]">
        <div className="flex w-full max-w-[460px] flex-col gap-6">
          {/* Eyebrow: in capitals except a " x " between names, as on the other case studies */}
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase leading-none tracking-[-0.2px] text-static">
            {meta.map((m, i) => (
              <li key={m} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden className="size-[3px] bg-static" />}
                <span>
                  {m.split(/( x )/).map((part, j) => (part === " x " ? <span key={j} className="normal-case">{part}</span> : part))}
                </span>
              </li>
            ))}
          </ul>
          {/* 42px on mobile, set like the H1 (line height 1, -2%); the H1's 48px on desktop */}
          <SplitHeading as="h1" onLoad className="trim text-[42px] leading-none tracking-[-0.84px] lg:text-h1">
            {lead} {follow}
          </SplitHeading>
        </div>
      </div>

      {/* Decorative: the client's name is in the eyebrow and headline above. Drops away under
          its own box as the page scrolls off the hero. */}
      <div aria-hidden className="pb-6">
        <SlideAway>
          <LogoStrip study={study} />
        </SlideAway>
      </div>
    </section>
  );
}
