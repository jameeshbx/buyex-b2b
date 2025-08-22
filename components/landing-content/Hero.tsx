"use client";


import { HERO_CONTENT } from "@/data/hero";

export default function Hero() {
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
            <h1 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold font-playfair leading-tight tracking-tight text-deep-blue">
              Powering <span className="whitespace-nowrap">Study Abroad Forex</span><br /> for Your Students.
            </h1>

            {/* Description */}
            <p className="mb-8 text-gray-600 text-lg leading-relaxed max-w-xl">
              {description}
            </p>

            {/* CTA Button */}
            <div className="mb-8">
              <a href="#" className="inline-block rounded-md bg-dark-rose px-8 py-3 text-base font-medium text-white transition hover:bg-dark-rose hover:shadow-lg">
                Register as consultant
              </a>
            </div>

            {/* Stats */}
            <div className="text-center lg:text-left">
              <p className="text-base text-gray-600 leading-relaxed mb-6">
                Successfully empowering <span className="font-semibold">100+ oversease education consultants</span>
                {' '}across <span className="font-semibold">5 states</span>,
                <br/>Buy Exchange delivers seamless student forex—now expanding nationwide.
              </p>

              {/* Partner logos */}
              <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
                {partners.map((partner, index) => (
                  <a key={index} href={partner.url} className="flex-shrink-0 h-10 flex items-center transition-transform hover:scale-105">
                    <img src={partner.image} alt={partner.name} className="h-full w-auto object-contain max-w-[100px]" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full mt-8 lg:mt-0 lg:w-1/2 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2">
            <div className="relative h-[400px] lg:h-[600px] w-full">
              <img src={heroImage.src} alt={heroImage.alt} className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
