"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Testimonial, testimonials } from "@/data/testimonial"

export default function GlobalTestimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState<Testimonial | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const [popupStyle, setPopupStyle] = useState({})

  useEffect(() => {
    if (activeTestimonial && popupRef.current) {
      const popup = popupRef.current
      const container = popup.parentElement?.parentElement
      if (!container) return

      const popupRect = popup.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      const leftPercent = activeTestimonial.position.x
      const topPercent = activeTestimonial.position.y

      let left = (leftPercent / 100) * containerRect.width
      let top = (topPercent / 100) * containerRect.height + 30

      // Clamp horizontal position to prevent overflow
      if (left - popupRect.width / 2 < 0) {
        left = popupRect.width / 2
      } else if (left + popupRect.width / 2 > containerRect.width) {
        left = containerRect.width - popupRect.width / 2
      }

      // Flip above the flag if popup would go beyond bottom
      if (top + popupRect.height > containerRect.height) {
        top = (topPercent / 100) * containerRect.height - popupRect.height - 10
      }

      setPopupStyle({
        left: `${left}px`,
        top: `${top}px`,
        transform: 'translateX(-50%)',
        opacity: 0,
        animation: 'fadeIn 0.3s ease-in-out forwards',
      })
    }
  }, [activeTestimonial])

  return (
    <section className="relative w-full py-12 md:py-20 overflow-hidden bg-white lg:-mt-1.5">
      <div className="container px-4 mx-auto mb-24 lg:-mb-3">
       <div className="text-center mb-12 md:mb-16">
  <h2 className="text-2xl md:text-4xl font-bold font-playfair text-dark-blue mb-4">
    Feedback That Speaks Volumes
  </h2>
  
  <p className="text-sm md:text-lg text-gray-400 max-w-2xl mx-auto mt-4">
    A glimpse into the experiences of those who&apos;ve scaled with BuyExchange.
  </p>
  <div className="relative inline-block">
  <Image 
    src="/fivestar.png" 
    alt="Five star rating" 
    width={270} 
    height={50} 
    className="mx-auto"
  />
  <Image 
    src="/logogoogle.png" // Your second image
    alt="Badge" 
    width={50} 
    height={50}
    className="absolute top-22 right-28"
  />
</div>
</div>

        <div className="relative">
          <div className="relative w-full aspect-[1/0.8] sm:aspect-[2/1] max-w-6xl mx-auto overflow-visible">
            <div className="absolute inset-0 z-0">
              <Image
                src="/Layer.png"
                alt="World Map"
                fill
                className="object-contain"
                priority
              />
            </div>

            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="relative">
                <button
                  className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${testimonial.position.x}%`,
                    top: `${testimonial.position.y}%`,
                  }}
                  onClick={() =>
                    setActiveTestimonial(
                      activeTestimonial?.id === testimonial.id ? null : testimonial
                    )
                  }
                >
                  <div
                    className={`relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-white shadow-lg ${testimonial.flagPosition.top} ${testimonial.flagPosition.right}`}
                  >
                    <Image
                      src={testimonial.flag || ""}
                      alt={`${testimonial.country} flag`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </button>

                {activeTestimonial?.id === testimonial.id && (
                  <div
                    ref={popupRef}
                    className="absolute z-50 w-72 sm:w-80 md:w-84 bg-white rounded-lg shadow-xl border border-gray-200 p-4 transition-all duration-300 ease-in-out"
                    style={popupStyle}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0">
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                          <Image
                            src={testimonial.image || ""}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-gray-900">
                          {testimonial.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-1 sm:mb-2">
                          {testimonial.company}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-700">
                          {testimonial.quote}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {activeTestimonial && (
          <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50">
            <button
              className="bg-white rounded-full p-3 shadow-lg border border-gray-200"
              onClick={() => setActiveTestimonial(null)}
            >
            </button>
          </div>
        )}
      </div>

      {/* Global animation style */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </section>
  )
}
