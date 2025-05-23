"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { type MenuItem, getActiveMenuItem } from "@/data/menubar"

export default function BreadcrumbMenubar() {
  const router = useRouter()
  const pathname = usePathname()
  const [activeItems, setActiveItems] = useState<MenuItem[]>([])

  useEffect(() => {
    setActiveItems(getActiveMenuItem(pathname))
  }, [pathname])

  const handleMenuItemClick = (url: string) => {
    router.push(url)
  }

  return (
    <div className="sticky top-0 z-20 bg-white w-full mt-6 md:mt-10">
      <div className="flex justify-center">
        <div className="flex w-full max-w-screen-lg overflow-x-auto hide-scrollbar px-2 sm:px-4 md:px-6">
          <div className="flex w-full md:w-auto md:mx-auto">
            {activeItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.url)}
                className={`flex-shrink-0 py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-8 lg:px-14 text-center transition-colors font-medium text-xs sm:text-sm md:text-base whitespace-nowrap ${
                  item.active ? "bg-white text-black" : "bg-dark-blue text-white hover:bg-dark-blue"
                } ${
                  item.id === "order-details" || item.id === "beneficiary-details" ? "rounded-tl-md rounded-tr-md" : ""
                } ${
                  item.id === "sender-details" || item.id === "documents" ? "rounded-tl-lg rounded-tr-lg" : ""
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
