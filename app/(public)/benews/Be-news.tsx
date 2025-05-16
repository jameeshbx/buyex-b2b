"use client"

import Image from "next/image"
import { Search } from "lucide-react"
import { useState } from "react"
import { newsArticles } from "@/data/newsArticles"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedStates, setExpandedStates] = useState<Record<number, boolean>>(
    newsArticles.reduce((acc, article) => ({ ...acc, [article.id]: false }), {})
  );

  // Toggle expanded state for an article
  const toggleExpand = (articleId: number) => {
    setExpandedStates(prev => ({
      ...prev,
      [articleId]: !prev[articleId]
    }))
  }

  // Filter articles based on search query
  const filteredArticles = newsArticles.filter((article) => {
    const searchText = searchQuery.toLowerCase()
    const contentText = article.content.join(" ").toLowerCase()
    return (
      article.title.toLowerCase().includes(searchText) ||
      contentText.includes(searchText) ||
      article.date.toLowerCase().includes(searchText) ||
      article.author.toLowerCase().includes(searchText)
    )
  })

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Top section with heading and search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold font-jakarta mb-1">Insights from our team</h1>
          <p className="font-jakarta text-light-gray">Buy Exchange Forex News</p>
        </div>
        <div className="relative mt-4 md:mt-0">
          <div className="flex items-center border rounded-full px-4 py-2 bg-white">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="search..."
              className="ml-2 w-full outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Divider line */}
      <div className="border-t mb-8"></div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Left sidebar for blog topics */}
        <div className="w-full md:w-1/4">
          <h2 className="text-xl  font-jakarta text-dark-blue mb-4">Blog Topics</h2>
          <ul className="space-y-2">
            <li className="hover:text-gray-600 font-jakarta cursor-pointer">Remittance</li>
            <li className="hover:text-gray-600 font-jakarta cursor-pointer">Forex</li>
            <li className="hover:text-gray-600 font-jakarta cursor-pointer">Currency Exchange</li>
            <li className="hover:text-gray-600 font-jakarta cursor-pointer">Crypto</li>
            <li className="hover:text-gray-600 font-jakarta cursor-pointer">Artificial Intelligence</li>
            <li className="hover:text-gray-600 font-jakarta cursor-pointer">Work</li>
          </ul>
        </div>

        {/* Main content area */}
        <div className="w-full md:w-3/4">
          <div className="flex flex-col h-[600px] overflow-y-auto pr-2">
            {/* Trending topics */}
            <div className="mb-8">
              <h2 className="text-xl  font-jakarta text-dark-blue mb-4">Trending Topics</h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-1 bg-gray-100 font-jakarta rounded-full text-sm">Remittance</span>
                <span className="px-4 py-1 bg-gray-100 font-jakarta rounded-full text-sm">Forex</span>
                <span className="px-4 py-1 bg-gray-100 font-jakarta rounded-full text-sm">Currency exchange</span>
              </div>
            </div>

            {/* Search results message */}
            {searchQuery && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  {filteredArticles.length === 0
                    ? "No results found for your search"
                    : `Showing ${filteredArticles.length} result${filteredArticles.length !== 1 ? "s" : ""} for "${searchQuery}"`}
                </p>
              </div>
            )}

            {/* News articles */}
            <div className="space-y-8">
              {filteredArticles.length === 0 && searchQuery ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No articles match your search criteria</p>
                </div>
              ) : (
                filteredArticles.map((article, index) => (
                  <article key={article.id} className={index > 0 ? "border-t pt-6" : ""}>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-2/3">
                        <p className="text-dark-blue font-jakarta mb-2">{article.date}</p>
                        <h3 className="text-2xl font-bold font-jakarta mb-3">{article.title}</h3>
                        <div className="text-dark-gray font-jakarta space-y-3">
                          {expandedStates[article.id] ? (
                            // Show all paragraphs when expanded
                            article.content.map((paragraph, i) => (
                              <p key={i}>{paragraph}</p>
                            ))
                          ) : (
                            // Show only first paragraph when collapsed
                            <p>{article.content[0]}</p>
                          )}
                        </div>
                        <div className="flex items-center mt-4 text-sm">
                          <span className="text-gray-600 font-jakarta">By {article.author}</span>
                          <span className="mx-2">•</span>
                          <span className="text-dark-blue font-jakarta">{article.readTime}</span>
                          <button
                            onClick={() => toggleExpand(article.id)}
                            className="ml-2 text-pink-500 hover:underline focus:outline-none"
                          >
                            {expandedStates[article.id] ? "Read less ←" : "Read more →"}
                          </button>
                        </div>
                      </div>
                      <div className="w-full md:w-1/3">
                        <div className="bg-blue-600 rounded-lg overflow-hidden">
                          <Image
                            src={article.image || "/placeholder.svg"}
                            alt={article.imageAlt}
                            width={300}
                            height={200}
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-medium-gray py-10 sm:py-6 lg:py-8 mt-10 px-4 sm:px-6 lg:px-8 rounded-xl">
      {/* Background image - hidden on small screens, visible on lg and above */}
      <div className="absolute inset-0 z-0 overflow-hidden hidden lg:block">
        <Image
          src="/blue.svg"
          alt="Background"
          className="object-cover object-center w-full"
          priority
          width={1250}
          height={100}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-dark-blue font-playfair text-center sm:text-left">
          Get in touch
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-3 lg:grid-cols-3 gap-6">
          {/* Sales Enquiries */}
          <div>
            <h3 className="lg:text-xl md:text-lg font-semibold mb-4 text-dark-blue font-jakarta">Sales Enquiries</h3>
            <div className="flex items-center gap-3 mb-2">
              <Image src="/phone.png" alt="Phone icon" className="w-5 h-5" width={10} height={100} />
              <p className="text-sm md:text-lg text-dark-blue font-jakarta">+919072243243</p>
            </div>
            <div className="flex items-center gap-3">
              <Image src="/email.png" alt="Email icon" className="w-5 h-5" width={10} height={100} />
              <p className="text-sm md:text-lg  text-dark-blue font-jakarta">sales@buyexchange.in</p>
            </div>
          </div>

          {/* Forex Consultation */}
          <div>
            <h3 className="lg:text-xl md:text-lg font-semibold mb-4 text-dark-blue font-jakarta">Forex Consultation</h3>
            <div className="flex items-center gap-3 mb-2">
              <Image src="/phone.png" alt="Phone icon" className="w-5 h-5" width={10} height={100} />
              <p className="text-sm md:text-lg  text-dark-blue font-jakarta">+919072243243</p>
            </div>
            <div className="flex items-center gap-3">
              <Image src="/email.png" alt="Email icon" className="w-5 h-5" width={10} height={100} />
              <p className="text-sm md:text-lg text-dark-blue font-jakarta">forex@buyexchange.in</p>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
    </div>
  )
}