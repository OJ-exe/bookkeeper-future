import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DashboardMockup from "@/components/DashboardMockup";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Trust from "@/components/Trust";
import Testimonials from "@/components/Testimonials";
import Industries from "@/components/Industries";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FBF6EE] text-[#101418]">
      <Navbar />
      <Hero />
      <DashboardMockup />
      <Services />
      <Process />
      <Trust />
      <Testimonials />
      <Industries />
      <CTA />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}