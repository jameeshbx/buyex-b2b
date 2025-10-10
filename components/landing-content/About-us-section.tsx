import Image from "next/image"
import { aboutUsData } from "../../data/about-data"

export default function AboutUsSection() {
    return (
          <section id="about-us" className="w-full">
            {/* About Us Section - Optimized Spacing */}
            <section className="py-8 sm:py-10 md:py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
                        {/* Content Section */}
                        <div className="space-y-4 sm:space-y-5 order-2 lg:order-1">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-playfair text-dark-blue leading-tight">
                                {aboutUsData.title}
                            </h2>
                            <div className="space-y-3 sm:space-y-4">
                                {aboutUsData.paragraphs.map((paragraph, index) => (
                                    <p key={index} className="text-light-gray text-base sm:text-lg leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* Image Section */}
                        <div className="relative z-10 order-1 lg:order-2">
                            {/* Mobile and Tablet View */}
                            <div className="lg:hidden relative w-full">
                                <div className="relative h-[280px] sm:h-[350px] md:h-[450px] w-full">
                                    <Image
                                        src={aboutUsData.dashboardImage}
                                        alt="Buyex Forex interface showing fee management tools"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            </div>
                            
                            {/* Desktop View - Keep Original Design */}
                            <div className="hidden lg:block">
                                <div className="relative h-[700px] md:h-[800px] w-[100%] md:w-[120%] mb-[-150px] md:mb-[-200px] -mr-[10%] md:-mr-[15%]">
                                    <Image
                                        src={aboutUsData.dashboardImage}
                                        alt="Dashboard preview for student payments"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recognitions Section - Reduced Spacing */}
            <div className="w-full bg-dark-blue text-white pt-6 sm:pt-8 md:pt-10 lg:pt-32 xl:pt-20 pb-6 sm:pb-8 md:pb-10 lg:pb-12 -mt-0 lg:-mt-25 rounded-t-lg rounded-b-lg">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-playfair mb-2 sm:mb-3">
                        {aboutUsData.recognitions.title}
                    </h2>
                    <p className="text-sm sm:text-base mb-6 sm:mb-8 lg:mb-10 opacity-90">
                        {aboutUsData.recognitions.subtitle}
                    </p>

                    <div className="flex justify-center">
                        <div className="relative w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl">
                            {/* Mobile View */}
                            <div className="sm:hidden relative h-28">
                                <Image
                                    src={aboutUsData.recognitions.groupedImage}
                                    alt="Buyex Forex Recognitions and Awards"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            
                            {/* Tablet View */}
                            <div className="hidden sm:block md:hidden relative h-32">
                                <Image
                                    src={aboutUsData.recognitions.groupedImage}
                                    alt="Awards and recognitions in the financial services industry"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            
                            {/* Medium Tablet and Small Desktop */}
                            <div className="hidden md:block lg:hidden relative h-40">
                                <Image
                                    src={aboutUsData.recognitions.groupedImage}
                                    alt="Company Recognitions"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            
                            {/* Large Desktop - Keep Original */}
                            <div className="hidden lg:block relative h-h3 md:h-h4">
                                <Image
                                    src={aboutUsData.recognitions.groupedImage}
                                    alt="Company awards and recognitions"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
