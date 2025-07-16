"use client";

import Link from "next/link";
import Image from "next/image";
import { HERO_CONTENT } from "@/data/hero";

export default function Home() {
  const { description, partners, heroImage } = HERO_CONTENT;

  return (
    <section className="relative overflow-hidden bg-white pt-6 sm:pt-8 md:pt-10 lg:pt-12">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Main content container with relative positioning */}
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Left content section with z-index to ensure it appears above the image */}
          <div className="z-10 w-full max-w-full text-center lg:text-left lg:max-w-xl xl:max-w-2xl lg:relative">
            <div className="mb-3 sm:mb-4 inline-flex items-center rounded-full bg-blue-100 px-2 sm:px-3 py-1 mx-auto lg:mx-0">
              <span className="mr-1 sm:mr-2 rounded-full bg-dark-blue px-1.5 sm:px-2 py-0.5 text-xs font-medium text-white">New</span>
              <span className="text-xs text-deep-blue font-jakarta">Just onboarded: BrightStone Advisory Group</span>
            </div>

            <h1 className="mb-4 sm:mb-5 lg:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-playfair text-dark-blue md:relative md:z-20">
              Powering <br className="hidden sm:block" />
              Study Abroad Forex <br className="hidden sm:block" />
              for Your Students.
            </h1>

            <p 
              className="mb-6 sm:mb-7 lg:mb-8 text-light-gray text-base sm:text-lg"
              dangerouslySetInnerHTML={{ __html: description }}
            />

            <div className="mb-4 sm:mb-4 flex flex-wrap gap-3 sm:gap-4 lg:gap-6 justify-center lg:justify-start">
              <Link
                href="#"
                className="rounded-md bg-dark-rose px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium font-jakarta text-white transition hover:bg-pink-600 sm:px-8"
              >
                Register as consultant
              </Link>
            </div>

            <div className="space-y-2 sm:space-y-2 text-center lg:text-left">
              <p className="text-sm sm:text-base lg:text-lg text-light-gray">
                Successfully empowering 100+ education consultants across 5 Indian states, 
                We has streamlined over $15M in student forex payments. Trusted for speed, 
                compliance, and profitability — now scaling nationwide.
              </p>

              <div className="mt-4">
                {/* Single row container with horizontal scroll on mobile */}
                <div className="flex overflow-x-auto pb-2 lg:overflow-visible lg:flex-wrap gap-3 sm:gap-4 lg:gap-6">
                  {partners.map((partner, index) => (
                    <a
                      key={index}
                      href={partner.url} // Using the URL from your constants
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 h-8 sm:h-10 lg:h-12 flex items-center transition-transform hover:scale-105"
                    >
                      <Image
                        src={partner.image}
                        alt={partner.name}
                        width={partner.width}
                        height={partner.height}
                        className="h-full object-contain max-w-[120px]"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image - responsive positioning with increased size */}
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