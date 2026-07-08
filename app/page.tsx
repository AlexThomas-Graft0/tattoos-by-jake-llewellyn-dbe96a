import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/hero";
import { Experience } from "@/components/Experience";
import { Portfolio } from "@/components/Portfolio";
import { Services } from "@/components/Services";
import { Aftercare } from "@/components/Aftercare";
import { Enquiry } from "@/components/Enquiry";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: "{\"@context\":\"https://schema.org\",\"@type\":\"LocalBusiness\",\"name\":\"Tattoos By Jake Llewellyn\",\"description\":\"At Tattoos by jakellewellyn, I offer a range of services to cater to your individual tattoo needs. I specialise in custom designs, client-specified artwork, and cover-ups (depending on the existing design). All tattoo styles are welcome, ensuring your body art is exactly as you envision it.\",\"address\":{\"@type\":\"PostalAddress\",\"addressLocality\":\"6A Gwerthonor Place Gilfach Bargoed CF81 8JQ\"},\"url\":\"https://tattoos-by-jake-llewellyn-dbe96a.duckbyte.co\"}" }} />
      <Navbar />
      <section id="hero" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <Hero />
        </Suspense>
      </section>
      <section id="experience" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <Experience />
        </Suspense>
      </section>
      <section id="portfolio" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <Portfolio />
        </Suspense>
      </section>
      <section id="services" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <Services />
        </Suspense>
      </section>
      <section id="aftercare" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <Aftercare />
        </Suspense>
      </section>
      <section id="enquiry" className="scroll-mt-20">
        <Suspense fallback={<div className="min-h-[30vh]" />}>
          <Enquiry />
        </Suspense>
      </section>
      <Footer />
    </main>
  );
}
