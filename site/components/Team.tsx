import Image from "next/image";
import Lede from "./Lede";
import Marquee from "./Marquee";
import { asset } from "./asset";

const ALLIES = [
  { role: "Founding ally.", image: asset("/figma/team-founding.jpg"), position: "50% 0%" },
  { role: "Strategic ally.", image: asset("/figma/team-strategic.png"), position: "50% 50%" },
  { role: "Engineering ally.", image: asset("/figma/team-engineering.png"), position: "50% 40%" },
  { role: "Talent ally.", image: asset("/figma/team-talent.png"), position: "50% 30%" },
  { role: "Creative ally.", image: asset("/figma/team-creative.png"), position: "50% 40%" },
];

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
          <div key={a.role} className="shrink-0 pr-6 lg:pr-[42px]">
            <div className="group/card relative flex size-[260px] items-end overflow-clip rounded-[4px] bg-black p-6 lg:h-[470px] lg:w-[380px] lg:rounded-[8px] lg:p-[42px]">
              <Image
                src={a.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 380px, 260px"
                draggable={false}
                className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.05]"
                style={{ objectPosition: a.position }}
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
