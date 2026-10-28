import Image from "next/image";
import Nav from "../Nav";
import Stats from "../Stats";
import WaysOfWorking from "../WaysOfWorking";
import Faq from "../Faq";
import Footer from "../Footer";
import CaseHero from "./CaseHero";
import HeroVideo from "./HeroVideo";
import CaseIntro from "./CaseIntro";
import CaseGallery from "./CaseGallery";
import CaseQuote from "./CaseQuote";
import CasePillars from "./CasePillars";
import CaseTimeline from "./CaseTimeline";
import UpNext from "./UpNext";
import WorkVisit from "./WorkVisit";
import { nextStudy, type CaseStudy, type Section } from "./studies";
import { pageLink } from "../site";

// `plain`: the opening section on a sheet (see below), whose intro is set as body copy under the title.
function CaseSection({ section, plain }: { section: Section; plain?: boolean }) {
  switch (section.type) {
    case "stats":
      return <Stats lead={section.lead} body={section.body} items={section.items} plain={plain} compact />;
    case "intro":
      return <CaseIntro lead={section.lead} body={section.body} plain={plain} />;
    case "gallery":
      return <CaseGallery images={section.images} />;
    case "models":
      return (
        <WaysOfWorking id="model" lead={section.lead} body={section.body} models={section.models} aspect={section.aspect} detail={section.detail} columns />
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
  const sections = study.sections.map((section, i) => <CaseSection key={i} section={section} plain={study.sheet && i === 0} />);
  const upNext = (
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
  );

  if (study.sheet)
    return (
      // isolate: the image below sits behind the sheet without dropping behind the page itself.
      // #top (the footer's "Back to top") is the very top, not the hero partway down the screen.
      <main id="top" className="relative isolate">
        <WorkVisit />
        <Nav home={false} />
        {/* The sheet: the case study's own sections on the UI colour, inset by the nav's margin
            (24px on mobile, 42px on desktop) so the image shows around it. Its top is the hero,
            starting halfway down the screen, and never closer to the nav than that margin on a
            very short one. .case-sheet swaps the page and UI colours inside it (see
            globals.css). Up next and the footer follow on the page as usual. */}
        <div className="mx-6 pt-[max(50svh,calc(var(--nav-h,68px)+24px))] lg:mx-[42px] lg:pt-[max(50svh,calc(var(--nav-h,115.375px)+42px))]">
          <CaseHero
            {...study.hero}
            sheet
            logo={study.logo && { ...study.logo, alt: study.card.title.replace(/ x Ally$/, "") }}
          />
        </div>
        {/* The gap under the title is this padding, not the title's: the first section's text is
            trimmed to its letters, which would otherwise poke out of the top of the clip. */}
        <div className="case-sheet mx-6 overflow-clip rounded-b-[4px] bg-primary pt-6 lg:mx-[42px] lg:rounded-b-[8px] lg:pt-[42px]">
          {sections}
        </div>
        {/* The hero image (or video), filling the first screen behind the sheet under a 70%
            scrim of the dark mode page colour (coal), in both modes. After the sheet in the page
            so the nav reads the sheet's sections first when it checks what's under it, and this
            only above the sheet. */}
        <div data-nav-bg="dark" aria-hidden className="absolute inset-x-0 top-0 -z-10 h-svh">
          {study.hero.vimeo ? (
            <HeroVideo vimeo={study.hero.vimeo} poster={study.hero.image.src} />
          ) : (
            // Blurred like the video heroes, larger than the box so the blur's soft edges fall outside it
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -inset-12 blur-[24px]">
                <Image src={study.hero.image.src} alt="" fill priority sizes="100vw" className="object-cover" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-coal/70" />
        </div>
        {upNext}
        <Footer />
      </main>
    );

  return (
    <main>
      <WorkVisit />
      <Nav home={false} />
      <CaseHero {...study.hero} />
      {sections}
      {upNext}
      <Footer />
    </main>
  );
}
