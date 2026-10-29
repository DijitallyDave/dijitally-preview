import type { Stat } from "../Stats";
import type { Model } from "../WaysOfWorking";
import type { FaqItem } from "../Faq";
import type { Milestone } from "./CaseTimeline";
import type { CaseImage, CaseVideo } from "./CaseHero";
import { asset } from "../asset";

/**
 * The case studies: one entry per client, rendered by CaseStudyPage at /work/<slug>. The order
 * here is the homepage work carousel's order and each study's "Up next" (the last leads back to
 * the first). Rebuilt from the case studies on www.dijitally.com with the copy condensed, so
 * each point is made once, in the module it belongs to.
 *
 * A study's body is a list of sections, in reading order; each maps to one module.
 */

export type Section =
  | { type: "stats"; lead: string; body: string; items: Stat[] }
  | { type: "intro"; lead: string; body: string; detail?: string }
  | { type: "gallery"; images: (CaseImage | CaseVideo)[] }
  | { type: "models"; lead: string; body: string; detail?: string; models: Model[]; aspect?: string }
  | { type: "quote"; quote: string; name: string; role: string }
  | { type: "pillars"; lead: string; body: string; pillars: string[] }
  | { type: "timeline"; lead: string; body: string; items: Milestone[] }
  | { type: "principles"; follow: string; items: FaqItem[] };

export type CaseStudy = {
  slug: string;
  /** Page title and description, for search results and link previews. */
  title: string;
  description: string;
  /** The social card image, already on www.dijitally.com. */
  ogImage: string;
  /** The client's brand colour, for its panel in the previous study's "Up next". */
  colour: string;
  /** The panel's text colour, when it should be a brand or theme colour (otherwise black or white). */
  panelText?: string;
  /**
   * The client's logo, shown between DIJIT and ALLY in the transition into this study (see
   * PageTransition). Studies without one are opened with a plain page load. `invert` turns a
   * dark logo light for the black transition screen.
   */
  logo?: { src: string; width: number; height: number; invert?: boolean };
  /**
   * The client's pill in the DIJIT · ALLY strip along the foot of the hero (see LogoStrip), as
   * its own artwork. Without one, the strip sets `logo` in a plain white pill.
   */
  pill?: { src: string; width: number; height: number };
  /**
   * A Vimeo video for this study's tile in the previous study's "Up next", in place of the card
   * image: fitted whole and centred, on `background` (the colour of the video's edges).
   */
  upNextVideo?: { vimeo: string; width: number; height: number; background: string };
  /** The homepage work carousel card, also the photo in "Up next". */
  card: {
    title: string;
    meta: string;
    image: string;
    alt: string;
    /** Desktop card shape: tall (504 × 680) or square. */
    tall: boolean;
    /** The image sits inside a black frame rather than filling the card. */
    inset?: boolean;
    /**
     * A Vimeo player URL and its shape, to play muted on a loop over `image` (which still
     * shows while it loads, with reduced motion, and in "Up next").
     */
    video?: { vimeo: string; width: number; height: number };
  };
  /**
   * `vimeo` (a Vimeo player URL, 16:9), on a sheet layout, plays blurred, muted and on a loop
   * behind it instead of showing `image`.
   */
  hero: {
    lead: string;
    follow: string;
    meta: string[];
    image: CaseImage;
    vimeo?: string;
  };
  /**
   * Lay the page out as a UI-coloured sheet over the hero image (which fills the first screen
   * behind it, under a scrim) instead of the image card in the hero's corner.
   */
  sheet?: boolean;
  sections: Section[];
  /** The parting line above "Up next". */
  closing: { lead: string; body: string };
};

const img = (slug: string, name: string, alt: string, width: number, height: number): CaseImage => ({
  src: asset(`/work/${slug}/${name}.webp`),
  alt,
  width,
  height,
});

// Afterpay's 15s APD BVOD spot (16:9), behind the hero and first in the gallery, and the homepage hero's recent-work reel.
export const AFTERPAY_APD = "https://player.vimeo.com/video/1239733480?h=a4200ec4fc";

const EXPONENTIALLY = "There’s a reason you can’t spell exponentially without ally.";

export const STUDIES: CaseStudy[] = [
  {
    slug: "afterpay",
    title: "Afterpay x Ally | Dijitally",
    description:
      "Seven years as Afterpay's point of scale ally: creative, CRM, web, data, embedded teams and B2B strategy across five global markets on a follow-the-sun model.",
    ogImage: "/work/AfterpayxDijitally.jpg",
    // Afterpay's mint (their official logo file is black only)
    colour: "#B2FCE4",
    logo: { src: asset("/figma/logo-afterpay.svg"), width: 114.943, height: 40, invert: true },
    pill: { src: asset("/figma/afterpay-pill.svg"), width: 224.148, height: 78.0034 },
    card: {
      title: "Afterpay x Ally",
      meta: "PARTNERSHIP: 2020 — PRESENT",
      image: asset("/figma/work-afterpay.webp"),
      alt: "Chrome headphones on black",
      tall: true,
      inset: true,
    },
    hero: {
      lead: "Afterpay’s point of scale ally.",
      follow: "Seven years and counting.",
      meta: ["Afterpay x Ally", "Partnership"],
      image: img("afterpay", "billboard-lockup", "Afterpay and Dijitally logos locked up on a large digital billboard in a glass atrium", 2000, 1338),
      // The same APD spot that opens the gallery below, blurred
      vimeo: AFTERPAY_APD,
    },
    sheet: true,
    sections: [
      {
        type: "stats",
        lead: "Since 2020.",
        body: "What began as campaign and engineering support became a full-stack growth partnership.",
        items: [
          { value: 7, label: "years of partnership.", highlight: true },
          { value: 5, label: "global\nmarkets." },
          { value: 24, label: "hour delivery, follow the sun." },
          { value: 2, label: "models, Studio + In‑house." },
        ],
      },
      {
        type: "gallery",
        images: [
          {
            // The 15s APD BVOD spot, 16:9.
            vimeo: AFTERPAY_APD,
            alt: "Afterpay Day video, 15 seconds",
            width: 16,
            height: 9,
          },
          {
            // The 15s Growth Acquisition AU spot, square.
            vimeo: "https://player.vimeo.com/video/1239731603?h=7b24e15175",
            alt: "Afterpay Growth Acquisition video, 15 seconds",
            width: 1,
            height: 1,
          },
        ],
      },
      {
        type: "gallery",
        images: [
          {
            // The 15s "Headline 01" spot, portrait.
            vimeo: "https://player.vimeo.com/video/1239734600?h=c0802a3799",
            alt: "Afterpay Headline video, 15 seconds",
            width: 9,
            height: 16,
          },
          {
            // The 15s Bunnings in-store animation, 16:9.
            vimeo: "https://player.vimeo.com/video/1240061183?h=c5d93e4932",
            alt: "Afterpay at Bunnings in-store animation, 15 seconds",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        type: "models",
        lead: "Overflow, not overlap.",
        body: "Afterpay’s own teams are supported by our studio, not substituted by it: one team in two places, with one pipeline.",
        // The artwork is 731:516 and can't be cropped
        aspect: "731 / 516",
        models: [
          {
            title: "Studio.",
            body: "High-impact creative, CRM, web and data capability, delivered fast, without the overhead of permanent hires.",
            points: ["Scales up when it’s needed", "And back when it isn’t", "No permanent headcount"],
            image: asset("/services/studioxafterpay.webp"),
            alt: "A spread of Afterpay creative by the studio: an Afterpay Day sale poster, social posts, an email and partner campaigns",
          },
          {
            title: "In-house.",
            body: "We build and run Afterpay’s internal team end to end, with full transparency over costs.",
            points: ["The right people", "The right systems", "Support behind them"],
            image: asset("/services/enablementxafterpay.webp"),
            alt: "Diagram of Dijitally allies, a creative and a producer, slotting into Afterpay's team",
          },
        ],
      },
      {
        type: "quote",
        quote:
          "Not many agencies quite literally help you extend your team. Diji has not just been an agency partner to fulfil needs, they’ve been a strategic ally who builds solutions.",
        name: "Joe Ahn",
        role: "Growth Marketing Lead, Afterpay",
      },
      {
        type: "pillars",
        lead: "Six connected pillars.",
        body: "One ally across the whole growth stack.",
        pillars: ["Creative Production", "CRM + Email", "Web + Engineering", "Data + Performance", "Embedded Teams", "B2B Growth Strategy"],
      },
      {
        type: "gallery",
        images: [
          {
            // The 15s Afterpay Day NZ BVOD spot, 16:9.
            vimeo: "https://player.vimeo.com/video/1239742337?h=c41db47130",
            alt: "Afterpay Day New Zealand video, 15 seconds",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        type: "gallery",
        images: [
          {
            // The 10s Last Chance Shorts spot, 16:9.
            vimeo: "https://player.vimeo.com/video/1239732013?h=f2aeca5505",
            alt: "Afterpay Last Chance Shorts video, 10 seconds",
            width: 16,
            height: 9,
          },
          {
            // The 10s Bunnings in-store animation, portrait.
            vimeo: "https://player.vimeo.com/video/1239738129?h=d715b7ff34",
            alt: "Afterpay at Bunnings animation, 10 seconds",
            width: 9,
            height: 16,
          },
        ],
      },
      {
        type: "gallery",
        images: [
          {
            // The 6s "Headline 04" spot ("Friends with benefits"), square.
            vimeo: "https://player.vimeo.com/video/1239734860?h=62bf9e7205",
            alt: "Afterpay Friends with benefits video, 6 seconds",
            width: 1,
            height: 1,
          },
          {
            // The 6s Last Chance spot for Meta, square.
            vimeo: "https://player.vimeo.com/video/1239731877?h=ff994e0d62",
            alt: "Afterpay Last Chance video, 6 seconds",
            width: 1,
            height: 1,
          },
          {
            // The 7s back-to-school ("School your list") spot for Meta, square.
            vimeo: "https://player.vimeo.com/video/1239750957?h=ce760235e8",
            alt: "Afterpay back to school video, 7 seconds",
            width: 1,
            height: 1,
          },
        ],
      },
      {
        type: "timeline",
        lead: "Seven years of scale.",
        body: "From tactical support to full-stack partner.",
        items: [
          { year: "2020", title: "Partnership begins", body: "Engineering support, campaign production, tactical landing pages and B2B CRM basics." },
          { year: "2021", title: "Going global", body: "Into Afterpay USA and EMEA. Experiential begins: Australian Fashion Week activations with Amplify, plus social tool development." },
          { year: "2022", title: "Emerging markets", body: "Campaign rollouts across Italy, France and Spain, Mobile SDK integration and a marketing resource centre." },
          { year: "2023", title: "B2B transformation", body: "A full B2B site rebuild, martech engineering and the Afterpay Plus Card, as ANZ work shifts from the USA." },
          { year: "2024", title: "Platform maturity", body: "Business Sites rolled out globally, a Marketo migration, dashboarding and the embedded secondment model." },
          { year: "2025", title: "Full-stack partner", body: "Studio and In-house side by side, a B2B growth strategy program, AI-enabled production and a brand system rollout." },
          { year: "2026", title: "Year seven", body: "And counting." },
        ],
      },
      {
        type: "principles",
        follow: "The principles behind the partnership.",
        items: [
          { q: "Collaboration + candour", a: "We tell Afterpay what they need to hear, not just what they want to hear, with immediate, honest feedback in both directions." },
          { q: "Shared outcomes", a: "We’re measured on the same criteria as the Afterpay team, so the win is shared." },
          { q: "Reactive and proactive", a: "We turn briefs around fast, and we bring ideas that were never briefed." },
        ],
      },
    ],
    closing: { lead: EXPONENTIALLY, body: "We work shoulder to shoulder with teams like Afterpay, in every market and time zone." },
  },

  {
    slug: "airwallex",
    title: "Airwallex x Ally | Dijitally",
    description:
      "Airwallex's embedded ally: Openair, a bespoke agency ecosystem combining talent management, payroll, operational oversight and overflow studio support.",
    ogImage: "/work/AWXxAirwallex.jpg",
    // The orange end of Airwallex's official logo
    colour: "#F28A45",
    logo: { src: asset("/figma/logo-airwallex.svg"), width: 120.116, height: 16.456, invert: true },
    card: {
      title: "Airwallex x Ally",
      meta: "PARTNERSHIP: 2024 — PRESENT",
      image: asset("/figma/work-airwallex.webp"),
      alt: "Three rugby players in Airwallex-sponsored jerseys",
      tall: false,
    },
    hero: {
      lead: "Airwallex’s embedded ally.",
      follow: "Brand and partnerships, from creative and design to execution.",
      meta: ["Airwallex x Ally", "Partnership"],
      image: img("airwallex", "open", "Airwallex brand film still: two colleagues looking at a tablet against a city skyline, Airwallex logo overlaid", 2000, 1125),
    },
    sheet: true,
    sections: [
      {
        type: "stats",
        lead: "Meet Openair.",
        body: "A bespoke agency ecosystem we built for Airwallex, the global fintech moving money across borders. It sits both inside and alongside the business.",
        items: [
          { value: 3, label: "years of partnership.", highlight: true },
          { value: 2, label: "global\nmarkets." },
          { value: 2, label: "models, Studio + Embedded." },
        ],
      },
      {
        type: "gallery",
        images: [
          img("airwallex", "bluesxawx_01", "Airwallex x Blues campaign: three Blues rugby players, arms folded in a stadium at dusk, beside the line Spend. Handled. and an Airwallex Visa card on a phone", 3840, 2160),
          // These files' own names have spaces (and the next an @ and %), so they're encoded for the URL
          img(
            "airwallex",
            encodeURIComponent("SG VISA Campaign_Zenxin_Arrival T3 Pillar_Row B_1380x2990"),
            "Airwallex Singapore Visa campaign pillar: Tai Seng Yee of ZENXIN Organic tending greens in a glasshouse, under the line The financial platform for business growth",
            2070,
            4485,
          ),
        ],
      },
      {
        type: "gallery",
        images: [
          img("airwallex", "bluesxawx_02", "Airwallex x Blues campaign, portrait: Spend. Handled. above three Blues rugby players in a stadium at dusk, an Airwallex Visa card on a phone in front", 2160, 3840),
          img(
            "airwallex",
            encodeURIComponent("SG VISA Campaign 2026_Far East Flora_39 Keppel Road_West Facing_21800x11730@10%"),
            "Airwallex Singapore Visa campaign billboard: Ryan Chioh of Far East Flora Holdings arranging flowers, under the line The financial platform for business growth",
            3270,
            1760,
          ),
        ],
      },
      {
        type: "models",
        lead: "Overflow, not overlap.",
        body: "Airwallex’s own teams are supported by our studio, not substituted by it.",
        detail: "The scale of an agency, with the consistency and control a fast-growing global brand needs.",
        // The artwork is 731:516 and can't be cropped
        aspect: "731 / 516",
        models: [
          {
            title: "Embedded.",
            body: "Dedicated capability without the admin. We handle recruitment, onboarding, payroll and employment, and Airwallex receives one simple monthly invoice.",
            points: ["Talent management", "Payroll", "Operational oversight"],
            image: asset("/work/airwallex/enablementxairwallex.webp"),
            alt: "Diagram of Dijitally allies, two of a row of seven highlighted, slotting in under Airwallex",
          },
          {
            title: "Studio.",
            body: "Overflow support from our studio for brand and partnership work, turning business challenges into clear, distinctive and memorable creative.",
            points: ["Brand and partnerships", "Creative and design", "Execution"],
            image: asset("/work/airwallex/studioxAWX.webp"),
            alt: "A spread of Airwallex creative by the studio: a McLaren Homegrown Hero poster, a printed feature with a message from Airwallex, and corporate card ads",
          },
        ],
      },
      {
        type: "pillars",
        lead: "Scope, at a glance.",
        body: "Bold enough to stand out, structured enough to last.",
        pillars: ["Creative Production", "Partnership Collateral", "Digital + Performance", "Embedded Teams"],
      },
      {
        type: "principles",
        follow: "The principles behind the partnership.",
        items: [
          { q: "Collaboration + candour", a: "We tell Airwallex what they need to hear, not just what they want to hear." },
          { q: "Reactive and proactive", a: "We turn briefs around fast, and we bring ideas that were never briefed." },
          { q: "Strategic thinking + creative output", a: "We start with the why before moving into the what." },
        ],
      },
    ],
    closing: { lead: EXPONENTIALLY, body: "We work shoulder to shoulder with teams like Airwallex, in every market and time zone." },
  },

  {
    slug: "constantinople",
    title: "Constantinople x Ally | Dijitally",
    description:
      "Dijitally built Constantinople's brand platform, banking infrastructure where the product is trust and the margin for error is zero. Present.co led brand and UX/UI.",
    ogImage: "/work/Constantinople.jpg",
    // The coral of Constantinople’s own site, with the text in the secondary colour
    colour: "#FF734C",
    logo: { src: asset("/figma/logo-constantinople.svg"), width: 110.041, height: 16, invert: true },
    upNextVideo: { vimeo: "https://player.vimeo.com/video/1240118736?h=db9f99558e", width: 540, height: 540, background: "#070707" },
    panelText: "var(--secondary)",
    card: {
      title: "Constantinople",
      meta: "ENGINEERING, DEVELOPMENT",
      image: asset("/figma/work-constantinople.webp"),
      alt: "Hand holding a phone showing the Constantinople banking site",
      tall: true,
      video: { vimeo: "https://player.vimeo.com/video/1240120195?h=41e018c66e", width: 720, height: 972 },
    },
    hero: {
      lead: "Constantinople’s build ally.",
      follow: "Turning a banking platform into a brand you can use.",
      meta: ["Constantinople x Ally"],
      image: img("constantinople", "banking-laptop", "The Constantinople site on a laptop, headline A new era of banking beside a swirled colour render", 2000, 1338),
    },
    sheet: true,
    sections: [
      {
        type: "intro",
        lead: "Present.co led the brand, UX and UI. We built it.",
        body: "Constantinople runs banking infrastructure, where the product is trust and the margin for error is zero. We engineered the design into a fast, accessible, maintainable product, with no seam between what was designed and what shipped.",
      },
      {
        type: "gallery",
        images: [
          {
            src: asset("/figma/work-constantinople.webp"),
            alt: "Hand holding a phone showing the Constantinople banking site",
            width: 2040,
            height: 1360,
          },
        ],
      },
      {
        type: "intro",
        lead: "Intent, intact.",
        body: "Most builds lose something between design and production.",
        detail: "We join where design decisions become engineering decisions, so nothing is lost in the handover.",
      },
      {
        type: "principles",
        follow: "The principles behind the build.",
        items: [
          { q: "Collaboration + candour", a: "Honest feedback in both directions, including with the brand partner." },
          { q: "Overflow, not overlap", a: "We extend the team that designed it rather than competing with it." },
          { q: "Strategic thinking + creative output", a: "We start with the why before the what." },
          { q: "End-to-end delivery", a: "We don’t stop at handover: we support QA, implementation and optimisation." },
        ],
      },
    ],
    closing: { lead: EXPONENTIALLY, body: "We work shoulder to shoulder with teams like Constantinople, from the first design decision to the last line of code." },
  },

  {
    slug: "procore",
    title: "Procore x Ally | Dijitally",
    description:
      "Procore's integrated ally: six campaigns, a new creative platform, and Build Australia Together scaled from a local initiative into a global brand platform.",
    ogImage: "/work/ProcoreSURE.jpg",
    // Procore's orange, from their official logo
    colour: "#FF5200",
    logo: { src: asset("/figma/logo-procore.svg"), width: 113.553, height: 14.262, invert: true },
    card: {
      title: "Procore x Ally",
      meta: "PARTNERSHIP: 2025 — PRESENT",
      image: asset("/figma/work-procore.webp"),
      alt: "Procore construction campaign",
      tall: false,
    },
    hero: {
      lead: "Procore’s integrated ally.",
      follow: "Strategy, creative, design and execution.",
      meta: ["Procore x Ally", "Partnership: 2025 — present"],
      image: img("procore", "billboard-lockup", "Procore and Dijitally logos locked up on a black billboard above a city street", 2000, 1338),
    },
    sheet: true,
    sections: [
      {
        type: "stats",
        lead: "Since February 2025.",
        body: "Strategy, creative, content and SEO for Procore ANZ, the construction platform connecting every stage of a build.",
        items: [
          { value: 6, label: "campaigns launched.", highlight: true },
          { value: 1, label: "new creative platform." },
          { value: 3, suffix: "+", label: "global\nmarkets reached." },
        ],
      },
      {
        type: "gallery",
        images: [
          img("procore", "pressure-poster", "Orange street poster from the Procore Pressure campaign, a tablet on a construction site at its centre", 1600, 900),
          img("procore", "sure-signage", "The same Procore Pressure artwork on a free-standing digital signage panel", 1600, 900),
        ],
      },
      {
        type: "intro",
        lead: "Build Australia Together.",
        body: "With Build New Zealand Together, it grew from a local initiative into a globally recognised brand platform: one strategic idea, scaled across markets and still locally relevant.",
      },
      {
        type: "gallery",
        images: [img("procore", "site-tablet", "A tablet showing Procore site plans, resting on concrete among steel beams, cabling and tools", 2000, 1090)],
      },
      {
        type: "pillars",
        lead: "What we do.",
        body: "High-volume creative across residential, commercial and energy, plus product campaigns for AI and connected data.",
        pillars: ["Creative Production", "Partnership Collateral", "Digital + Performance", "Embedded Teams"],
      },
      {
        type: "principles",
        follow: "The principles behind the partnership.",
        items: [
          { q: "Collaboration + candour", a: "We tell Procore what they need to hear, not just what they want to hear, with immediate, honest feedback in both directions." },
          { q: "Reactive and proactive", a: "We turn briefs around fast, and we bring ideas that were never briefed." },
          { q: "Overflow, not overlap", a: "One team in two places, with one pipeline: no duplication and no competition." },
          { q: "Strategic thinking + creative output", a: "We start with the why before the what, so campaigns are more effective, more engaging and built to last." },
        ],
      },
    ],
    closing: {
      lead: "Short-term partnership, global scale.",
      body: "What began as tactical campaign support in 2025 is now a full-stack alliance, supporting Procore’s expansion into the UK and MENA.",
    },
  },

  {
    slug: "roomstay",
    title: "RoomStay | Dijitally",
    description:
      "Dijitally didn't win RoomStay as a client, it incubated it. A direct-booking platform for accommodation, founded, branded and taken to market in-house.",
    ogImage: "/work/RoomStayBE_02.jpg",
    // The magenta of RoomStay's campaign creative
    colour: "#A02060",
    // The wordmark alone, cropped from the logo tile (which has its own light square)
    logo: { src: asset("/figma/logo-roomstay-wordmark.svg"), width: 118.446, height: 10, invert: true },
    card: {
      title: "RoomStay x Ally",
      meta: "SOCIAL, CREATIVE, IN.HOUSE",
      image: asset("/figma/work-roomstay.webp"),
      alt: "RoomStay holiday campaign",
      tall: true,
    },
    hero: {
      lead: "RoomStay.",
      follow: "The ally that built one.",
      meta: ["RoomStay x Ally", "Incubation — SaaS"],
      image: img("roomstay", "parks-hero", "RoomStay ad: an illustrated holiday park at dusk, the line They found your website, and a Book now button", 2000, 1125),
    },
    sheet: true,
    sections: [
      {
        type: "intro",
        lead: "We didn’t pitch for it.",
        body: "RoomStay helps hotels, hostels and holiday parks win guests directly instead of surrendering margin to Booking.com and Expedia. We founded it, funded it, named it, branded it and took it to market, and we still run its advertising and brand.",
      },
      {
        type: "gallery",
        images: [
          img("roomstay", "unhitch-otas", "RoomStay ad: a koala on a magenta gradient with the line So you can unhitch the OTAs", 2000, 1125),
          img("roomstay", "direct-bookings", "RoomStay ad: 96 per cent, more direct bookings on your site, ringed with Book now tags", 2000, 1125),
        ],
      },
      {
        type: "intro",
        lead: "Our own capital at risk.",
        body: "RoomStay runs the whole model we sell, brand, performance, content, events and engineering, end to end, with no client to hide behind.",
      },
      {
        type: "pillars",
        lead: "Capability pillars.",
        body: "Everything it took to start a category.",
        pillars: ["Creative Production", "Digital + Performance", "Web + Engineering", "B2B Growth Strategy", "Event + Experiential"],
      },
      {
        type: "gallery",
        images: [
          img("roomstay", "live-pricing", "RoomStay Loyalty: a hotel booking page with the guest account menu open", 2000, 1125),
          img("roomstay", "park-clients", "RoomStay quote card: Daintree Holiday Parks on lower commissions, faster bookings and revenue growth", 2000, 1125),
        ],
      },
      {
        type: "timeline",
        lead: "The guest journey, end to end.",
        body: "We own the booking technology as well as the marketing, so we see the whole chain.",
        items: [
          { year: "01", title: "Destination discovery", body: "How travellers research where to stay." },
          { year: "02", title: "Search visibility", body: "How properties compete within search results." },
          { year: "03", title: "Website experience", body: "How the site shapes whether a guest books directly." },
          { year: "04", title: "Booking conversion", body: "Or returns to an online travel agency." },
        ],
      },
    ],
    closing: { lead: EXPONENTIALLY, body: "RoomStay is the proof: the model we sell, applied end to end." },
  },
];

export const studyBySlug = (slug: string) => STUDIES.find((s) => s.slug === slug);

/** The study after this one, wrapping from the last back to the first. */
export const nextStudy = (slug: string) => STUDIES[(STUDIES.findIndex((s) => s.slug === slug) + 1) % STUDIES.length];
