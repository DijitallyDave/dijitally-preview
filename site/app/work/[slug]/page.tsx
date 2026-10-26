import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyPage from "@/components/case/CaseStudyPage";
import { STUDIES, studyBySlug } from "@/components/case/studies";
import { ON_DIJITALLY } from "@/components/site";

// One page per case study in components/case/studies.ts, built ahead of time.
export const dynamicParams = false;

export function generateStaticParams() {
  return STUDIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const study = studyBySlug((await params).slug);
  if (!study) return {};
  const { title, description, ogImage, slug } = study;
  return {
    title,
    description,
    ...(ON_DIJITALLY && {
      alternates: { canonical: `/work/${slug}` },
      openGraph: { type: "website", url: `/work/${slug}`, title, description, images: [ogImage] },
    }),
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const study = studyBySlug((await params).slug);
  if (!study) notFound();
  return <CaseStudyPage study={study} />;
}
