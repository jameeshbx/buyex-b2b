"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { menuItems } from "@/data/menubar"

interface MenuItem {
  id: string
  label: string
  url: string
  active?: boolean
  onClick?: (e: React.MouseEvent) => void
}

export default function BreadcrumbMenubar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [menuItemsList, setMenuItems] = useState<MenuItem[]>([])
  const orderId = searchParams.get('orderId') || ''

  useEffect(() => {
    // Get menu items with orderId if available
    const items = menuItems(orderId)
    
    // Mark active item based on current path
    const activeItems = items.map(item => ({
      ...item,
      active: pathname.includes(item.url.split('?')[0])
    }))
    
    setMenuItems(activeItems)
  }, [pathname, orderId])

  const handleMenuItemClick = (item: MenuItem) => (e: React.MouseEvent) => {
    if (item.id === 'order-details' && item.onClick) {
      item.onClick(e)
      return
    }
    router.push(item.url)
  }

  return (
    <div className="w-full sticky top-25 z-40 bg-gray-50 mt-10">
      <div className="flex justify-center">
        <div className="flex max-w-screen-lg w-full md:ml-[60px] overflow-x-auto hide-scrollbar">
          <div className="flex">
            {menuItemsList.map((item) => (
              <button
                key={item.id}
                onClick={handleMenuItemClick(item)}
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
