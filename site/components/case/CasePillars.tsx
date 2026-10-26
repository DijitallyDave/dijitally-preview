import Lede from "../Lede";

/**
 * Capabilities as tiles on the UI grey of the homepage's logo wall, numbered in the mono
 * label style. On wide screens all six share one row across the page, their widths and type
 * fluid; they fall to three columns, then two, as the page narrows.
 */
export default function CasePillars({ lead, body, pillars }: { lead: string; body: string; pillars: string[] }) {
  return (
    <section data-nav-bg="page" className="flex flex-col gap-16 bg-primary px-6 py-16 lg:gap-32 lg:px-[42px] lg:py-32">
      <div className="lg:px-[42px]">
        <Lede lead={lead} className="max-w-[716px]">
          {body}
        </Lede>
      </div>
      <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-6 xl:grid-cols-6">
        {pillars.map((p, i) => (
          <li
            key={p}
            className="flex min-h-[150px] flex-col justify-between gap-6 rounded-[4px] bg-ui p-4 lg:min-h-[220px] lg:rounded-[8px] lg:p-6 2xl:p-[42px]"
          >
            <span className="font-mono text-[10px] leading-none text-static lg:text-[12px]">
              {String(i + 1).padStart(2, "0")}
            </span>
            {/* Scales with the page so the names fit a sixth of it: 26px at 1280px, 38px by 1900px */}
            <span className="trim text-[20px] leading-[1.1] tracking-[-0.02em] lg:text-[clamp(26px,2vw,38px)] lg:leading-none">
              {p}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
