import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import WaysOfWorking from "@/components/WaysOfWorking";
import Stats from "@/components/Stats";
import Work from "@/components/Work";
import Team from "@/components/Team";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import type { Metadata } from "next";
import { HOME_DESCRIPTION, HOME_TITLE, ON_DIJITALLY } from "@/components/site";

export const metadata: Metadata = ON_DIJITALLY
  ? {
      alternates: { canonical: "/" },
      openGraph: {
        type: "website",
        url: "/",
        title: HOME_TITLE,
        description: HOME_DESCRIPTION,
        images: ["/work/cs/afterpay-billboard-lockup.jpg"],
      },
    }
  : {};

export default function Home() {
  return (
    <main>
      <Preloader />
      <Nav />
      <Hero />
      <Brands />
      <WaysOfWorking />
      <Stats />
      <Work />
      <Team />
      <Faq />
      <Footer />
    </main>
  );
}
