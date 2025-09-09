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
import { useState, useEffect } from "react"
import LogoUpdatePopup from "../components/landing-content/LogoUpdatePopup"

export default function Home() {

  const [showLogoPopup, setShowLogoPopup] = useState(false)

  useEffect(() => {
    // Check if user has already seen the popup
    const hasSeenLogoUpdate = localStorage.getItem("hasSeenLogoUpdate")

    if (!hasSeenLogoUpdate) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setShowLogoPopup(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClosePopup = () => {
    setShowLogoPopup(false)
    // Mark as seen so it doesn't show again
    localStorage.setItem("hasSeenLogoUpdate", "true")
  }
  return (
    <main className="min-h-screen bg-white  w-full">
      <div >
        <Topbar />
        <Hero/>
        <LogoUpdatePopup isOpen={showLogoPopup} onClose={handleClosePopup} />
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
