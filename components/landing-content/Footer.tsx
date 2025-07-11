import Image from "next/image"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#f0f7ff] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo */}
        <div className="mb-10 flex justify-center md:justify-start">
          <Image src="/header-logo.png" alt="Buy Exchange Logo" width={200} height={50} className="h-auto" />
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 font-jakarta">Quick Links</h3>
            <ul className="space-y-2 font-jakarta">
              {[
                "What we provide",
                "About Us",
                "Why Us",
                "What you gain",
                "Who all can benefit",
                "Help Center"
              ].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-lg mb-4 font-jakarta">Explore</h3>
            <ul className="space-y-2 font-jakarta">
              {[
                { name: "BE News", path: "/benews" },
                { name: "Testimonials", path: "/testimonials" },
                { name: "Awards and Recognitions", path: "/awards" },
                { name: "Terms and Conditions", path: "/terms-and-conditions" },
                { name: "Privacy Policy", path: "/privacy-policy" }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Office Location */}
          <div>
            <h3 className="font-semibold text-lg mb-4 font-jakarta">Office Location</h3>
            <address className="not-italic text-gray-600 space-y-1 font-jakarta">
              <p>Buy Exchange Fintech,</p>
              <p>First Floor, Integrated Startup Complex,</p>
              <p>Kerala Technology Innovation Zone HMT Colony, Kalamassery -</p>
              <p>Kochi, Kerala-683503</p>
              <p>Call Us: +91 9072 243 243</p>
              <p>Email: admin@buyexchange.in</p>
            </address>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12">
          <h3 className="font-semibold text-lg mb-4 text-center mr-80">Newsletter</h3>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-[#0081FE] text-white p-2 rounded-r-md hover:bg-blue-600 transition-colors">
              <Mail className="h-5 w-5" />
            </button>
          </div>
        </div>


        {/* Disclaimer */}
        <div className="border-t border-gray-300 mt-12 pt-6 text-center">
          <div className="flex justify-center space-x-6 mt-12">
            {[
              { href: "#", src: "/twitter.png", alt: "Twitter" },
              { href: "#", src: "/linkedin.png", alt: "LinkedIn" },
              { href: "#", src: "/facebook.png", alt: "Facebook" },
            ].map(({ href, src, alt }) => (
              <Link key={alt} href={href} className="text-gray-600 hover:text-gray-900">
                <Image src={src} alt={alt} width={24} height={24} />
                <span className="sr-only">{alt}</span>
              </Link>
            ))}
          </div>
          <p className="text-sm text-gray-500 mb-4 font-jakarta">
           Coded by{" "}
            <a
              href="https://lotusbluesolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Lotus Blue Technologies
            </a> | © 2025 Buyex Fintech Solutions Pvt Ltd. <br/>All Rights Reserved.
          </p>

          <p className="text-xs text-gray-500 max-w-4xl mx-auto font-jakarta">
            Buy exchange.in is a digital platform - it is not an Authorised Dealer and does not hold or claim to hold an
            AD licence by RBI. The forex services offered on the Buy Exchange portal are powered by our Partner Banks &
            RBI Authorised Dealers, following all security standards and FEMA regulations as per RBI norms.
          </p>
        </div>
      </div>
    </footer>
  )
}
