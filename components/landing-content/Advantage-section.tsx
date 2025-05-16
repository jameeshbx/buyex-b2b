"use client"

import Image from "next/image"
import { advantageItems } from "../../data/advantage"

export default function AdvantageSection() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold font-playfair text-dark-blue mb-3">The Buy Exchange Advantage</h2>
        <p className="text-light-gray max-w-3xl mx-auto">
          Buy Exchange B2B Services covers a wide range of Study Abroad and Forex solutions, including
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {advantageItems.map((item, index) => (
          <div key={index} className="bg-off-white shadow-lg shadow-blue-500/20  p-8 rounded-lg">
            <div className="mb-4 relative w-10 h-10">
              <Image
                src={item.imageSrc || "/placeholder.svg"}
                alt={item.title}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
            <p className="text-light-gray">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}