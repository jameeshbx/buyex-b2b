import Image from "next/image";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export default function WhyUs() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
   const stats = [
    {
      value: "30+",
      title: "Study Abroad Solution Providers",
      desc: "We partner with leading study abroad solution providers to simplify international payments for students. Together with our partners, we make studying abroad smoother, more accessible, and stress-free.",
    },
    {
      value: "20+",
      title: "RBI Authorized Forex Providers",
      desc: "We partner with RBI-authorized forex providers to deliver compliant, efficient, and scalable foreign exchange solutions. Our platform bridges the gap between forex institutions and consultancies.",
    },
    {
      value: "3500+",
      title: "International student payments",
      desc: "We're proud to have enabled smooth university fee transfers for over 2,500 students, making global payments to institutions faster and easier. With a focus on transparency, reliability, and growing trust, we continue to support study abroad journeys through efficient and dependable cross-border payment solutions..",
    },
  ];
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = () => {
    if (isMounted) {
      router.push('/signin');
    }
  };

  return (
    <section id="why-us" className="bg-white py-8 sm:py-16 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="w-full md:w-4/5 lg:w-1/2 md:mx-auto lg:ml-[76px] text-center lg:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-playfair text-dark-blue mb-4 sm:mb-6">
            Why Us?
          </h2>
          <p className="text-gray-600 mb-6 sm:mb-8 font-manrope text-sm sm:text-base md:text-lg leading-relaxed">
 At Buyex Forex, our core mission is to empower study abroad education consultants by simplifying international payment solutions and providing forex for students that make every transaction easier. We specialize in delivering reliable, transparent, and hassle-free forex services that align with your business needs.With competitive exchange rates, zero hidden fees, and flexible payment modes, we enable consultants to provide seamless forex for students guidance to those pursuing education overseas. Whether it&apos;s Tuition Fee Remittance, Living Expense Transfers, Blocked Account Deposits, or Visa Fee Payments, our streamlined processes and dedicated support help you build trust and add value to your student services.Together, let&apos;s turn study abroad fee payments and foreign exchange into a frictionless step in every student&apos;s journey abroad.
</p>
            <div className="flex justify-center lg:justify-start">
        <button 
          onClick={handleClick}
          className="bg-dark-blue text-white py-2 px-6 sm:py-3 sm:px-8 rounded-md font-jakarta text-sm sm:text-base md:text-lg hover:bg-blue-800 transition-colors"
        >
          GET STARTED
        </button>
      </div>

        </div>

        {/* Visuals & Cards */}
        <div className="relative w-full py-8 sm:py-12 md:py-16 lg:py-20">
          {/* Dots image for lg - Keep Desktop Design */}
          <div className="relative hidden lg:block mt-[122px]">
            <Image
              src="/study-abroad-payment-page-design.svg"
              alt="Line curve illustration"
              width={1200}
              height={300}
              className="w-full object-contain mt-[-411px]"
            />
          </div>

          {/* Mobile & Tablet Cards - Responsive Layout */}
          <div className="lg:hidden">
            <div className="flex flex-col sm:flex-row sm:justify-center sm:flex-wrap gap-6 sm:gap-4 md:gap-6 mt-8 sm:mt-12">
              {stats.map((item, index) => (
                <div
                  key={index}
                  className="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] text-center bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100"
                >
                  <h3 className="text-dark-rose text-3xl sm:text-4xl font-bold opacity-40">
                    {item.value}
                  </h3>
                  <p className="font-semibold text-xs sm:text-sm mt-2 text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-3 leading-relaxed">{item.desc}</p>
                  
                  {/* Add image below the 3500+ card for mobile/tablet */}
                  {index === 2 && (
                    <div className="mt-6 sm:mt-8">
                      <div className="relative h-24 sm:h-32 w-full">
                        <Image
                          src="/student-payment-visual-buyex.webp"
                          alt="Global Money Transfer Illustration"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Cards - Keep Original Design */}
          <div className="hidden lg:block">
            <div className="flex flex-col md:flex-row md:justify-around md:gap-6 mt-12 text-center relative lg:static">
              {stats.map((item, index) => (
                <div
                  key={index}
                  className={`w-full md:w-1/3 mt-8 md:mt-0 lg:w-64 lg:absolute ${
                    index === 0
                      ? "lg:left-[5%] lg:top-[95%]"
                      : index === 1
                      ? "lg:left-[42%] lg:top-[55%]"
                      : "lg:right-[6%] lg:top-[-10%]"
                  } lg:-translate-y-1/2`}
                >
                  <h3 className="text-dark-rose text-4xl font-bold opacity-40">
                    {item.value}
                  </h3>
                  <p className="font-semibold text-sm mt-1">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-2">{item.desc}</p>
                  {/* Add image below the 3500+ card */}
                  {index === 2 && (
                    <div className="mt-26">
                      <Image
                        src="/student-payment-visual-buyex.webp"
                        alt="International payments visualization"
                        width={200}
                        height={150}
                        className="w-full object-contain mb-[-332px]"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}