import Image from "next/image";
import Lede from "../Lede";

/**
 * The close of a case study: a parting line, then the next case study as a large card in the
 * style of the homepage's work carousel (photo, title, mono label).
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
}: {
  lead: string;
  body: string;
  title: string;
  meta: string;
  href: string;
  image: string;
  alt: string;
  background?: string;
}) {
  return (
    <section data-nav-bg="page" className="flex flex-col gap-16 bg-primary px-6 py-16 lg:gap-32 lg:px-[42px] lg:py-32">
      <div className="lg:px-[42px]">
        <Lede lead={lead} className="max-w-[820px]">
          {body}
        </Lede>
      </div>

      <a href={href} className="group flex flex-col gap-6 outline-none">
        <span className="font-mono text-[10px] uppercase leading-none text-static lg:text-[12px]">Up next</span>
        <span
          className="relative block aspect-[4/5] w-full overflow-hidden rounded-[4px] group-focus-visible:ring-2 group-focus-visible:ring-secondary sm:aspect-[16/9] lg:aspect-[21/9] lg:rounded-[8px]"
          style={background ? { background } : undefined}
        >
          <Image
            src={image}
            alt={alt}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </span>
        <div className="flex flex-col items-start gap-3.5">
          <span className="trim text-[22px] leading-[1.2] transition-colors group-hover:text-wcag lg:text-[38px] lg:tracking-[-0.76px]">
            {title}
          </span>
          <p className="font-mono text-[8px] leading-none tracking-[-0.16px] text-static lg:text-[10px] lg:tracking-[-0.2px]">{meta}</p>
        </div>
      </a>
    </section>
  );
}
