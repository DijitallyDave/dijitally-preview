import Image from "next/image";
import Nav from "../Nav";
import Stats from "../Stats";
import WaysOfWorking from "../WaysOfWorking";
import Faq from "../Faq";
import Footer from "../Footer";
import CaseHero from "./CaseHero";
import CaseFullHero from "./CaseFullHero";
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
// `noIntro`: its intro has moved up into a full hero instead; then its stats are full size, as
// on the homepage, rather than the half-size set the other studies use.
function CaseSection({ section, plain, noIntro }: { section: Section; plain?: boolean; noIntro?: boolean }) {
  switch (section.type) {
    case "stats":
      return <Stats lead={section.lead} body={section.body} items={section.items} plain={plain} compact={!noIntro} intro={!noIntro} inset />;
    case "intro":
      return noIntro ? null : <CaseIntro lead={section.lead} body={section.body} detail={section.detail} plain={plain} />;
    case "gallery":
      return <CaseGallery images={section.images} />;
    case "models":
      return (
        <WaysOfWorking id="model" lead={section.lead} body={section.body} models={section.models} aspect={section.aspect} detail={section.detail} columns inset />
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
          wide
        />
      );
  }
}

/** A case study page: the shared nav, hero, the study's own sections, "Up next" and footer. */
export default function CaseStudyPage({ study }: { study: CaseStudy }) {
  const next = nextStudy(study.slug);
  // A sheet study's opening section's intro is set on its own between the hero and the sheet.
  const first = study.sections[0];
  const intro = study.sheet && (first?.type === "stats" || first?.type === "intro") ? `${first.lead} ${first.body}` : undefined;
  const sections = study.sections.map((section, i) => (
    <CaseSection key={i} section={section} plain={study.sheet && i === 0} noIntro={!!intro && i === 0} />
  ));
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
      inset={next.card.inset}
      video={next.upNextVideo}
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
        {/* A full-screen hero over the video or image, then the sheet: the case study's own
            sections on the UI colour: full width on mobile, and on desktop a card inset by the
            nav's 42px margin. Inside, the top matches the sides: 24px on mobile, 84px on desktop, with
            the first section's own top padding dropped. .case-sheet swaps the page and UI
            colours inside it (see globals.css).
            Up next and the footer follow on the page as usual. */}
        <CaseFullHero {...study.hero} study={study} />
        {/* The opening paragraph, out from the hero on the page colour, centred, with 128px
            (64px on mobile) above and below it */}
        {intro && (
          <section data-nav-bg="page" className="px-6 py-16 lg:py-32">
            <p className="trim mx-auto max-w-[620px] text-center text-body-mobile text-wcag lg:text-h3">
              {intro}
            </p>
          </section>
        )}
        <div className={`case-sheet overflow-clip bg-primary pt-6 lg:mx-[42px] lg:rounded-[8px] lg:pt-[84px] [&>*:first-child]:pt-0 ${intro ? "" : "mt-6 lg:mt-[42px]"}`}>
          {sections}
        </div>
        {/* The hero video (or image), blurred and in greys, filling the first screen behind the
            hero under a 90% scrim of the dark mode page colour (coal), in both modes. Last in
            the page so the nav reads the hero and sheet first when it checks what's under it. */}
        <div data-nav-bg="dark" aria-hidden className="absolute inset-x-0 top-0 -z-10 h-svh min-h-[480px] lg:min-h-[640px]">
          {study.hero.vimeo ? (
            <HeroVideo vimeo={study.hero.vimeo} poster={study.hero.image.src} mono />
          ) : (
            // Blurred like the video heroes, larger than the box so the blur's soft edges fall outside it
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -inset-12 blur-[24px] grayscale">
                <Image src={study.hero.image.src} alt="" fill priority sizes="100vw" className="object-cover" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-coal/90" />
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
