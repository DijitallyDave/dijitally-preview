import Image from "next/image";
import Nav from "./Nav";

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[640px] flex-col gap-16 overflow-clip bg-ink lg:h-svh">
      <Image
        src="/figma/hero.png"
        alt=""
        width={2720}
        height={1530}
        priority
        sizes="(min-width: 1024px) 89vw, 160vw"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[80%] w-auto max-w-none -translate-x-1/2 object-cover lg:left-[5.53%] lg:top-[12.33%] lg:h-[87.67%] lg:w-[88.94%] lg:translate-x-0"
      />

      {/* On narrow screens the headline sits over the face; darken the top for legibility */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-ink via-ink/70 to-transparent lg:hidden" />

      <Nav />

      <div className="relative flex w-full flex-1 flex-col justify-between gap-12 px-4 pb-4 sm:px-6 sm:pb-6 lg:px-[42px] lg:pb-[42px]">
        <h1 className="trim max-w-[530px] text-[32px] leading-none tracking-[-0.64px] text-primary lg:text-h1">
          <span className="lg:inline-block lg:w-[146px]" />
          Brands don’t need another agency.{" "}
          <span className="text-static">They need an ally that can flex with the ever-changing world around them.</span>
        </h1>

        <div className="flex items-end justify-between gap-4">
          <a
            href="#allies"
            className="group flex w-[207px] shrink-0 items-center gap-3 rounded-[8px] bg-panel py-1 pl-1 pr-6 transition-colors hover:bg-[#262626]"
          >
            <span
              aria-hidden
              className="h-20 w-16 shrink-0 rounded-[4px] bg-ink bg-no-repeat"
              style={{
                backgroundImage: "url(/figma/hero.png)",
                backgroundSize: "204.69% 92.11%",
                backgroundPosition: "50% 143.7%",
              }}
            />
            <span className="flex flex-col items-start gap-2 text-primary">
              <span className="trim text-[16px] font-medium leading-none">Zara</span>
              <span className="flex items-center gap-1">
                <span className="size-[3px] bg-primary transition-colors group-hover:bg-tech" />
                <span className="trim text-[12px] font-regular leading-none">Strategic ally</span>
              </span>
            </span>
          </a>

          <a
            href="#work"
            className="group hidden flex-col items-start gap-6 rounded-[8px] bg-panel p-6 transition-colors hover:bg-[#262626] md:flex"
          >
            <span className="block overflow-hidden rounded-[3px]">
              <Image
                src="/figma/recent-work.png"
                alt="Recent work: Constantinople banking website on a laptop"
                width={420}
                height={237}
                className="block h-[236px] w-[420px] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </span>
            <span className="flex items-center gap-1 text-primary">
              <span className="size-[3px] bg-primary transition-colors group-hover:bg-tech" />
              <span className="trim text-[16px] font-medium leading-none">Recent work</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
