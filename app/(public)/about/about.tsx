"use client"

import Image from "next/image"

export default function AboutUs() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-dark-blue font-playfair mb-4">
          About Buyex Forex
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-jakarta">
          Simplifying global education finance with transparent forex solutions
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-12 items-center mb-20">
        <div className="lg:w-1/2">
          <Image
            src="/unnameds.png?height=200&width=300" // Replace with your actual image path
            alt="Buyex Forex Team"
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
           At Buyex Forex, we’re transforming how forex operates in the study abroad ecosystem making it smarter, more streamlined, and thoughtfully designed for education consultants.
           Established in 2019 by ex-bankers with deep expertise in retail and trade forex, we set out to build a nimble Fintech platform that not only solves the payment challenges faced by international students and their families—but also empowers consultants with the tools they have long needed.
          </p>
          <p className="text-lg text-gray-700 font-jakarta mb-6">
           We understand that in cross-border finance, compliance isn’t optional—it’s foundational. That’s why every aspect of our system is built with regulatory transparency, AML standards, and industry-best protocols at its core. Consultants can confidently manage transactions knowing that each payment is both legally sound and institutionally secure.
           Our B2B white-labelled portal makes it easy for consultants to track transactions, lock in exchange rates, and generate revenue—all through an interface that’s sleek, intuitive, and regulation-ready. With features like downloadable quotes, API integration, and smart dashboards, we bring clarity and control to a historically opaque space.
          </p>
          <p className="text-lg text-gray-700 font-jakarta">
          Whether guiding a student’s journey abroad or handling large-scale forex volumes, Buyex Forex ensures every transaction is fast, compliant, and rewarding—for students and consultants alike.
         And we are just getting started. More innovations are on the way to make cross-border education payments even safer, simpler, and more consultant-centric.
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
              description: " every forex quote and transaction is clear, compliant, and easy to track.",
              icon: "/trans.jpeg"
            },
            {
              title: "Expertise",
              description: " backed by decades of retail and trade forex experience, we simplify the complex.",
              icon: "/expertise.jpeg"
            },
            {
              title: "Student-Centric",
              description: "our platform puts student needs first, making education payments effortless and empowering.",
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
   <a href="tel:+918943243543">
  <button className="bg-white text-deep-blue px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors font-jakarta">
    Get in Touch
  </button>
</a>
      </div>
    </div>
  )
}