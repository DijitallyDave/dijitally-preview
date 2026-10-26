import Image from "next/image";
import Lede from "../Lede";

/**
 * The close of a case study: a parting line, then the next case study: its photo beside a
 * square panel in the client's brand colour with the title and partnership details.
 */
export default function UpNext({
  lead,
  body,
  title,
  meta,
  href,
  image,
  alt,
  background,
  color,
}: {
  lead: string;
  body: string;
  title: string;
  meta: string;
  href: string;
  image: string;
  alt: string;
  background?: string;
  /** The next client's brand colour, for the square title panel. */
  color: string;
}) {
  return (
    <section data-nav-bg="page" className="flex flex-col gap-16 bg-primary px-6 py-16 lg:gap-32 lg:px-[42px] lg:py-32">
      <div className="lg:px-[42px]">
        <Lede lead={lead} className="max-w-[820px]">
          {body}
        </Lede>
      </div>

      {/* The photo, with a square panel in the client's colour to its right holding the title,
          set apart by the page margin (24px mobile, 42px desktop). Stacked on mobile. */}
      <a href={href} className="group grid grid-cols-1 gap-6 outline-none lg:grid-cols-[1fr_auto] lg:gap-[42px]">
        <span
          className="relative block aspect-[16/9] w-full overflow-hidden rounded-[4px] group-focus-visible:ring-2 group-focus-visible:ring-secondary lg:aspect-auto lg:h-full lg:rounded-[8px]"
          style={background ? { background } : undefined}
        >
          <Image
            src={image}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </span>
        <span
          className="flex aspect-square w-full flex-col justify-between rounded-[4px] p-6 text-coal lg:w-[clamp(320px,32vw,560px)] lg:rounded-[8px] lg:p-[42px]"
          style={{ background: color }}
        >
          <span className="font-mono text-[10px] uppercase leading-none lg:text-[12px]">Up next</span>
          <span className="flex flex-col items-start gap-3.5">
            <span className="trim text-[32px] leading-none tracking-[-0.64px] lg:text-[48px] lg:tracking-[-0.96px]">{title}</span>
            <span className="font-mono text-[8px] leading-none tracking-[-0.16px] lg:text-[10px] lg:tracking-[-0.2px]">{meta}</span>
          </span>
        </span>
      </a>
    </section>
  );
}
