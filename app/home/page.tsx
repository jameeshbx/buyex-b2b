"use client";

import Topbar from "../../components/landing-content/Topbar";
import Hero from "../../components/landing-content/Hero";
import LogoUpdatePopup from "../../components/landing-content/LogoUpdatePopup";
import FeaturesAccordion from "../../components/landing-content/Landing";
import AboutUsSection from "../../components/landing-content/About-us-section";
import WhyUs from "../../components/landing-content/Whyus-section";
import AdvantageSection from "../../components/landing-content/Advantage-section";
import PartnersMarquee from "../../components/landing-content/Partners-marquee";
import Feedback from "../../components/landing-content/Feedback";
import FaqSection from "../../components/landing-content/Faq-section";
import Footer from "../../components/landing-content/Footer";
import { useEffect, useState } from "react";
import TestComponent from "./test-component";

export default function Home() {
  console.log('Rendering Home component');
  const [showLogoPopup, setShowLogoPopup] = useState(false);
  const [, setIsClient] = useState(false);

  useEffect(() => {
    console.log('useEffect running on client side');
    // Set isClient to true once component mounts on the client side
    setIsClient(true);
    
    // Always show the popup on page load
    if (typeof window !== 'undefined') {
      console.log('Showing logo popup on page load');
      setShowLogoPopup(true);
    }
  }, []);

  const handleClosePopup = () => {
    setShowLogoPopup(false);
    // Mark as seen so it doesn't show again
    localStorage.setItem("hasSeenLogoUpdate", "true");
  };

  console.log('Rendering main content');
  
  return (
    <main className="min-h-screen bg-white w-full">
      <TestComponent />
      <div>
        <Topbar />
        <Hero />
        <LogoUpdatePopup isOpen={showLogoPopup} onClose={handleClosePopup} />
        <FeaturesAccordion />
        <AboutUsSection />
        <WhyUs />
        <AdvantageSection />
        <PartnersMarquee />
        <Feedback />
        <FaqSection />
        <Footer />
      </div>
    </main>
  );
}
