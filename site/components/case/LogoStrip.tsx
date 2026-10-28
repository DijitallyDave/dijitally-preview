import Marquee from "../Marquee";
import { ALLY_W, Ally, DIJIT_W, Dijit } from "../Preloader";

/** How long one copy of the strip takes to scroll past (seconds). */
const DURATION = 90;

/**
 * DIJIT [client pill] ALLY, repeating and drifting slowly sideways: the foot of a full case
 * study hero (CaseFullHero), and the transition screen into one (PageTransition), which match-
 * cuts to it. Both run on the same clock (Marquee's `sync`), so wherever one is shown the other
 * is at the same point.
 *
 * Each lockup: the wordmark's halves at 78px high (desktop), the pill between them 6px either
 * side, and 128px to the next. On mobile, half that.
 */
export default function LogoStrip({ pill }: { pill: { src: string; width: number; height: number } }) {
  return (
    <Marquee duration={DURATION} repeat={3} sync>
      <div className="flex h-[39px] shrink-0 items-center gap-[3px] pr-16 lg:h-[78px] lg:gap-1.5 lg:pr-32">
        <span className="block h-full" style={{ aspectRatio: `${DIJIT_W} / 30` }}>
          <Dijit />
        </span>
        <img src={pill.src} alt="" width={pill.width} height={pill.height} className="block h-full w-auto" />
        <span className="block h-full" style={{ aspectRatio: `${ALLY_W} / 30` }}>
          <Ally />
        </span>
      </div>
    </Marquee>
  );
}
