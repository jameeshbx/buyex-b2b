import Image from "next/image"
import Link from "next/link"


export default function Footer() {
  // Define your section IDs mapping with special handling for Help Center
  const sectionLinks = [
    { name: "What we provide", id: "what-we-provide" },
    { name: "About Us", id: "about-us" },
    { name: "Why Us", id: "why-us" },
   
  ]

  return (
    <footer className="bg-[#f0f7ff] w-full" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo */}
        <Link href="/" passHref>
          <div className="mb-10 flex justify-center md:justify-start cursor-pointer">
            <Image src="/simplify-study-abroad-payments.webp" alt="Buyex Forex Logo – Trusted Student Payment Platform" width={200} height={50} className="h-auto" />
          </div>
        </Link>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Quick Links */}
          <div>
                        <h3 className="font-semibold text-lg mb-4 font-jakarta">Quick Links</h3>
            <ul className="space-y-2 font-jakarta">
              {sectionLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={`#${link.id}`}
                    className="text-gray-600 hover:text-gray-900"
                    scroll={false}
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById(link.id)?.scrollIntoView({
                        behavior: 'smooth'
                      })
                    }}
                  >
                    {link.name}
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
                {
                  name: "Testimonials",
                  path: "/#testimonial",
                  isAnchor: true
                },
                { name: "Terms and Conditions", path: "/terms-and-conditions" },
                { name: "Privacy Policy", path: "/privacy-policy" }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="text-gray-600 hover:text-gray-900"
                    scroll={!item.isAnchor}
                    onClick={(e) => {
                      if (item.isAnchor) {
                        e.preventDefault();
                        if (window.location.pathname === '/') {
                          document.getElementById(item.path.split('#')[1])?.scrollIntoView({
                            behavior: 'smooth'
                          });
                        } else {
                          window.location.href = item.path;
                        }
                      }
                    }}
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
              <p>Buyex Fintech Solutions Pvt Ltd,</p>
              <p>First Floor, Integrated Startup Complex,</p>
              <p>Kerala Technology Innovation Zone HMT Colony, Kalamassery -</p>
              <p>Kochi, Kerala-683503</p>
              <p>Call Us: +91 9072 243 243</p>
              <p>Email: admin@buyexchange.in</p>
            </address>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-gray-300 mt-12 pt-6 text-center">
          <div className="flex justify-center space-x-6 mt-12">
            {[
              { href: "https://www.instagram.com/buyex_forex/ ", src: "/Instagram.jpeg", alt: "Instagram icon" },
              { href: "https://www.linkedin.com/company/buyexforex/", src: "/connect-with-buyex-forex-on-linkedin.svg", alt: "LinkedIn icon" },
              {
                href: "https://www.facebook.com/share/16sF8XjkKA/",
                src: "/follow-buyex-forex-on-facebook.svg",
                alt: "Facebook icon",
                className: "p-1"
              },
            ].map(({ href, src, alt, className }) => (
              <Link key={alt} href={href} className={`text-gray-600 hover:text-gray-900 ${className || ''}`}>
                <Image src={src} alt={alt} width={24} height={24} className="p-0.5" />
                <span className="sr-only">{alt}</span>
              </Link>
            ))}
          </div>
          <p className="text-sm text-gray-500 mb-4 font-jakarta">
            © 2025 Buyex Fintech Solutions Pvt Ltd. <br />All Rights Reserved.
          </p>

          <p className="text-xs text-gray-500 max-w-4xl mx-auto font-jakarta">
            &quot;buyexforex.com is a digital platform &quot;- it is not an Authorised Dealer and does not hold or claim to hold an
            AD licence by RBI. The forex services offered on the Buyex Forex portal are powered by our Partner Banks &
            RBI Authorised Dealers, following all security standards and FEMA regulations as per RBI norms.
          </p>
        </div>
      </div>
    </footer>
  )
}