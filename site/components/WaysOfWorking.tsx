import Image from "next/image";
import Lede from "./Lede";

const MODELS = [
  {
    title: "Enablement.",
    body: "Get a plug-and-play in-house team that integrates into your business with complete transparency and flexibility. With us handling everything behind the scenes, you get simple monthly costs with minimal admin and overheads.",
    points: ["Embedded expertise", "Team augmentation", "Internal capability building"],
    image: "/figma/model-enablement.png",
    alt: "Desk with a laptop showing the Dijitally logo",
  },
  {
    title: "Execution.",
    body: "Tap into our agency team's high-impact capabilities, from upstream strategic architecture and engineering, to downstream creative development and execution. With full flexibility to enable efficient execution across every stage of growth.",
    points: ["Strategy + Media + Performance", "Platforms + Experience", "Creative + Production"],
    image: "/figma/model-execution.png",
    alt: "Desk with a monitor showing the Ally wordmark",
  },
];

export default function WaysOfWorking() {
  return (
    <section id="ways-of-working" data-nav-bg="page" className="flex flex-col gap-16 pb-[42px] pt-20 lg:gap-32 lg:pt-32">
      <div className="px-4 sm:px-6 lg:px-[84px]">
        <Lede lead="Flexible ways of working." className="max-w-[626px]">
          We acknowledge the realities of a modern balance sheet, so you can ally with us at any stage of the process,
          from experience to execution.
        </Lede>
      </div>

      <div className="flex flex-col gap-4 px-4 sm:px-6 lg:gap-[42px] lg:px-[42px]">
        {MODELS.map((m) => (
          <article
            key={m.title}
            className="flex flex-col-reverse gap-8 overflow-clip rounded-[8px] bg-ui p-6 lg:h-[600px] lg:flex-row lg:items-center lg:gap-[42px] lg:p-[42px]"
          >
            <div className="flex flex-1 flex-col justify-center gap-[42px]">
              <div className="flex max-w-[490px] flex-col gap-6">
                <h3 className="trim text-[32px] leading-none tracking-[-0.64px] lg:text-[38px] lg:tracking-[-0.76px]">
                  {m.title}
                </h3>
                <p className="trim text-[20px] leading-[1.1] tracking-[-0.4px] text-wcag lg:text-h3">{m.body}</p>
              </div>
              <ul className="flex w-full max-w-[316px] flex-col gap-[18px]">
                {m.points.map((p, i) => (
                  <li
                    key={p}
                    className={`flex items-center gap-2.5 ${i < m.points.length - 1 ? "border-b border-grey pb-5" : ""}`}
                  >
                    <span className="size-1 shrink-0 bg-secondary" />
                    <span className="trim flex-1 text-[18px] leading-[1.2]">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-[731/516] w-full shrink-0 overflow-hidden rounded-[4px] lg:h-[516px] lg:w-[731px] lg:max-w-[50%] lg:aspect-auto">
              <Image src={m.image} alt={m.alt} fill sizes="(min-width: 1024px) 731px, 100vw" className="object-cover" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
