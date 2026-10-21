import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import WaysOfWorking from "@/components/WaysOfWorking";
import Stats from "@/components/Stats";
import Work from "@/components/Work";
import Team from "@/components/Team";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
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
