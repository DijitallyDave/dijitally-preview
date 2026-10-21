import Lede from "./Lede";

type Logo = { name: string; src: string; w: number; h: number };

const LOGOS: Logo[] = [
  { name: "Afterpay", src: "/figma/logo-afterpay.svg", w: 114.943, h: 40 },
  { name: "Airwallex", src: "/figma/logo-airwallex.svg", w: 120.116, h: 16.456 },
  { name: "SYD", src: "/figma/logo-syd.svg", w: 56.609, h: 21.941 },
  { name: "Constantinople", src: "/figma/logo-constantinople.svg", w: 110.041, h: 16 },
  { name: "Procore", src: "/figma/logo-procore.svg", w: 113.553, h: 14.262 },
];

// Blackmores is exported from Figma as a stack of masked layers.
const BLACKMORES_MASKS = Array.from({ length: 9 }, (_, i) => `/figma/blackmores/mask-${i}.svg`);

const tile =
  "flex size-[150px] shrink-0 items-center justify-center rounded-[4px] bg-ui transition-transform duration-300 hover:-translate-y-1";

export default function Brands() {
  return (
    <section className="flex flex-col gap-12 px-4 py-20 sm:px-6 lg:flex-row lg:items-start lg:justify-center lg:px-[84px] lg:py-32">
      <div className="flex-1">
        <Lede lead="The brands we ally with." className="max-w-[530px]">
          Both as an internal and external partner.
        </Lede>
      </div>

      <ul className="flex flex-wrap content-start gap-6 lg:w-[585px] lg:justify-end">
        {LOGOS.map((l) => (
          <li key={l.name} className={tile}>
            <img src={l.src} alt={l.name} width={l.w} height={l.h} />
          </li>
        ))}
        <li className="size-[150px] shrink-0 transition-transform duration-300 hover:-translate-y-1">
          <img src="/figma/logo-roomstay.svg" alt="RoomStay" width={150} height={150} />
        </li>
        <li className="size-[150px] shrink-0 transition-transform duration-300 hover:-translate-y-1">
          <img src="/figma/logo-travelnsw.svg" alt="Travel NSW" width={150} height={150} />
        </li>
        <li className={tile}>
          <span role="img" aria-label="Blackmores" className="relative block h-[10px] w-[105.175px] overflow-clip">
            <span className="absolute" style={{ inset: "2.9% 0.04% 78.6% 97.96%" }}>
              <img src="/figma/blackmores/fill-1.svg" alt="" className="absolute inset-0 block size-full max-w-none" />
            </span>
            {BLACKMORES_MASKS.map((src) => (
              <span key={src} className="absolute" style={{ inset: "0.63% 0.59% 0.09% 0.01%" }}>
                <img src={src} alt="" className="absolute inset-0 block size-full max-w-none" />
              </span>
            ))}
          </span>
        </li>
      </ul>
    </section>
  );
}
