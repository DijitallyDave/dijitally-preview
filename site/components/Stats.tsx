import Lede from "./Lede";

const STATS = [
  { value: "14", label: "years of operation.", highlight: true },
  { value: "8", label: "countries and counting." },
  { value: "42", label: "strong, your team of allies." },
  { value: "24", label: "hour service, follow the sun." },
];

export default function Stats() {
  return (
    <section className="flex flex-col gap-16 pb-[42px] pt-20 lg:gap-32 lg:pt-32">
      <div className="px-4 sm:px-6 lg:px-[84px]">
        <Lede lead="A true ally." className="max-w-[716px]">
          We bring the understanding of an in-house team and the ease of an agency.
        </Lede>
      </div>

      <ul className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:gap-[42px] lg:px-[42px] xl:grid-cols-4">
        {STATS.map((s) => (
          <li
            key={s.value}
            className={`flex h-[280px] items-center overflow-clip rounded-[8px] p-8 lg:h-[370px] lg:p-[42px] ${
              s.highlight ? "bg-tech text-coal" : "bg-ui"
            }`}
          >
            <div className="flex w-full max-w-[286px] flex-col gap-6">
              <span className="trim text-[96px] leading-none tracking-[-1.92px] lg:text-[128px] lg:tracking-[-2.56px]">
                {s.value}
              </span>
              <span
                className={`trim text-[32px] leading-none tracking-[-0.64px] lg:text-[42px] lg:tracking-[-0.84px] ${
                  s.highlight ? "" : "text-static"
                }`}
              >
                {s.label}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
