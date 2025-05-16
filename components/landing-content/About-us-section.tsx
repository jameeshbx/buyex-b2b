import Image from "next/image"
import { aboutUsData } from "../../data/about-data"

export default function AboutUsSection() {
    return (
        <section className="w-full">
            {/* About Us Section */}
            <div className="container md:ml-12 ml-2   py-6 md:py-6 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ml-6 ">
                    <div className="space-y-2 mb-4 px-">
                        <h2 className="text-3xl md:text-4xl font-bold font-playfair text-dark-blue">{aboutUsData.title}</h2>
                        <div className="space-y-2" >
                            {aboutUsData.paragraphs.map((paragraph, index) => (
                                <p key={index} className="text-light-gray ">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                    {/* Image container with negative margin-bottom */}
                    <div className="relative h-h1 md:h-h2 w-full mx-5 md:mx-8 mb-[-80px] md:-mb-180 z-10">
                        <Image
                            src={aboutUsData.dashboardImage}
                            alt="Dashboard Preview"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>
            </div>

            {/* Recognitions Section - Added pt-24 to account for overlapping image */}
            <div className="w-full bg-dark-blue text-white pt-16 md:pt-16">
                <div className="container mx-auto  text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-2">{aboutUsData.recognitions.title}</h2>
                    <p className="mb-12">{aboutUsData.recognitions.subtitle}</p>

                    <div className="flex justify-center">
                        <div className="relative w-full max-w-4xl h-h3 md:h-h4">
                            <Image
                                src={aboutUsData.recognitions.groupedImage}
                                alt="Company Recognitions"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}