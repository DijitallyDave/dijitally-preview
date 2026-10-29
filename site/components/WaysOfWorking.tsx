import Image from "next/image";
import Lede from "./Lede";
import { asset } from "./asset";

/** `image` is optional: without one the card is text only. */
export type Model = { title: string; body: string; points: string[]; image?: string; alt?: string };

const MODELS: Model[] = [
  {
    title: "Enablement.",
    body: "Get a plug-and-play in-house team that integrates into your business with complete transparency and flexibility. We handle everything behind the scenes, and you get simple monthly costs with minimal admin and overheads.",
    points: ["Embedded expertise", "Team augmentation", "Internal capability building"],
    image: asset("/services/enablement.webp"),
    alt: "Diagram of Dijitally allies, a creative and a producer, slotting into your company's team",
  },
  {
    title: "Execution.",
    body: "Tap into our agency team's high-impact capabilities, from upstream strategic architecture and engineering, to downstream creative development and execution. With full flexibility to enable efficient execution across every stage of growth.",
    points: ["Strategy + Media + Performance", "Platforms + Experience", "Creative + Production"],
    image: asset("/services/execution.webp"),
    alt: "List of capabilities from engineering and production to strategy, media, branding and social",
  },
];

// Defaults to the homepage's Enablement and Execution; case studies pass their own models.
// `aspect` is the artwork's shape: the homepage diagrams are 731:516 and must not be cropped.
// `columns` sets the cards side by side on desktop, each with its image above its text,
// instead of one full-width card per row.
export default function WaysOfWorking({
  id = "ways-of-working",
  lead = "Flexible ways of working.",
  body = "We acknowledge the realities of a modern balance sheet, so you can ally with us at any stage of the process, from experience to execution.",
  models = MODELS,
  aspect = "731 / 516",
  columns = false,
  detail,
  inset = false,
}: {
  id?: string;
  lead?: string;
  body?: React.ReactNode;
  models?: Model[];
  aspect?: string;
  columns?: boolean;
  /** Body copy under the heading, set like a case study's opening paragraph. */
  detail?: string;
  /** Side by side, set the cards in at twice the intro's margin (168px on desktop), as in a case study. */
  inset?: boolean;
}) {
  return (
    <section id={id} data-nav-bg="page" className="flex flex-col gap-[106px] bg-primary pb-[42px] pt-16 lg:gap-32 lg:pt-32">
      <div className="px-6 lg:px-[84px]">
        <Lede lead={lead} className="max-w-[626px]">
          {body}
        </Lede>
        {detail && <p className="trim mt-6 max-w-[716px] text-body-mobile lg:mt-[42px] lg:text-h3 lg:text-wcag">{detail}</p>}
      </div>

      {/* Side by side, the cards take the intro's 84px margins so the pair sits under its text */}
      <div className={`flex flex-col gap-8 px-6 lg:gap-[42px] ${columns ? `lg:grid lg:grid-cols-2 ${inset ? "lg:px-[168px]" : "lg:px-[84px]"}` : "lg:px-[42px]"}`}>
        {models.map((m) => (
          <article
            key={m.title}
            className={`flex flex-col-reverse gap-8 overflow-clip rounded-[4px] bg-ui p-3 pb-[42px] lg:gap-[42px] lg:rounded-[8px] lg:p-[42px] ${
              columns ? "lg:justify-end" : "lg:h-[600px] lg:flex-row lg:items-center"
            }`}
          >
            {/* Side by side, text starts under the image so both cards' titles line up */}
            <div className={`flex flex-1 flex-col gap-[42px] px-[18px] lg:px-0 ${columns ? "justify-start" : "justify-center"}`}>
              {/* Side by side, the copy fills the card; a full-width card keeps it to a readable 490px */}
              <div className={`flex flex-col gap-[18px] lg:gap-6 ${columns ? "" : "max-w-[490px]"}`}>
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
            {/* Locked to the artwork's shape so diagrams are never cropped */}
            {m.image && (
              <div
                style={{ aspectRatio: aspect }}
                className={`relative w-full shrink-0 overflow-hidden rounded-[2px] lg:rounded-[4px] ${columns ? "" : "lg:w-[731px] lg:max-w-[50%]"}`}
              >
                <Image src={m.image} alt={m.alt ?? ""} fill sizes={columns ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 731px, 100vw"} className="object-cover" />
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
