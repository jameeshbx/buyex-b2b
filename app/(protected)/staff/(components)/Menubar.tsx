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
    <div className="w-full sticky top-25 z-40 bg-gray-50 mt-10">
      <div className="flex justify-center">
        <div className="flex max-w-screen-lg w-full md:ml-[60px] overflow-x-auto hide-scrollbar">
          <div className="flex">
            {activeItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.url)}
                className={`flex-shrink-0 py-3 md:py-4 px-4 md:px-14 text-center transition-colors font-medium text-sm md:text-base whitespace-nowrap ${
                  item.active ? "bg-dark-blue text-white" : "bg-white text-black hover:bg-dark-blue"
                } ${item.id === "order-details" || item.id === "beneficiary-details" ? "rounded-tl-md rounded-tr-md"  : ""} ${
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
