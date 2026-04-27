import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import AvailabilityBar from "@/components/AvailabilityBar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Projects from "@/components/Projects";
import SecurityLabs from "@/components/SecurityLabs";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getGitHubStats } from "@/lib/github";

export default async function HomePage() {
  const githubStats = await getGitHubStats();

  return (
    <>
      <Navbar />
      <AvailabilityBar />
      <main>
        <Hero repoCount={githubStats.public_repos} />
        <Services />
        <Process />
        <Projects />
        <SecurityLabs />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
