"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import partnerLogos from "../../data/partners-logo"

export default function PartnersMarquee() {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!marqueeRef.current) return

    const speed = 1 // pixels per frame (slower than before)
    let animationId: number
    let lastTime: number | null = null

    const animate = (time: number) => {
      if (!marqueeRef.current) return

      if (!lastTime) {
        lastTime = time
        animationId = requestAnimationFrame(animate)
        return
      }

      marqueeRef.current.scrollLeft += speed

      // Reset scroll position when we reach the end of first set of logos
      const scrollWidth = marqueeRef.current.scrollWidth
      const clientWidth = marqueeRef.current.clientWidth
      const scrollLeft = marqueeRef.current.scrollLeft

      if (scrollLeft >= scrollWidth / 2 - clientWidth) {
        marqueeRef.current.scrollLeft = 0
      }

      lastTime = time
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold font-playfair text-dark-blue">The Force Behind Our Forex Flow</h2>
      </div>

      <div 
        ref={marqueeRef} 
        className="overflow-hidden scroll-smooth" 
        style={{ 
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch"
        }}
      >
        <div className="flex items-center">
          {/* First set of logos */}
          {partnerLogos.map((logo, index) => (
            <div key={`first-${index}`} className="flex-shrink-0 mx-8 w-[180px] h-[80px] relative">
              <Image 
                src={logo.src} 
                alt={logo.name} 
                fill 
                style={{ objectFit: "contain" }}
                unoptimized // Consider removing if you can optimize all images
              />
            </div>
          ))}

          {/* Duplicate set for seamless looping */}
          {partnerLogos.map((logo, index) => (
            <div key={`second-${index}`} className="flex-shrink-0 mx-8 w-[180px] h-[80px] relative">
              <Image 
                src={logo.src} 
                alt={logo.name} 
                fill 
                style={{ objectFit: "contain" }}
                unoptimized // Consider removing if you can optimize all images
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
