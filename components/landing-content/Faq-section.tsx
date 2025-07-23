"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { faqData } from "@/data/faq"

export default function FaqSection() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(1)

  const toggleQuestion = (id: number) => {
    setOpenQuestion(openQuestion === id ? null : id)
  }

  // Show first 5 FAQs initially, then allow scrolling for the rest
  const initialFaqs = faqData.slice(0, 5)
  const remainingFaqs = faqData.slice(5)

  return (
   <section id="whoall" className="w-full bg-white py-8 sm:py-10 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark-blue mb-3 sm:mb-4 font-playfair">
            All You Need To Know
          </h1>
          <p className="text-base sm:text-lg text-gray-600">We&apos;ve got you covered</p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* First 5 FAQs - always visible */}
          {initialFaqs.map((faq) => (
            <div
              key={faq.id}
              className={`
                rounded-lg overflow-hidden transition-all duration-300
                ${openQuestion === faq.id ? "bg-blue" : "bg-white"}
              `}
              data-testid={`faq-item-${faq.id}`}
            >
              <div
                className="flex items-start p-3 sm:p-4 md:p-5 cursor-pointer"
                onClick={() => toggleQuestion(faq.id)}
              >
                <div 
                  className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-gray-400 mr-3 sm:mr-4 md:mr-6 lg:mr-8 w-8 sm:w-10 md:w-12 lg:w-14 flex-shrink-0"
                  data-testid="faq-number"
                >
                  {faq.number}
                </div>
                <div className="flex-grow">
                  <h3 className="text-base sm:text-lg md:text-xl font-medium text-gray-900">
                    {faq.question}
                  </h3>
                  {openQuestion === faq.id && (
                    <div className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-700 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
                <div className="ml-3 sm:ml-4 flex-shrink-0">
                  {openQuestion === faq.id ? (
                    <div className="bg-dark-rose text-white rounded-full p-1 sm:p-1.5 md:p-2 flex items-center justify-center">
                      <X className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    </div>
                  ) : (
                    <div className="rounded-full p-1 sm:p-1.5 md:p-2 flex items-center justify-center">
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Remaining FAQs - scrollable section */}
          {remainingFaqs.length > 0 && (
            <div 
              className="space-y-3 sm:space-y-4 max-h-[350px] sm:max-h-[400px] overflow-y-auto pr-2 sm:pr-3
              scrollbar-thin scrollbar-thumb-dark-blue/70 scrollbar-track-light-blue 
              hover:scrollbar-thumb-dark-blue/90 rounded-md"
            >
              {remainingFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className={`
                    rounded-lg overflow-hidden transition-all duration-300
                    ${openQuestion === faq.id ? "bg-blue" : "bg-white"}
                  `}
                  data-testid={`faq-item-${faq.id}`}
                >
                  <div
                    className="flex items-start p-3 sm:p-4 md:p-5 cursor-pointer"
                    onClick={() => toggleQuestion(faq.id)}
                  >
                    <div 
                      className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-gray-400 mr-3 sm:mr-4 md:mr-6 lg:mr-8 w-8 sm:w-10 md:w-12 lg:w-14 flex-shrink-0"
                      data-testid="faq-number"
                    >
                      {faq.number}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-base sm:text-lg md:text-xl font-medium text-gray-900">
                        {faq.question}
                      </h3>
                      {openQuestion === faq.id && (
                        <div className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-700 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                    <div className="ml-3 sm:ml-4 flex-shrink-0">
                      {openQuestion === faq.id ? (
                        <div className="bg-dark-rose text-white rounded-full p-1 sm:p-1.5 md:p-2 flex items-center justify-center">
                          <X className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                        </div>
                      ) : (
                        <div className="rounded-full p-1 sm:p-1.5 md:p-2 flex items-center justify-center">
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}