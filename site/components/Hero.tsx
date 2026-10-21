import HeroAllyCard from "./HeroAllyCard";
import HeroHeadline from "./HeroHeadline";
import HeroReel from "./HeroReel";
import HeroSlideshow, { HeroSlidesProvider } from "./HeroSlideshow";
import { asset } from "./asset";

// Desktop follows the Figma "Hero" (1690); below lg it follows the mobile "Hero" (415).
export default function Hero() {
  return (
    <section id="top" data-nav-bg="dark" className="relative flex h-svh min-h-[640px] flex-col overflow-clip bg-ink lg:gap-16">
      <HeroSlidesProvider>
        {/* Photo slideshow with the melt transition; images and timing in heroSlides.config.ts.
            Mobile: the photo fills the lower ~60% of the hero, below the headline (Figma mobile frame). */}
        <HeroSlideshow className="absolute left-1/2 top-[40.36%] aspect-[2720/1530] h-[59.63%] -translate-x-1/2 lg:left-[5.53%] lg:top-[12.33%] lg:aspect-auto lg:h-[87.67%] lg:w-[88.94%] lg:translate-x-0" />

        {/* Desktop: reserves the fixed nav's height (published by Nav as --nav-h). On mobile the
            nav is just a toggle + menu icon over the hero's own top padding. */}
        <div aria-hidden className="hidden h-[var(--nav-h,115px)] shrink-0 lg:block" />

        <div className="relative flex w-full flex-1 flex-col justify-between gap-16 px-[30px] pb-6 pt-[94px] lg:gap-12 lg:px-[42px] lg:pb-[42px] lg:pt-0">
          <div className="flex flex-col items-center gap-[42px] lg:items-start">
            <img
              src={asset("/figma/wordmark.svg")}
              alt="Dijitally"
              width={215.856}
              height={30}
              className="block h-auto w-full max-w-[356px] lg:hidden"
            />

            {/* First line flush right, the rest left. The indent classes are the minimum opening
                indent from each Figma frame (mobile puts only "Brands don't need" on line one);
                HeroHeadline then tops it up to sit flush right. */}
            <HeroHeadline className="trim w-full max-w-[356px] indent-[4em] text-h1-mobile text-snow lg:max-w-[530px] lg:indent-[146px] lg:text-h1">
              Brands don’t need another agency.{" "}
              <span className="text-stone">They need an ally that can flex with the ever-changing world around them.</span>
            </HeroHeadline>
          </div>

          <div className="flex items-end justify-between gap-4">
            <HeroAllyCard />

            <a
              href="#work"
              aria-label="Recent work"
              className="group flex flex-col items-start gap-5 rounded-[8px] bg-zero-dark p-3 transition-colors hover:bg-[#262626] lg:p-5"
            >
              <span className="block overflow-hidden rounded-[3px]">
                <span className="block transition-transform duration-500 group-hover:scale-[1.03]">
                  <HeroReel />
                </span>
              </span>
              {/* The label only appears in the desktop design */}
              <span className="hidden items-center gap-1 text-snow lg:flex">
                <span className="size-[3px] bg-snow transition-colors group-hover:bg-tech" />
                <span className="trim text-[16px] font-medium leading-none">Recent work</span>
              </span>
            </a>
          </div>
        </div>
      </HeroSlidesProvider>
    </section>
  );
}
