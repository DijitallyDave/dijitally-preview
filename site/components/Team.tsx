import Image from "next/image";
import Lede from "./Lede";

const ALLIES = [
  { role: "Founding ally.", image: "/figma/team-founding.jpg", position: "50% 0%" },
  { role: "Strategic ally.", image: "/figma/team-strategic.png", position: "38% 30%" },
  { role: "Engineering ally.", image: "/figma/team-engineering.png", position: "50% 40%" },
  { role: "Talent ally.", image: "/figma/team-talent.png", position: "50% 30%" },
  { role: "Creative ally.", image: "/figma/team-creative.png", position: "50% 40%" },
];

export default function Team() {
  return (
    <section id="allies" className="flex flex-col gap-16 overflow-x-clip bg-primary py-28 lg:gap-32 lg:py-[196px]">
      <div className="px-4 sm:px-6 lg:px-16">
        <Lede lead="A team of allies." className="max-w-[716px]">
          A collective of international professionals including creative, strategy, marketing, development, CRM, data
          science and much more.
        </Lede>
      </div>

      {/* Desktop: centred row that bleeds off both edges, as in Figma. Mobile: swipeable. */}
      <ul className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:px-6 lg:justify-center lg:gap-[42px] lg:overflow-visible lg:px-0">
        {ALLIES.map((a) => (
          <li
            key={a.role}
            className="group relative flex h-[400px] w-[300px] shrink-0 snap-center items-end overflow-clip rounded-[8px] bg-black p-8 lg:h-[470px] lg:w-[380px] lg:p-[42px]"
          >
            <Image
              src={a.image}
              alt=""
              fill
              sizes="380px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              style={{ objectPosition: a.position }}
            />
            <span className="trim relative w-full max-w-[286px] text-[28px] leading-none tracking-[-0.56px] text-primary lg:text-[32px] lg:tracking-[-0.64px]">
              {a.role}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
