"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { faqData } from "@/data/faq"

export default function FaqSection() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(1)

  const toggleQuestion = (id: number) => {
    setOpenQuestion(openQuestion === id ? null : id)
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 my-12 sm:my-20 md:my-32 lg:my-40 mt-[24px] mb-[84px]">
      <div className="text-center mb-8 sm:mb-10 md:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold text-dark-blue mb-2 font-playfair">
          All You Need To Know
        </h1>
        <p className="text-gray-500 text-base sm:text-lg">We&apos;ve got you covered</p>
      </div>

      {/* Scrollable FAQ section */}
      <div 
        className="space-y-4 max-h-[600px] overflow-y-auto pr-3
        scrollbar-thin scrollbar-thumb-dark-blue/70 scrollbar-track-light-blue 
        hover:scrollbar-thumb-dark-blue/90 rounded-md"
      >
        {faqData.map((faq) => (
          <div
            key={faq.id}
            className={`
              rounded-lg overflow-hidden transition-all duration-300
              ${openQuestion === faq.id ? "bg-blue" : "bg-white"}
            `}
            data-testid={`faq-item-${faq.id}`}
          >
            <div
              className="flex items-start p-4 sm:p-5 md:p-6 cursor-pointer"
              onClick={() => toggleQuestion(faq.id)}
            >
              <div 
                className="text-xl sm:text-2xl md:text-4xl font-light text-gray-400 mr-3 sm:mr-4 md:mr-6 lg:mr-10 w-10 sm:w-12 md:w-16 flex-shrink-0"
                data-testid="faq-number"
              >
                {faq.number}
              </div>
              <div className="flex-grow">
                <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">
                  {faq.question}
                </h3>
                {openQuestion === faq.id && (
                  <div className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
              <div className="ml-3 sm:ml-4 flex-shrink-0">
                {openQuestion === faq.id ? (
                  <div className="bg-dark-rose text-white rounded-full p-1.5 sm:p-2 flex items-center justify-center">
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                ) : (
                  <div className="rounded-full p-1.5 sm:p-2 flex items-center justify-center">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}