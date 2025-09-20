"use client";

import { advantageItems } from "../../data/advantage";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function AdvantageSection() {
  const [, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % advantageItems.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold font-serif text-deep-blue mb-4">
            The Buyex Forex Advantage
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Buyex Forex B2B Services covers a wide range of Study Abroad and Forex solutions, including
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantageItems.map((item, index) => (
            <div key={index} className="bg-white shadow-lg p-8 rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="mb-4">
                <Image 
                  src={item.imageSrc} 
                  alt={item.title} 
                  width={40} 
                  height={40} 
                  className="w-10 h-10 object-contain" 
                />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12 gap-2">
         
        </div>
      </div>
    </section>
  )
}
