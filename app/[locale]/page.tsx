import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { Data, Development, Intro, Process, Projects, Security } from "@/components/Sections";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function HomePage() {
  return (
    <>
      <Navbar overHero />
      <Hero />
      <main>
        <Intro />
        <Development />
        <Data />
        <Security />
        <Projects />
        <Process />
        <Contact />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
