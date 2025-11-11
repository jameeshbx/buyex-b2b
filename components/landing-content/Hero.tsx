"use client";

import { HERO_CONTENT } from "@/data/hero";
import Image from 'next/image';
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ConsultancyModal } from "@/components/consultancy/ConsultancyModal"
import Link from "next/link"

export default function Hero() {
  const [showModal, setShowModal] = useState(false)
  const { description, partners, heroImage } = HERO_CONTENT

  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between min-h-[600px]">
          {/* Left content section */}
          <div className="z-10 w-full max-w-full text-center lg:text-left lg:max-w-xl xl:max-w-2xl lg:relative">
            {/* New badge */}
            <div className="mb-4 inline-flex items-center rounded-full bg-light-blue px-3 py-1">
              <span className="mr-2 rounded-full bg-deep-blue px-2 py-0.5 text-xs font-medium text-white">New</span>
              <span className="text-xs text-deep-blue font-medium">Rate Check API Integration</span>
            </div>

            {/* Main heading */}
            <h1 className="mb-6 text-4xl sm:text-5xl lg:text-5xl font-bold font-playfair leading-tight tracking-tight text-deep-blue">
              Empowering <span className="inline-block">Study Abroad Dreams</span> with <br className="hidden sm:block" />Smart Forex Solutions for Students
            </h1>

            {/* Description */}
            <p className="mb-8 text-gray-600 text-lg leading-relaxed max-w-xl">
              {description}
            </p>

            {/* CTA Button */}
            <div className="mb-8">
              <Button 
                onClick={() => setShowModal(true)}
                className="inline-flex items-center justify-center rounded-md bg-dark-rose px-8 py-3 text-base font-medium text-white transition hover:bg-dark-rose/90 hover:shadow-lg"
              >
                Register as consultant
              </Button>
              <ConsultancyModal isOpen={showModal} onClose={() => setShowModal(false)} />
            </div>

            {/* Stats */}
            <div className="text-center lg:text-left">
              <p className="text-base text-gray-600 leading-relaxed mb-6">
                Successfully empowering <span className="font-semibold">100+ oversease education consultants</span>
                {' '}across <span className="font-semibold">5 states</span>,
                <br/>Buyex Forex delivers seamless forex for students — now expanding nationwide.
              </p>

              {/* Partner logos */}
              <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                {partners.map((partner, index) => (
                  <Link key={index} href={partner.url} className="flex-shrink-0 h-10 flex items-center transition-transform hover:scale-105">
                    <Image src={partner.image} alt={partner.name} width={100} height={40} className="h-full w-auto object-contain max-w-[100px]" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full mt-8 lg:mt-0 lg:w-1/2 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2">
            <div className="relative h-[400px] lg:h-[600px] w-full">
              <Image 
                src={heroImage.src} 
                alt={heroImage.alt} 
                width={800} 
                height={600} 
                className="w-full h-full object-contain" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Chat Badge */}
      <Link 
        href="https://wa.me/9633886611" // Replace with your WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center transition-all hover:scale-110"
        aria-label="Chat with us on WhatsApp"
      >
        <Image 
          src="/whatsapp-chat-study-abroad-support.webp" 
          alt="WhatsApp chat icon"
          width={32} 
          height={32}
          className="w-8 h-8"
        />
        <span className="ml-2 font-medium hidden sm:inline">Chat with us</span>
      </Link>
    </section>
  )
}
