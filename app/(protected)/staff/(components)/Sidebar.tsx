"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useMediaQuery } from "@/hooks/use-mobile"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from "@/lib/utils"

export function useMobile() {
  const isMobileQuery = useMediaQuery("(max-width: 768px)")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(isMobileQuery)
  }, [isMobileQuery])

  return isMobile
}

type NavItemProps = {
  href: string
  icon: React.ReactNode
  label: string
  collapsed: boolean
  active: boolean
}

function NavItem({ href, icon, label, collapsed, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-3 py-2.5 rounded-lg mx-2 text-gray-600 hover:bg-gray-100 transition-colors",
        active && "bg-blue-50 text-blue-600 font-medium",
        collapsed ? "justify-center" : "justify-start",
      )}
    >
      <span
        className={cn(
          "flex-shrink-0 flex items-center justify-center w-6 h-6",
          active ? "text-blue-600" : "text-gray-500",
        )}
      >
        {icon}
      </span>
      {!collapsed && <span className="ml-3 truncate">{label}</span>}
    </Link>
  )
}

export function Sidebar({
  collapsed,
  toggleSidebar,
}: {
  collapsed: boolean
  toggleSidebar: () => void
}) {
  const isMobile = useMobile()
  const pathname = usePathname()

  const navItems = [
    {
      href: "/dashboard",
      icon: <Image src="/dash.svg" alt="Dashboard" width={24} height={24} className="w-6 h-6" />,
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/orders",
      icon: <Image src="/orders.svg" alt="Orders" width={24} height={24} className="w-6 h-6" />,
      label: "View All Orders",
      active: pathname === "/orders",
    },
    {
      href: "/staff/dashboard/placeorder",
      icon: <Image src="/placeee.svg" alt="Place Order" width={24} height={24} className="w-6 h-6" />,
      label: "Place an order",
      active: pathname === "/placeorder",
    },
    {
      href: "/receivers",
      icon: <Image src="/Placean.svg" alt="Receivers" width={24} height={24} className="w-6 h-6" />,
      label: "Manage receivers",
      active: pathname === "/receivers",
    },
  ]

  const secondaryItems = [
    {
      href: "/staff/pages/settings",
      icon: <Image src="/Icon-1.svg" alt="Settings" width={24} height={24} className="w-6 h-6" />,
      label: "Settings",
      active: pathname === "/settings",
    },
    {
      href: "/support",
      icon: <Image src="/Icon-2.svg" alt="Support" width={24} height={24} className="w-6 h-6" />,
      label: "Support",
      active: pathname === "/support",
    },
    {
      href: "/",
      icon: <Image src="/icon-park-outline_reject.svg" alt="Logout" width={20} height={24} className="w-5 h-6" />,
      label: "Logout",
      active: pathname === "/logout",
    },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && !collapsed && (
        <div className="fixed inset-0 bg-black/50 z-[49] lg:hidden" onClick={toggleSidebar} aria-hidden="true" />
      )}

      {/* Sidebar container */}
      <div
        className={cn(
          "h-screen bg-white shadow-sm flex flex-col justify-between transition-all duration-300 border-r fixed z-50",
          collapsed ? "w-16 sm:w-20" : "w-64",
          isMobile && collapsed ? "translate-x-0" : isMobile && !collapsed ? "translate-x-0" : "translate-x-0",
        )}
      >
        {/* Header section */}
        <div className="p-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            {collapsed ? (
              <div className="relative h-10 w-10">
                <Image src="/Top.png" alt="Logo" width={40} height={40} className="h-full w-auto object-contain" />
              </div>
            ) : (
              <div className="relative h-[60px] w-[116px] ml-8">
                <Image
                  src="/header-logo.png"
                  alt="Logo"
                  width={116}
                  height={60}
                  className="h-full w-full object-contain"
                />
              </div>
            )}
          </Link>

          {/* Toggle button - visible on all screen sizes */}
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation sections */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                collapsed={collapsed}
                active={item.active}
              />
            ))}
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4 px-2">
            <div className="space-y-1">
              {secondaryItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  collapsed={collapsed}
                  active={item.active}
                />
              ))}
            </div>
          </div>
        </div>

        {/* User profile section */}
        <div className={cn("border-t p-4 flex items-center", collapsed ? "justify-center" : "justify-between")}>
          <div className="flex items-center min-w-0">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <Image src="/boy.jpg" alt="User avatar" width={40} height={40} className="h-full w-full object-cover" />
            </div>
            {!collapsed && (
              <div className="ml-3 min-w-0 flex-1 overflow-hidden">
                <div className="text-sm font-medium text-gray-700 truncate">Welcome back 👋</div>
                <div className="text-xs text-gray-500 truncate">Staff</div>
              </div>
            )}
          </div>
          {!collapsed && <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />}
        </div>
      </div>
    </>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const isMobile = useMobile()

  // Automatically collapse on mobile and expand on desktop
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
    } else {
      // Check localStorage for preference when not on mobile
      const storedState = localStorage.getItem("sidebarCollapsed")
      if (storedState !== null) {
        setCollapsed(storedState === "true")
      } else {
        setCollapsed(false)
      }
    }
  }, [isMobile])

  // Persist state to localStorage (only for desktop)
  useEffect(() => {
    if (!isMobile && typeof window !== "undefined") {
      localStorage.setItem("sidebarCollapsed", String(collapsed))
    }
  }, [collapsed, isMobile])

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <main
        className={cn(
          "flex-1 overflow-auto transition-[margin] duration-300",
          collapsed ? "ml-16 sm:ml-20" : "ml-0 md:ml-64",
          "p-4 sm:p-6 max-w-7xl w-full mx-auto",
        )}
      >
        {children}
      </main>
    </div>
  )
}