"use client"

import Image from "next/image"

export default function AboutUs() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-dark-blue font-playfair mb-4">
          About Buy Exchange
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-jakarta">
          Simplifying global education finance with transparent forex solutions
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-12 items-center mb-20">
        <div className="lg:w-1/2">
          <Image
            src="/images/benews/Frame 25.svg?height=200&width=300" // Replace with your actual image path
            alt="Buy Exchange Team"
            width={600}
            height={400}
            className="rounded-xl shadow-lg w-full h-auto"
          />
        </div>
        <div className="lg:w-1/2">
          <h2 className="text-3xl font-bold text-dark-blue font-playfair mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 mb-6 font-jakarta">
            Buy Exchange simplifies the process of sending money abroad for education, making it easier for students and their families. We understand the unique financial challenges of studying overseas and offer tailored forex solutions to meet those needs.
          </p>
          <p className="text-lg text-gray-700 font-jakarta">
            Founded by two ex-bankers with deep expertise in retail and trade forex, Buy Exchange delivers a one-stop, transparent, and compliant forex platform. By leveraging technology and industry experience, we streamline operations for both banks and customers, removing the complexity from currency transactions.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-dark-blue text-center font-playfair mb-12">
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Transparency",
              description: "No hidden fees or charges. We believe in clear, upfront pricing for all our services.",
              icon: "/trans.jpeg"
            },
            {
              title: "Expertise",
              description: "Built by forex professionals with decades of combined banking experience.",
              icon: "/expertise.jpeg"
            },
            {
              title: "Student-Centric",
              description: "Solutions designed specifically for the needs of international students and their families.",
              icon: "/student.jpeg"
            }
          ].map((value, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Image
                  src={value.icon}
                  alt={value.title}
                  width={52}
                  height={52}
                />
              </div>
              <h3 className="text-xl font-bold text-dark-blue mb-3 font-jakarta">{value.title}</h3>
              <p className="text-gray-600 font-jakarta">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

  
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-light-gray to-deep-blue rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold font-playfair mb-6">
          Ready to simplify your forex needs?
        </h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto font-jakarta">
  Whether you&rsquo;re sending money for education or need forex consultation, our team is here to help.
</p>
        <a href="https://www.instagram.com/buyexchange_forex?igsh=dWRndXh0cGZuamdr" target="_blank" rel="noopener noreferrer">
  <button className="bg-white text-deep-blue px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors font-jakarta">
    Get in Touch
  </button>
  </a>
      </div>
    </div>
  )
}