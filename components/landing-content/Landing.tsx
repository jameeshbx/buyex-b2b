"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"

interface FeatureItem {
  id: string
  title: string
  content: string
  isOpen: boolean
}

function FeaturesAccordion() {
  const [features, setFeatures] = useState<FeatureItem[]>([
    {
      id: "real-time-tracking",
      title: "Real Time Tracking",
      content:
        "It provides an unprecedented level of transparency, enabling users to see exactly where their money is at any given moment in the transfer process.",
      isOpen: true,
    },
    {
      id: "exchange-rate",
      title: "Exchange Rate Control",
      content:
        "Take control of your international transfers with competitive exchange rates that you can lock in advance, protecting you from market fluctuations.",
      isOpen: false,
    },
    {
      id: "brand-name",
      title: "Your Own Brand Name",
      content:
        "Customize the portal with your company's branding, logos, and color scheme to provide a seamless experience for your customers.",
      isOpen: false,
    },
    {
      id: "digital-remittances",
      title: "Digital Remittances",
      content:
        "Offer fast, secure digital money transfer services to your customers with comprehensive tracking and notification systems.",
      isOpen: false,
    },
    {
      id: "revenue-opportunity",
      title: "Revenue Opportunity",
      content:
        "Create new revenue streams through transaction fees, exchange rate margins, and premium service offerings tailored to your customer base.",
      isOpen: false,
    },
    {
      id: "branch-insights",
      title: "Branch Specific Insights",
      content:
        "Access detailed analytics and performance metrics for each branch location, helping you optimize operations and identify growth opportunities.",
      isOpen: false,
    },
  ])

  const toggleFeature = (id: string) => {
    setFeatures(features.map((feature) => (feature.id === id ? { ...feature, isOpen: !feature.isOpen } : feature)))
  }

  return (
    <div className="space-y-4 ">
      {features.map((feature) => (
        <div key={feature.id} className="rounded-lg overflow-hidden">
          <button
            onClick={() => toggleFeature(feature.id)}
            className={`w-full flex justify-between items-center p-6 text-left ${
              feature.isOpen ? "bg-[#0a4976] text-white" : "bg-[#f0f6fc] text-black hover:bg-[#e1edf8]"
            } transition-colors duration-200 rounded-lg`}
            aria-expanded={feature.isOpen}
            aria-controls={`content-${feature.id}`}
          >
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            {feature.isOpen ? (
              <ChevronUp className="flex-shrink-0 w-6 h-6 " />
            ) : (
              <ChevronDown className="flex-shrink-0 w-6 h-6 text-[#F73770]" />
            )}
          </button>

          {feature.isOpen && (
            <div id={`content-${feature.id}`} className="bg-[#f0f6fc] p-6 text-black-700">
              <p className="text-lg text-black">{feature.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <section className="container mx-auto px-4 py-16 md:py-24 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ">
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-4xl md:text-3xl lg:text-4xl xl:text-4xl font-bold text-dark-blue font-playfair mb-8">
              What Does Our Portal Offer?
            </h1>
            <div className="relative">
              <Image
                src="/whatdoesp.png"
                alt="Financial Portal Dashboard"
                width={500}
                height={500}
                priority
              />
            </div>
          </div>

          <div>
            <FeaturesAccordion />
          </div>
        </div>
      </section>
    </main>
  )
}