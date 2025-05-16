"use client"

import FeaturesAccordion from "@/components/landing-content/Landing"
import Footer from "../components/landing-content/Footer"
import Topbar from "../components/landing-content/Topbar"
import AboutUsSection from "../components/landing-content/About-us-section"
import Feedback from "../components/landing-content/Feedback"
import AdvantageSection from "../components/landing-content/Advantage-section"
import PartnersMarquee from "../components/landing-content/Partners-marquee"
import FaqSection from "../components/landing-content/Faq-section"
import Hero from "../components/landing-content/Hero"
import WhyUs from "../components/landing-content/Whyus-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-white  w-full">
      <div >
        <Topbar />
        <Hero/>
        <FeaturesAccordion />
        <AboutUsSection />
        <WhyUs/>
        <AdvantageSection />
        <PartnersMarquee />
        <Feedback/>
        <FaqSection/>
        <Footer />
      </div>

    </main>
  )
}
