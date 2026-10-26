import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Stats from "@/components/Stats";
import WaysOfWorking from "@/components/WaysOfWorking";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import CaseHero from "@/components/case/CaseHero";
import CaseGallery from "@/components/case/CaseGallery";
import CaseQuote from "@/components/case/CaseQuote";
import CasePillars from "@/components/case/CasePillars";
import CaseTimeline from "@/components/case/CaseTimeline";
import UpNext from "@/components/case/UpNext";
import { asset } from "@/components/asset";
import { ON_DIJITALLY, siteLink } from "@/components/site";

// The Afterpay case study, rebuilt in the homepage's design from www.dijitally.com/work/afterpay.
// Its copy is condensed: the original said "five global markets", "Follow the Sun", "overflow,
// not overlap" and the Studio and In-house models three or four times each; here each is said
// once, in the module it belongs to.

const title = "Afterpay x Ally | Dijitally";
const description =
  "Seven years as Afterpay's point of scale ally: creative, CRM, web, data, embedded teams and B2B strategy across five global markets on a follow-the-sun model.";

export const metadata: Metadata = {
  title,
  description,
  ...(ON_DIJITALLY && {
    alternates: { canonical: "/work/afterpay" },
    openGraph: {
      type: "website",
      url: "/work/afterpay",
      title,
      description,
      images: ["/work/AfterpayxDijitally.jpg"],
    },
  }),
};

const img = (name: string, alt: string, width: number, height: number) => ({
  src: asset(`/work/afterpay/${name}.webp`),
  alt,
  width,
  height,
});

export default function AfterpayCaseStudy() {
  return (
    <main>
      <Nav home={false} />

      <CaseHero
        lead="Afterpay’s point of scale ally."
        follow="Seven years and counting."
        meta={["Afterpay x Ally", "Partnership: 2020 — present"]}
        image={img(
          "billboard-lockup",
          "Afterpay and Dijitally logos locked up on a large digital billboard in a glass atrium",
          2000,
          1338,
        )}
      />

      <Stats
        lead="Since 2020."
        body="What began as campaign and engineering support became a full-stack growth partnership."
        items={[
          { value: 7, label: "years of partnership.", highlight: true },
          { value: 5, label: "global markets." },
          { value: 24, label: "hour delivery, follow the sun." },
          { value: 2, label: "models, Studio + In\u2011house." },
        ]}
      />

      <CaseGallery
        images={[
          img("shelter-sale", "Lit bus shelter poster at night advertising an Afterpay sale, with white over-ear headphones", 2000, 1338),
          img("billboard-reverse", "Dijitally and Afterpay logos locked up on the same atrium billboard, stacked the other way", 1600, 1070),
        ]}
      />

      <WaysOfWorking
        id="model"
        lead="Overflow, not overlap."
        body="Afterpay’s own teams are supported by our studio, not substituted by it: one team in two places, with one pipeline."
        // In-house uses the homepage's Enablement diagram in an Afterpay version (allies slotting
        // into Afterpay); its 731:516 shape sets both cards, as the diagram can't be cropped.
        aspect="731 / 516"
        columns
        models={[
          {
            title: "Studio.",
            body: "High-impact creative, CRM, web and data capability, delivered fast, without the overhead of permanent hires.",
            points: ["Scales up when it’s needed", "And back when it isn’t", "No permanent headcount"],
            image: asset("/work/afterpay/day-posters.webp"),
            alt: "Three digital posters in a walkway showing chrome product renders and the Afterpay Day dates",
          },
          {
            title: "In-house.",
            body: "We build and run Afterpay’s internal team end to end, with full transparency over costs.",
            points: ["The right people", "The right systems", "Support behind them"],
            image: asset("/services/enablementxafterpay.webp"),
            alt: "Diagram of Dijitally allies, a creative and a producer, slotting into Afterpay's team",
          },
        ]}
      />

      <CaseQuote
        quote="Not many agencies quite literally help you extend your team. Diji has not just been an agency partner to fulfil needs, they’ve been a strategic ally who builds solutions."
        name="Joe Ahn"
        role="Growth Marketing Lead, Afterpay"
      />

      <CasePillars
        lead="Six connected pillars."
        body="One ally across the whole growth stack."
        pillars={[
          "Creative Production",
          "CRM + Email",
          "Web + Engineering",
          "Data + Performance",
          "Embedded Teams",
          "B2B Growth Strategy",
        ]}
      />

      <CaseGallery
        images={[
          img("ooh-shop-deals", "Mint green street poster reading Shop the deals, get the app, with the Afterpay app on a phone", 2000, 1078),
        ]}
      />
      <CaseGallery
        images={[
          img("holiday-terminal", "Hands holding a phone to a card terminal beside a green wrapped gift with a red ribbon", 2000, 1500),
          img("holiday-headphones", "Person lying back on a patterned blanket wearing white over-ear headphones, laughing", 1324, 2000),
        ]}
      />

      <CaseTimeline
        lead="Seven years of scale."
        body="From tactical support to full-stack partner."
        items={[
          { year: "2020", title: "Partnership begins", body: "Engineering support, campaign production, tactical landing pages and B2B CRM basics." },
          { year: "2021", title: "Going global", body: "Into Afterpay USA and EMEA. Experiential begins: Australian Fashion Week activations with Amplify, plus social tool development." },
          { year: "2022", title: "Emerging markets", body: "Campaign rollouts across Italy, France and Spain, Mobile SDK integration and a marketing resource centre." },
          { year: "2023", title: "B2B transformation", body: "A full B2B site rebuild, martech engineering and the Afterpay Plus Card, as ANZ work shifts from the USA." },
          { year: "2024", title: "Platform maturity", body: "Business Sites rolled out globally, a Marketo migration, dashboarding and the embedded secondment model." },
          { year: "2025", title: "Full-stack partner", body: "Studio and In-house side by side, a B2B growth strategy program, AI-enabled production and a brand system rollout." },
          { year: "2026", title: "Year seven", body: "And counting." },
        ]}
      />

      <Faq
        heading={
          <>
            How we work. <span className="text-static">The principles behind the partnership.</span>
          </>
        }
        items={[
          {
            q: "Collaboration + candour",
            a: "We tell Afterpay what they need to hear, not just what they want to hear, with immediate, honest feedback in both directions.",
          },
          { q: "Shared outcomes", a: "We’re measured on the same criteria as the Afterpay team, so the win is shared." },
          { q: "Reactive and proactive", a: "We turn briefs around fast, and we bring ideas that were never briefed." },
        ]}
      />

      <UpNext
        lead="There’s a reason you can’t spell exponentially without ally."
        body="We work shoulder to shoulder with teams like Afterpay, in every market and time zone."
        title="Airwallex x Ally"
        meta="PARTNERSHIP: 2024 — PRESENT"
        href={siteLink("/work/airwallex")}
        image={asset("/figma/work-airwallex.webp")}
        alt="Three rugby players in Airwallex-sponsored jerseys"
        background="linear-gradient(to bottom, #36222d, #4f3036 50.081%)"
      />

      <Footer />
    </main>
  );
}
