"use client";

import { asset } from "./asset";
import { useHeroSlide } from "./HeroSlideshow";

// Name card in the hero's bottom-left corner; follows the slide on show. The role is the larger
// line; the mobile card is 146px (Figma: 137) so the longest role, "Engineering ally", fits on one line.
export default function HeroAllyCard() {
  const slide = useHeroSlide();

  return (
    <a
      href="#allies"
      className="group flex w-[146px] shrink-0 items-center gap-3 rounded-[8px] bg-zero-dark p-4 transition-colors hover:bg-[#262626] lg:w-[207px] lg:py-1 lg:pl-1 lg:pr-6"
    >
      {/* Desktop thumbnail: the slide's photo cropped to the face (the Figma crop of the hero shot) */}
      <span
        aria-hidden
        className="hidden h-20 w-16 shrink-0 rounded-[4px] bg-ink bg-no-repeat lg:block"
        style={{
          backgroundImage: `url(${asset(slide.src)})`,
          backgroundSize: "204.69% 92.11%",
          backgroundPosition: "50% 143.7%",
        }}
      />
      {/* Keyed so the text re-mounts and fades in when the slide changes */}
      <span
        key={slide.name}
        className="flex flex-col items-start gap-2 text-snow transition-opacity duration-500 starting:opacity-0"
      >
        <span className="trim whitespace-nowrap text-[12px] font-medium leading-none">{slide.name}</span>
        <span className="flex items-center gap-1">
          <span className="size-[3px] bg-snow transition-colors group-hover:bg-tech" />
          <span className="trim whitespace-nowrap text-[16px] font-regular leading-none">{slide.role}</span>
        </span>
      </span>
    </a>
  );
}
