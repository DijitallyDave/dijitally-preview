import Marquee from "../Marquee";
import { ALLY_W, Ally, DIJIT_W, Dijit } from "../Preloader";
import type { CaseStudy } from "./studies";

/** How long one copy of the strip takes to scroll past (seconds). */
const DURATION = 90;

/**
 * A client logo's width, in units of the strip's height (78 on desktop): a long thin wordmark
 * and a chunky lockup read as the same size rather than the same width or height (width grows
 * with the 0.4 power of the logo's aspect ratio), as heavy as Afterpay's pill, and capped so a
 * very long one doesn't run on.
 */
const logoWidth = ({ width, height }: { width: number; height: number }) => Math.min(161, 68 * (width / height) ** 0.4);
/** Room either side of a logo in its box, in the same units: about what Afterpay's pill leaves. */
const BOX_PAD = 36;

/**
 * DIJIT [client pill] ALLY, repeating and drifting slowly sideways: the foot of a case study's
 * hero (CaseFullHero), and the transition screen into one (PageTransition), which match-cuts to
 * it. Both run on the same clock (Marquee's `sync`), so wherever one is shown the other is at
 * the same point.
 *
 * Each lockup: the wordmark's halves at 78px high (desktop), the pill between them 6px either
 * side, and 128px to the next. On mobile, half that. The pill is the study's own artwork;
 * without one, its logo stands in, in coal on a snow pill (light mode's secondary on primary,
 * in either theme, as the hero is always dark), as tall as Afterpay's and hugging the logo.
 */
export default function LogoStrip({ study }: { study: Pick<CaseStudy, "pill" | "logo"> }) {
  const { pill, logo } = study;
  return (
    <Marquee duration={DURATION} repeat={3} sync>
      <div className="flex h-[39px] shrink-0 items-center gap-[3px] pr-16 lg:h-[78px] lg:gap-1.5 lg:pr-32">
        <span className="block h-full" style={{ aspectRatio: `${DIJIT_W} / 30` }}>
          <Dijit />
        </span>
        {pill ? (
          <img src={pill.src} alt="" width={pill.width} height={pill.height} className="block h-full w-auto" />
        ) : (
          logo && (
            <span
              className="flex h-full items-center justify-center rounded-full bg-snow"
              style={{ aspectRatio: `${logoWidth(logo) + 2 * BOX_PAD} / 78` }}
            >
              {/* The logo's shape, filled with coal */}
              <span
                className="block bg-coal"
                style={{
                  width: `${(logoWidth(logo) / (logoWidth(logo) + 2 * BOX_PAD)) * 100}%`,
                  aspectRatio: `${logo.width} / ${logo.height}`,
                  mask: `url("${logo.src}") center / contain no-repeat`,
                }}
              />
            </span>
          )
        )}
        <span className="block h-full" style={{ aspectRatio: `${ALLY_W} / 30` }}>
          <Ally />
        </span>
      </div>
    </Marquee>
  );
}
