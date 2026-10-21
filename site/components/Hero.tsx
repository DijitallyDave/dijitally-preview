import Image from "next/image";
import HeroHeadline from "./HeroHeadline";
import HeroReel from "./HeroReel";
import { asset } from "./asset";

// Desktop follows the Figma "Hero" (1690); below lg it follows the mobile "Hero" (415).
export default function Hero() {
  return (
    <section id="top" data-nav-bg="dark" className="relative flex h-svh min-h-[640px] flex-col overflow-clip bg-ink lg:gap-16">
      {/* Mobile: the photo fills the lower ~60% of the hero, below the headline (Figma mobile frame). */}
      <Image
        src={asset("/figma/hero.png")}
        alt=""
        width={2720}
        height={1530}
        priority
        sizes="(min-width: 1024px) 89vw, 215vw"
        className="pointer-events-none absolute left-1/2 top-[40.36%] h-[59.63%] w-auto max-w-none -translate-x-1/2 object-cover lg:left-[5.53%] lg:top-[12.33%] lg:h-[87.67%] lg:w-[88.94%] lg:translate-x-0"
      />

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
          <a
            href="#allies"
            className="group flex w-[137px] shrink-0 items-center gap-3 rounded-[8px] bg-zero-dark p-4 transition-colors hover:bg-[#262626] lg:w-[207px] lg:py-1 lg:pl-1 lg:pr-6"
          >
            <span
              aria-hidden
              className="hidden h-20 w-16 shrink-0 rounded-[4px] bg-ink bg-no-repeat lg:block"
              style={{
                backgroundImage: `url(${asset("/figma/hero.png")})`,
                backgroundSize: "204.69% 92.11%",
                backgroundPosition: "50% 143.7%",
              }}
            />
            <span className="flex flex-col items-start gap-2 text-snow">
              <span className="trim text-[16px] font-medium leading-none">Zara</span>
              <span className="flex items-center gap-1">
                <span className="size-[3px] bg-snow transition-colors group-hover:bg-tech" />
                <span className="trim text-[12px] font-regular leading-none">Strategic ally</span>
              </span>
            </span>
          </a>

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
    </section>
  );
}
