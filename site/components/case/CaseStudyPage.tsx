import Nav from "../Nav";
import Stats from "../Stats";
import WaysOfWorking from "../WaysOfWorking";
import Faq from "../Faq";
import Footer from "../Footer";
import CaseHero from "./CaseHero";
import CaseIntro from "./CaseIntro";
import CaseGallery from "./CaseGallery";
import CaseQuote from "./CaseQuote";
import CasePillars from "./CasePillars";
import CaseTimeline from "./CaseTimeline";
import UpNext from "./UpNext";
import WorkVisit from "./WorkVisit";
import { nextStudy, type CaseStudy, type Section } from "./studies";
import { pageLink } from "../site";

function CaseSection({ section }: { section: Section }) {
  switch (section.type) {
    case "stats":
      return <Stats lead={section.lead} body={section.body} items={section.items} />;
    case "intro":
      return <CaseIntro lead={section.lead} body={section.body} />;
    case "gallery":
      return <CaseGallery images={section.images} />;
    case "models":
      return (
        <WaysOfWorking id="model" lead={section.lead} body={section.body} models={section.models} aspect={section.aspect} columns />
      );
    case "quote":
      return <CaseQuote quote={section.quote} name={section.name} role={section.role} />;
    case "pillars":
      return <CasePillars lead={section.lead} body={section.body} pillars={section.pillars} />;
    case "timeline":
      return <CaseTimeline lead={section.lead} body={section.body} items={section.items} />;
    case "principles":
      return (
        <Faq
          heading={
            <>
              How we work. <span className="text-static">{section.follow}</span>
            </>
          }
          items={section.items}
        />
      );
  }
}

/** A case study page: the shared nav, hero, the study's own sections, "Up next" and footer. */
export default function CaseStudyPage({ study }: { study: CaseStudy }) {
  const next = nextStudy(study.slug);
  return (
    <main>
      <WorkVisit />
      <Nav home={false} />
      <CaseHero {...study.hero} />
      {study.sections.map((section, i) => (
        <CaseSection key={i} section={section} />
      ))}
      <UpNext
        lead={study.closing.lead}
        body={study.closing.body}
        title={next.card.title}
        meta={next.card.meta}
        href={pageLink(`/work/${next.slug}`)}
        slug={next.slug}
        image={next.card.image}
        alt={next.card.alt}
        background={next.card.background}
        inset={next.card.inset}
        color={next.colour}
        textColor={next.panelText}
      />
      <Footer />
    </main>
  );
}
