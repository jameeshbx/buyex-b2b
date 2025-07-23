"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"



export default function FeaturesAccordion() {
 const [features, setFeatures] = useState([
    {
      id: "real-time-tracking",
      title: "Real Time Tracking",
      content: "It provides an unprecedented level of transparency, enabling users to see exactly where their money is at any given moment in the transfer process.",
      isOpen: true,
    },
    {
      id: "exchange-rate",
      title: "Exchange Rate Control",
      content: "Take control of your international transfers with competitive exchange rates that you can lock in advance, protecting you from market fluctuations.",
      isOpen: false,
    },
    {
      id: "brand-name",
      title: "Your Own Brand Name",
      content: "Customize the portal with your company's branding, logos, and color scheme to provide a seamless experience for your customers.",
      isOpen: false,
    },
    {
      id: "digital-remittances",
      title: "Digital Remittances",
      content: "Offer fast, secure digital money transfer services to your customers with comprehensive tracking and notification systems.",
      isOpen: false,
    },
    {
      id: "revenue-opportunity",
      title: "Revenue Opportunity",
      content: "Create new revenue streams through transaction fees, exchange rate margins, and premium service offerings tailored to your customer base.",
      isOpen: false,
    },
    {
      id: "branch-insights",
      title: "Branch Specific Insights",
      content: "Access detailed analytics and performance metrics for each branch location, helping you optimize operations and identify growth opportunities.",
      isOpen: false,
    },
    {
      id: "multi-forex-partner",
      title: "Multi Forex Partner Integration",
      content: "Seamlessly connect with multiple forex providers through a single API integration, enabling competitive rate shopping, automated transactions, and consolidated reporting across all your forex partners.",
      isOpen: false,
    },
  ])

  const toggleFeature = (id: string) => {
    setFeatures(features.map((feature) => 
      feature.id === id ? { ...feature, isOpen: !feature.isOpen } : feature
    ))
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-deep-blue font-serif mb-8">
              What Does Our Portal Offer?
            </h2>
            <div className="relative">
              <img src="/portal offer.png" alt="Financial Portal Dashboard" className="w-full h-auto " />
            </div>
          </div>

          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature.id} className="rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFeature(feature.id)}
                  className={`w-full flex justify-between items-center p-6 text-left ${
                    feature.isOpen ? "bg-deep-blue text-white" : "bg-white text-black hover:bg-white"
                  } transition-colors duration-200 rounded-lg`}
                >
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  {feature.isOpen ? (
                    <ChevronUp className="flex-shrink-0 w-6 h-6" />
                  ) : (
                    <ChevronDown className="flex-shrink-0 w-6 h-6 text-pink-600" />
                  )}
                </button>
                {feature.isOpen && (
                  <div className="bg-white p-6 text-gray-700">
                    <p className="text-lg">{feature.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
