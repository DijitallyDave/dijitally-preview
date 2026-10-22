import Lede from "./Lede";
import { asset } from "./asset";

type Logo = { name: string; src: string; w: number; h: number };

const LOGOS: Logo[] = [
  { name: "Afterpay", src: asset("/figma/logo-afterpay.svg"), w: 114.943, h: 40 },
  { name: "Airwallex", src: asset("/figma/logo-airwallex.svg"), w: 120.116, h: 16.456 },
  { name: "SYD", src: asset("/figma/logo-syd.svg"), w: 56.609, h: 21.941 },
  { name: "Constantinople", src: asset("/figma/logo-constantinople.svg"), w: 110.041, h: 16 },
  { name: "Procore", src: asset("/figma/logo-procore.svg"), w: 113.553, h: 14.262 },
];

// Blackmores is exported from Figma as a stack of masked layers.
const BLACKMORES_MASKS = Array.from({ length: 9 }, (_, i) => asset(`/figma/blackmores/mask-${i}.svg`));

// Logo SVGs are exported in black; in dark mode they're inverted to sit on the dark UI tiles.
// (RoomStay and Travel NSW bake in a #f6f6f6 tile, which inverts to #090909 — dark UI exactly.)
// Tiles are 150px on desktop and fill a 3-column grid on mobile, so logos are sized as a
// fraction of the tile (their Figma size on a 150px tile) and scale with it.
const tile =
  "flex aspect-square w-full shrink-0 items-center justify-center rounded-[4px] bg-ui transition-transform duration-300 hover:-translate-y-1 dark:[&_img]:invert lg:size-[150px]";
const bakedTile =
  "aspect-square w-full shrink-0 transition-transform duration-300 hover:-translate-y-1 dark:[&_img]:invert lg:size-[150px]";
const ofTile = (px: number) => `${(px / 150) * 100}%`;

export default function Brands() {
  return (
    <section data-nav-bg="page" className="flex flex-col gap-16 px-6 py-16 lg:flex-row lg:items-start lg:justify-center lg:gap-12 lg:px-[84px] lg:py-32">
      <div className="flex-1">
        <Lede lead="The brands we ally with." className="max-w-[530px]">
          Both as an internal and external partner.
        </Lede>
      </div>

      {/* Mobile: 3 columns across the same 24px margins as the text above */}
      <ul className="grid grid-cols-3 gap-6 lg:flex lg:w-[585px] lg:flex-wrap lg:content-start lg:justify-end">
        {LOGOS.map((l) => (
          <li key={l.name} className={tile}>
            <img src={l.src} alt={l.name} width={l.w} height={l.h} className="h-auto" style={{ width: ofTile(l.w) }} />
          </li>
        ))}
        <li className={bakedTile}>
          <img src={asset("/figma/logo-roomstay.svg")} alt="RoomStay" width={150} height={150} className="size-full" />
        </li>
        <li className={bakedTile}>
          <img src={asset("/figma/logo-travelnsw.svg")} alt="Travel NSW" width={150} height={150} className="size-full" />
        </li>
        <li className={tile}>
          <span
            role="img"
            aria-label="Blackmores"
            className="relative block aspect-[105.175/10] overflow-clip"
            style={{ width: ofTile(105.175) }}
          >
            <span className="absolute" style={{ inset: "2.9% 0.04% 78.6% 97.96%" }}>
              <img src={asset("/figma/blackmores/fill-1.svg")} alt="" className="absolute inset-0 block size-full max-w-none" />
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
