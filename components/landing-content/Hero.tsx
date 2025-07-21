"use client";

import Link from "next/link";
import Image from "next/image";
import { HERO_CONTENT } from "@/data/hero";

export default function Home() {
  const { description, partners, heroImage } = HERO_CONTENT;

  return (
    <section className="relative overflow-hidden bg-white pt-6 sm:pt-8 md:pt-10 lg:pt-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Left content section */}
          <div className="z-10 w-full max-w-full text-center lg:text-left lg:max-w-xl xl:max-w-2xl lg:relative mobile:px-2">
            {/* New badge */}
            <div className="mb-3 sm:mb-4 inline-flex items-center rounded-full bg-blue-100 px-2 sm:px-3 py-1 mx-auto lg:mx-0">
              <span className="mr-1 sm:mr-2 rounded-full bg-dark-blue px-1.5 sm:px-2 py-0.5 text-xs font-medium text-white">New</span>
              <span className="text-xs text-deep-blue font-jakarta">Rate Check API Integration</span>
            </div>

            {/* Main heading */}

            <h1 className="mb-4 sm:mb-5 lg:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight font-playfair text-dark-blue">
              Powering <span className="whitespace-nowrap">Study Abroad Forex</span><br /> for Your Students.
            </h1>
            {/* Description */}
            <p
              className="mb-6 sm:mb-7 lg:mb-8 text-light-gray text-base sm:text-lg md:text-[1.1rem] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: description }}
            />

            {/* CTA Button */}
            <div className="mb-4 sm:mb-4 flex flex-wrap gap-3 sm:gap-4 lg:gap-6 justify-center lg:justify-start">
              <Link
                href="/signin"
                className="rounded-md bg-dark-rose px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium font-jakarta text-white transition hover:bg-pink-600 hover:shadow-sm sm:px-8"
              >
                Register as consultant
              </Link>
            </div>

            {/* Stats and partners */}
            <div className="space-y-2 sm:space-y-2 text-center lg:text-left">
              <p className="text-sm sm:text-base lg:text-lg text-light-gray leading-relaxed mb-4">
                Successfully empowering <span className="font-semibold">100+ education consultants</span>
                {' '}across <span className="font-semibold">5 Indian states</span>,
                {' '}we have streamlined over
                {' '}<span className="font-semibold">$15M in student forex payments</span>.
                {' '}Trusted for <span className="font-semibold">speed</span>,
                {' '}<span className="font-semibold">compliance</span>, and <span className="font-semibold">profitability</span> — now scaling nationwide.
              </p>

              <div className="mt-6 sm:mt-8">

  <div className="flex overflow-x-auto md:overflow-visible pb-3 sm:pb-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 scrollbar-hide md:flex-wrap">
    {partners.map((partner, index) => (
      <a
        key={index}
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 h-8 sm:h-10 md:h-12 flex items-center transition-transform hover:scale-105"
      >
        <Image
          src={partner.image}
          alt={partner.name}
          width={partner.width || 100}
          height={partner.height || 40}
          className="h-full w-auto object-contain max-w-[90px] sm:max-w-[100px] md:max-w-[110px] lg:max-w-[120px]"
          loading="lazy"
          quality={100}
        />
      </a>
    ))}
  </div>
</div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full mt-6 sm:mt-8 md:mt-10 lg:mt-0 lg:w-3/5 xl:w-2/3 lg:absolute lg:right-0 lg:top-0">
            <div className="relative mx-auto h-[350px] xs:h-[400px] sm:h-[480px] md:h-[550px] lg:h-[700px] w-full max-w-xl lg:max-w-none">
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                className="object-contain object-center"
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1023px) 90vw, 65vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}