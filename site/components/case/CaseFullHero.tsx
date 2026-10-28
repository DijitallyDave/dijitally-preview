import SplitHeading from "../SplitHeading";
import LogoStrip from "./LogoStrip";

/**
 * A full-screen case study opener (Figma "Hero", 5541:7633), over the hero video or image that
 * CaseStudyPage lays behind it: the eyebrow, headline and intro set in a 460px column,
 * vertically centred at the page margin, and along the bottom DIJIT [client pill] ALLY,
 * repeating and drifting slowly sideways (LogoStrip, which the transition into the page
 * match-cuts to). Always dark, in either theme.
 */
export default function CaseFullHero({
  lead,
  follow,
  meta,
  intro,
  pill,
}: {
  lead: string;
  follow: string;
  meta: string[];
  /** The opening paragraph, in the body style under the headline. */
  intro?: string;
  /** The client's logo pill between DIJIT and ALLY: light artwork. */
  pill: { src: string; width: number; height: number };
}) {
  return (
    <section data-nav-bg="dark" className="relative flex h-svh min-h-[640px] flex-col text-snow">
      <div className="flex flex-1 items-center px-6 pt-[var(--nav-h,68px)] lg:px-[42px] lg:pt-[var(--nav-h,115px)]">
        <div className="flex w-full max-w-[460px] flex-col gap-8 lg:gap-[42px]">
          <div className="flex flex-col gap-6">
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
            <SplitHeading as="h1" onLoad className="trim text-h1-mobile lg:text-h1">
              {lead} {follow}
            </SplitHeading>
          </div>
          {intro && (
            <p className="trim text-body-mobile text-static lg:text-[22px] lg:leading-[1.2] lg:tracking-[0.22px]">{intro}</p>
          )}
        </div>
      </div>

      {/* Decorative: the client's name is in the eyebrow and headline above */}
      <div aria-hidden className="pb-6">
        <LogoStrip pill={pill} />
      </div>
    </section>
  );
}
