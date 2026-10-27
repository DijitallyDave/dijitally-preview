import SplitHeading from "../SplitHeading";
import RevealImage from "./RevealImage";

export type CaseImage = { src: string; alt: string; width: number; height: number };

/**
 * Desktop width of a client logo, so a long thin wordmark and a chunky lockup read as the same
 * size rather than the same width or height. Matching areas exactly (width growing with the
 * square root of the aspect ratio) left the chunky ones looking small; a 0.4 power evens it out.
 */
const logoWidth = ({ width, height }: { width: number; height: number }) => 65.5 * (width / height) ** 0.4;

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
  sheet = false,
  logo,
}: {
  lead: string;
  follow: string;
  meta: string[];
  image: CaseImage;
  /** The top of a sheet laid over the image (see CaseStudyPage), so no image card here. */
  sheet?: boolean;
  /** The client's logo (dark artwork), top right of the sheet. */
  logo?: { src: string; width: number; height: number; alt: string };
}) {
  const heading = (
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
      {/* Plays on arrival rather than on scroll: at the foot of the screen it can sit below the
          scroll trigger's line. On a sheet, as wide as the intro under it (Stats' 716px). */}
      <SplitHeading as="h1" onLoad className={`trim w-full text-h1-mobile lg:text-h1 ${sheet ? "lg:max-w-[716px]" : "lg:max-w-[530px]"}`}>
        {lead} <span className="text-static">{follow}</span>
      </SplitHeading>
    </div>
  );

  // On a sheet (see CaseStudyPage) this is the sheet's top, wrapped tight around the headline:
  // the space above it matches the space to its left (24px on mobile, 84px on desktop). The
  // page's #top is the page itself, since this starts partway down the screen.
  if (sheet)
    return (
      <section
        data-nav-bg="page"
        className="case-sheet relative rounded-t-[4px] bg-primary p-6 lg:rounded-t-[8px] lg:px-[42px] lg:pb-[42px] lg:pt-[84px]"
      >
        {/* The client's logo, top right: on desktop level with the eyebrow and as far in from
            the right as the text is from the left; on mobile, where the eyebrow takes the full
            width, on its own line above it at three-quarter size. Lightened in dark mode. */}
        {logo && (
          <img
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            style={{ "--w": `${logoWidth(logo)}px` } as React.CSSProperties}
            className="mb-6 ml-auto block h-auto w-[calc(var(--w)*0.75)] dark:invert lg:absolute lg:right-[84px] lg:top-[90px] lg:mb-0 lg:w-(--w) lg:-translate-y-1/2"
          />
        )}
        {heading}
      </section>
    );

  return (
    <section
      id="top"
      data-nav-bg="page"
      // A full screen tall, like the homepage hero, with the image card in the bottom-right
      // corner at the nav's distance from the edges: 24px on mobile, 42px on desktop. On mobile
      // half a screen is enough (a full one left a lot of empty space); it grows to fit if needed.
      className="flex min-h-[50svh] flex-col justify-between gap-16 bg-primary px-6 pb-6 pt-[120px] lg:min-h-svh lg:px-[42px] lg:pb-[42px] lg:pt-[230px]"
    >
      {heading}
      {/* The frame is Figma "UI" in light mode and the card's zero-dark in dark mode */}
      <div className="self-end rounded-[8px] bg-ui p-3 lg:p-5 dark:bg-zero-dark">
        {/* On desktop the image is 714px wide when the window is tall enough, and shrinks with
            the window's height so the hero still fits one screen (the 570px is everything
            above and around it), down to the homepage card's 357px at the least. */}
        <div className="w-[274px] overflow-hidden rounded-[3px] lg:w-[clamp(357px,calc((100svh-570px)*16/9),714px)]">
          <RevealImage {...image} width={16} height={9} priority sizes="(min-width: 1024px) 714px, 274px" className="rounded-none!" />
        </div>
      </div>
    </section>
  );
}
