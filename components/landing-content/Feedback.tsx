"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Testimonial, testimonials } from "@/data/testimonial"

export default function GlobalTestimonials() {
  const [activeCountry, setActiveCountry] = useState<string | null>(null)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(3) // Default to showing 3 items


 const countries = Array.from(new Set(testimonials.map(t => t.country)))
const filteredTestimonials = activeCountry 
  ? testimonials.filter(t => t.country === activeCountry)
  : testimonials

  // Adjust items per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2)
      } else {
        setItemsPerPage(3)
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // For carousel when All Countries is selected
  const visibleTestimonials = activeCountry 
    ? filteredTestimonials 
    : filteredTestimonials.slice(currentIndex, currentIndex + itemsPerPage)

  const nextTestimonial = () => {
    if (currentIndex + itemsPerPage < filteredTestimonials.length) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  const prevTestimonial = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      setCurrentIndex(filteredTestimonials.length - itemsPerPage)
    }
  }

  return (
    <section id="testimonial" className="w-full bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-deep-blue mb-4">
            Voices From Around the World
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear what our global community says about their BuyEx Forex experience
          </p>
          <div className="flex justify-center items-center mt-6 gap-4 -ml-[95px]">
            <Image 
              src="/fivestar.png" 
              alt="Five star rating" 
              width={180} 
              height={30} 
              className=""
            />
            <Image 
              src="/logogoogle.png" 
              alt="Google reviews" 
              width={40} 
              height={40}
              className="-ml-[124px] mt-[25px]"
            />
          </div>
        </div>

        {/* Country Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => {
              setActiveCountry(null)
              setCurrentIndex(0)
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium ${!activeCountry ? 'bg-deep-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            All Countries
          </button>
          {countries.map(country => (
            <button
              key={country}
              onClick={() => setActiveCountry(country)}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${activeCountry === country ? 'bg-deep-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <Image 
                src={testimonials.find(t => t.country === country)?.flag || ""} 
                alt={country} 
                width={20} 
                height={15}
                className="object-contain"
              />
              {country}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCountry ? (
              filteredTestimonials.map(testimonial => (
                <TestimonialCard 
                  key={testimonial.id}
                  testimonial={testimonial}
                  onClick={() => setSelectedTestimonial(testimonial)}
                />
              ))
            ) : (
              <>
                {visibleTestimonials.map(testimonial => (
                  <TestimonialCard 
                    key={testimonial.id}
                    testimonial={testimonial}
                    onClick={() => setSelectedTestimonial(testimonial)}
                  />
                ))}
                {/* Placeholder to maintain grid layout when only 1 testimonial is shown */}
                {visibleTestimonials.length === 1 && <div className="hidden md:block"></div>}
              </>
            )}
          </div>
        </div>

        {/* Carousel navigation for All Countries */}
        {!activeCountry && (
          <div className="flex justify-center items-center mt-8 gap-4">
            <button 
              onClick={prevTestimonial}
              className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100"
            >
              <svg className="w-5 h-5 text-deep-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* More reviews link */}
            <a 
              href="https://share.google/ffCsmi1FC4UVwgQND" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-2 text-deep-blue hover:text-blue-700 font-medium text-sm hover:underline"
            >
              More reviews
            </a>
            
            <button 
              onClick={nextTestimonial}
              className="bg-white p-3 rounded-full shadow-md hover:bg-gray-100"
            >
              <svg className="w-5 h-5 text-deep-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Testimonial Modal */}
        {selectedTestimonial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                      <Image
                        src={selectedTestimonial.image}
                        alt={selectedTestimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">{selectedTestimonial.name}</h3>
                      <div className="flex items-center gap-2">
                        <Image 
                          src={selectedTestimonial.flag} 
                          alt={selectedTestimonial.country} 
                          width={20} 
                          height={15}
                          className="object-contain"
                        />
                        <p className="text-gray-600">{selectedTestimonial.company}</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedTestimonial(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <p className="text-gray-700 italic text-lg">&quot;{selectedTestimonial.quote}&quot;</p>
                </div>
                <div className="flex justify-center">
                  <Image 
                    src="/fivestar.png" 
                    alt="Five star rating" 
                    width={150} 
                    height={30} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// Testimonial card component remains the same
function TestimonialCard({ testimonial, onClick }: { testimonial: Testimonial, onClick: () => void }) {
  return (
    <div 
      className=" pt-8 pb-16 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
            <div className="flex items-center gap-2">
              <Image 
                src={testimonial.flag} 
                alt={testimonial.country} 
                width={16} 
                height={12}
                className="object-contain"
              />
              <p className="text-sm text-gray-500">{testimonial.company}</p>
            </div>
          </div>
        </div>
        <p className="text-gray-700 line-clamp-3">{testimonial.quote}</p>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <button className="text-sm font-medium text-deep-blue hover:underline">
            Read full
          </button>
        </div>
      </div>
    </div>
  )
}