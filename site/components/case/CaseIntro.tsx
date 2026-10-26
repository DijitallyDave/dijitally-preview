import Lede from "../Lede";

/** A section that is only a two-tone heading: a point made in the homepage's Lede style. */
export default function CaseIntro({ lead, body }: { lead: string; body: string }) {
  return (
    <section data-nav-bg="page" className="bg-primary px-6 py-16 lg:px-[84px] lg:py-32">
      <Lede lead={lead} className="max-w-[820px]">
        {body}
      </Lede>
    </section>
  );
}
