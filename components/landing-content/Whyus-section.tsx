import Image from "next/image";

export default function WhyUs() {
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
      desc: "We’re proud to have enabled smooth university fee transfers for over 2,500 students, making global payments to institutions faster and easier. With a focus on transparency, reliability, and growing trust, we continue to support study abroad journeys through efficient and dependable cross-border payment solutions..",
    },
  ];

  return (
    <section id="why-us" className="bg-white py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-20xl mx-auto px-4">
        {/* Header */}
        <div className="w-full md:w-4/5 lg:w-1/2 md:mx-auto lg:ml-[76px] text-center lg:text-left">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair text-dark-blue mb-6">
            Why Us?
          </h2>
          <p className="text-gray-600 mb-8 font-manrope text-base md:text-lg leading-relaxed">
            At BuyExchange, we are committed to making international payments
            straightforward and stress-free. Based in Kochi, Kerala, our mission
            is to empower individuals, especially students, by providing seamless
            and efficient forex solutions. With competitive exchange rates,
            transparent fee structures, and multiple payment options, we ensure a
            smooth experience for all your foreign exchange needs.
          </p>
          <div className="flex justify-center lg:justify-start">
            <button className="bg-dark-blue text-white py-3 px-8 rounded-md font-jakarta text-base md:text-lg hover:bg-blue-800 transition-colors">
              GET STARTED
            </button>
          </div>
        </div>

        {/* Visuals & Cards */}
        <div className="relative w-full max-w-7xl mx-auto py-20 px-4">
          {/* Dots image for lg */}
          <div className="relative hidden lg:block mt-[122px]">
            <Image
              src="/dots.svg"
              alt="Line Curve"
              width={1200}
              height={300}
              className="w-full object-contain mt-[-411px]"
            />
          </div>

          

          {/* Responsive Cards */}
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}