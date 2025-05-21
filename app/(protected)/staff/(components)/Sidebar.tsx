"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  collapsed: boolean
  active?: boolean
}

function NavItem({ href, icon, label, collapsed, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors",
        active && "bg-blue-50 text-blue-600",
        collapsed ? "justify-center" : "",
      )}
    >
      <span className={cn("flex-shrink-0", active ? "text-blue-600" : "text-gray-500")}>{icon}</span>
      {!collapsed && <span className="ml-3 truncate">{label}</span>}
    </Link>
  )
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const isMobile = useMobile()
  const pathname = usePathname()

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
    } else if (typeof window !== "undefined") {
      const storedState = localStorage.getItem("sidebarCollapsed")
      if (storedState !== null) {
        setCollapsed(storedState === "true")
      }
    }
  }, [isMobile])

  useEffect(() => {
    if (typeof window !== "undefined" && !isMobile) {
      localStorage.setItem("sidebarCollapsed", String(collapsed))
    }
  }, [collapsed, isMobile])

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <>
      {isMobile && !collapsed && (
        <div className="fixed inset-0 bg-black/20 z-[5]" onClick={toggleSidebar} aria-hidden="true" />
      )}
      <div
        className={cn(
          "h-screen bg-white shadow-sm flex flex-col justify-between transition-all duration-300 border-r fixed z-10",
          collapsed ? "w-[70px]" : "w-[240px]",
        )}
      >
        {/* Header with logo and toggle */}
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center">
            {/* Expanded view with logo and text */}
            {!collapsed && (
              <div className="hidden md:flex items-center">
                <div className="relative h-[60px] w-[116px]">
                  <Image
                    src="/header-logo.png"
                    alt="Buy exchange logo"
                    width={116}
                    height={60}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            )}
            
            {/* Collapsed view - Just icon */}
            {collapsed && (
              <div className="relative h-10 w-10">
                <Image
                  src="/Top.png"
                  alt="Buy exchange logo"
                  width={40}
                  height={40}
                  className="h-full w-auto object-contain"
                />
              </div>
            )}
          </div>
          
          {/* Toggle button - Only visible on desktop */}
          <button 
            onClick={toggleSidebar}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Main navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2 py-4 px-3">
            <NavItem
              href="/dashboard"
              icon={<Image src="/dash.svg" alt="Dashboard" width={24} height={24} className="w-6 h-6" />}
              label="Dashboard"
              collapsed={collapsed}
              active={pathname === "/dashboard"}
            />
            <NavItem
              href="/orders"
              icon={<Image src="/orders.svg" alt="Orders" width={24} height={24} className="w-6 h-6" />}
              label="View All Orders"
              collapsed={collapsed}
              active={pathname === "/orders"}
            />
            <NavItem
              href="/place-order"
              icon={<Image src="/placeee.svg" alt="Place Order" width={24} height={24} className="w-6 h-6" />}
              label="Place an order"
              collapsed={collapsed}
              active={pathname === "/place-order"}
            />
            <NavItem
              href="/receivers"
              icon={<Image src="/Placean.svg" alt="Receivers" width={24} height={24} className="w-6 h-6" />}
              label="Manage receivers"
              collapsed={collapsed}
              active={pathname === "/receivers"}
            />
          </div>

          {/* Secondary navigation */}
          <div className="border-t border-gray-200 mt-2">
            <div className="space-y-2 py-4 px-3">
              <NavItem
                href="/settings"
                icon={<Image src="/Icon-1.svg" alt="Settings" width={24} height={24} className="w-6 h-6" />}
                label="Settings"
                collapsed={collapsed}
                active={pathname === "/settings"}
              />
              <NavItem
                href="/support"
                icon={<Image src="/Icon-2.svg" alt="Support" width={24} height={24} className="w-6 h-6" />}
                label="Support"
                collapsed={collapsed}
                active={pathname === "/support"}
              />
              <NavItem
                href="/"
                icon={<Image src="/icon-park-outline_reject.svg" alt="Logout" width={20} height={24} className="w-5 h-6" />}
                label="Logout"
                collapsed={collapsed}
                active={pathname === "/logout"}
              />
            </div>
          </div>
        </div>

        {/* User profile */}
        <div className={`border-t p-4 flex items-center ${!collapsed ? "md:mb-30" : ""}`}>
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <Image
              src="/boy.jpg"
              alt="User avatar"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
          {!collapsed && (
            <div className="ml-3 min-w-0 flex-1 overflow-hidden">
              <div className="text-sm font-medium text-gray-700 truncate leading-tight">Welcome back 👋</div>
              <div className="text-xs text-gray-500 truncate leading-tight">Staff</div>
            </div>
          )}
          {!collapsed && (
            <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
          )}
        </div>
      </div>
    </>
  )
}