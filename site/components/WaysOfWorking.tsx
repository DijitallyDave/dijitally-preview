import Image from "next/image";
import Lede from "./Lede";
import { asset } from "./asset";

const MODELS = [
  {
    title: "Enablement.",
    body: "Get a plug-and-play in-house team that integrates into your business with complete transparency and flexibility. We handle everything behind the scenes, and you get simple monthly costs with minimal admin and overheads.",
    points: ["Embedded expertise", "Team augmentation", "Internal capability building"],
    image: asset("/figma/model-execution.png"),
    alt: "Desk with a monitor showing the Ally wordmark",
  },
  {
    title: "Execution.",
    body: "Tap into our agency team's high-impact capabilities, from upstream strategic architecture and engineering, to downstream creative development and execution. With full flexibility to enable efficient execution across every stage of growth.",
    points: ["Strategy + Media + Performance", "Platforms + Experience", "Creative + Production"],
    image: asset("/figma/model-enablement.png"),
    alt: "Desk with a laptop showing the Dijitally logo",
  },
];

export default function WaysOfWorking() {
  return (
    <section id="ways-of-working" data-nav-bg="page" className="flex flex-col gap-[106px] pb-[42px] pt-16 lg:gap-32 lg:pt-32">
      <div className="px-6 lg:px-[84px]">
        <Lede lead="Flexible ways of working." className="max-w-[626px]">
          We acknowledge the realities of a modern balance sheet, so you can ally with us at any stage of the process,
          from experience to execution.
        </Lede>
      </div>

      <div className="flex flex-col gap-8 px-6 lg:gap-[42px] lg:px-[42px]">
        {MODELS.map((m) => (
          <article
            key={m.title}
            className="flex flex-col-reverse gap-8 overflow-clip rounded-[4px] bg-ui p-3 pb-[42px] lg:h-[600px] lg:flex-row lg:items-center lg:gap-[42px] lg:rounded-[8px] lg:p-[42px]"
          >
            <div className="flex flex-1 flex-col justify-center gap-[42px] px-[18px] lg:px-0">
              <div className="flex max-w-[490px] flex-col gap-[18px] lg:gap-6">
                <h3 className="trim text-h1-mobile lg:text-[38px] lg:leading-none lg:tracking-[-0.76px]">
                  {m.title}
                </h3>
                <p className="trim text-body-mobile lg:text-h3 lg:text-wcag">{m.body}</p>
              </div>
              <ul className="flex w-full max-w-[316px] flex-col gap-[18px]">
                {m.points.map((p, i) => (
                  <li
                    key={p}
                    className={`flex items-center gap-2.5 ${i < m.points.length - 1 ? "border-b border-grey pb-3 lg:pb-5" : ""}`}
                  >
                    <span className="size-1 shrink-0 bg-secondary" />
                    <span className="trim flex-1 text-[17px] leading-[1.2] lg:text-[18px]">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-[193px] w-full shrink-0 overflow-hidden rounded-[2px] lg:h-[516px] lg:w-[731px] lg:max-w-[50%] lg:rounded-[4px]">
              <Image src={m.image} alt={m.alt} fill sizes="(min-width: 1024px) 731px, 100vw" className="object-cover" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
