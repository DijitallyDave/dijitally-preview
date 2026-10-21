import Image from "next/image";
import Lede from "./Lede";
import Marquee from "./Marquee";
import { asset } from "./asset";
import { HERO_SLIDES } from "./heroSlides.config";

// The allies are the same people as the hero slideshow, so adding someone to HERO_SLIDES in
// heroSlides.config.ts adds their card here too. Their wide (2535×1448) photos are cropped to
// the centre of each portrait card, where the person stands.
const ALLIES = HERO_SLIDES.map((s) => ({ name: s.name, role: `${s.role}.`, image: asset(s.src) }));

export default function Team() {
  return (
    <section id="allies" data-nav-bg="page" className="flex flex-col gap-16 overflow-x-clip bg-primary py-16 lg:gap-32 lg:py-[196px]">
      <div className="px-6 lg:px-16">
        <Lede lead="A team of allies." className="max-w-[716px]">
          A collective of international professionals including creative, strategy, marketing, development, CRM, data
          science and much more.
        </Lede>
      </div>

      <Marquee duration={70} repeat={2} label="Our allies">
        {ALLIES.map((a) => (
          <div key={a.name} className="shrink-0 pr-6 lg:pr-[42px]">
            <div className="group/card relative flex size-[260px] items-end overflow-clip rounded-[4px] bg-black p-6 lg:h-[470px] lg:w-[380px] lg:rounded-[8px] lg:p-[42px]">
              <Image
                src={a.image}
                alt={a.name}
                fill
                // The wide photo is cropped into a tall card, so it renders about 1.75× the
                // card's height wide (≈830px desktop, ≈460px mobile) — not the card's width.
                sizes="(min-width: 1024px) 830px, 460px"
                draggable={false}
                className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.05]"
              />
              <span className="trim relative w-full max-w-[176px] text-[24px] leading-none tracking-[-0.48px] text-snow lg:max-w-[286px] lg:text-[32px] lg:tracking-[-0.64px]">
                {a.role}
              </span>
            </div>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
