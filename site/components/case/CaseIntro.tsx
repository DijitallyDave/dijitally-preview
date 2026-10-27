import Lede from "../Lede";

/**
 * A section that is only a two-tone heading: a point made in the homepage's Lede style.
 * `plain` sets it as body copy straight under the case study's title instead (see Stats).
 */
export default function CaseIntro({ lead, body, plain = false }: { lead: string; body: string; plain?: boolean }) {
  if (plain)
    return (
      <section data-nav-bg="page" className="bg-primary px-6 pb-16 lg:px-[84px] lg:pb-32">
        <p className="trim max-w-[716px] text-body-mobile lg:text-h3 lg:text-wcag">
          {lead} {body}
        </p>
      </section>
    );

  return (
    <section data-nav-bg="page" className="bg-primary px-6 py-16 lg:px-[84px] lg:py-32">
      <Lede lead={lead} className="max-w-[820px]">
        {body}
      </Lede>
    </section>
  );
}
