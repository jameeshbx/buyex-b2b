"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function useMobile() {
  const isMobileQuery = useMediaQuery("(max-width: 768px)");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileQuery);
  }, [isMobileQuery]);

  return isMobile;
}

type NavItemProps = {
  href?: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active: boolean;
  onClick?: () => void;
  isButton?: boolean;
};

function NavItem({
  href,
  icon,
  label,
  collapsed,
  active,
  onClick,
  isButton,
}: NavItemProps) {
  const baseClasses = cn(
    "flex items-center px-3 py-2.5 rounded-lg mx-2 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer",
    active && "bg-blue-50 text-blue-600 font-medium",
    collapsed ? "justify-center" : "justify-start"
  );

  if (isButton) {
    return (
      <button onClick={onClick} className={baseClasses}>
        <span
          className={cn(
            "flex-shrink-0 flex items-center justify-center w-6 h-6",
            active ? "text-blue-600" : "text-gray-500"
          )}
        >
          {icon}
        </span>
        {!collapsed && <span className="ml-3 truncate">{label}</span>}
      </button>
    );
  }

  return (
    <Link href={href!} className={baseClasses}>
      <span
        className={cn(
          "flex-shrink-0 flex items-center justify-center w-6 h-6",
          active ? "text-blue-600" : "text-gray-500"
        )}
      >
        {icon}
      </span>
      {!collapsed && <span className="ml-3 truncate">{label}</span>}
    </Link>
  );
}

export function Sidebar({
  collapsed,
  toggleSidebar,
}: {
  collapsed: boolean;
  toggleSidebar: () => void;
}) {
  const isMobile = useMobile();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Force clear all cookies and session data
      await signOut({
        callbackUrl: "/signin",
        redirect: true,
      });

      // Additional cleanup - clear any local storage or session storage
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }

      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    {
      href: "/admin/dashboard",
      icon: (
        <Image
          src="/orders.svg"
          alt="Orders"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      ),
      label: "Dashboard",
      active: pathname === "/admin/dashboard",
    },
    {
      href: "/admin/dashboard/manage-users",
      icon: (
        <Image
          src="/Placean.svg"
          alt="Receivers"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      ),
      label: "Manage users",
      active: pathname === "/admin/dashboard/manage-users",
    },
    {
      href: "/admin/dashboard/reports",
      icon: (
        <Image
          src="/report.png"
          alt="Receivers"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      ),
      label: "Reports",
      active: pathname === "/admin/dashboard/reports",
    },
    {
      href: "/admin/dashboard/partner-banks",
      icon: (
        <Image
          src="/hbank.png"
          alt="Receivers"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      ),
      label: "Partner Banks",
      active: pathname === "/admin/dashboard/partner-banks",
    },
  ];

  const secondaryItems = [
    {
      href: "/admin/dashboard/settings",
      icon: (
        <Image
          src="/Icon-1.svg"
          alt="Settings"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      ),
      label: "Settings",
      active: pathname === "/admin/dashboard/settings",
    },
    {
      href: "/support",
      icon: (
        <Image
          src="/Icon-2.svg"
          alt="Support"
          width={24}
          height={24}
          className="w-6 h-6"
        />
      ),
      label: "Support",
      active: pathname === "/support",
    },
    {
      icon: (
        <Image
          src="/icon-park-outline_reject.svg"
          alt="Logout"
          width={20}
          height={24}
          className="w-5 h-6"
        />
      ),
      label: isLoggingOut ? "Logging out..." : "Logout",
      active: false,
      onClick: handleLogout,
      isButton: true,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container - Fixed positioning with proper z-index */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-white shadow-lg flex flex-col justify-between transition-all duration-300 border-r border-gray-200 z-50",
          collapsed ? "w-16 sm:w-20" : "w-64",
          // Mobile behavior
          isMobile && collapsed && "-translate-x-full",
          isMobile && !collapsed && "translate-x-0"
        )}
      >
        {/* Header section */}
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          {collapsed ? (
            <Link href="/admin/dashboard" className="flex items-center">
              <div className="relative h-10 w-10">
                <Image
                  src="/Top.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="h-full w-auto object-contain"
                />
              </div>
            </Link>
          ) : (
            <Link href="/" className="flex items-center">
              <div className="relative h-[60px] w-[116px] ml-8 cursor-pointer">
                <Image
                  src="/buyex-main-logo.png"
                  alt="Logo"
                  width={196}
                  height={70}
                  className="h-full w-full object-contain"
                />
              </div>
            </Link>
          )}

          {/* Toggle button */}
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

        {/* Navigation sections - Scrollable content */}
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-2 px-3">
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
          </nav>

          {/* Secondary navigation */}
          <div className="border-t border-gray-200 mt-6 pt-6 px-3">
            <nav className="space-y-2">
              {secondaryItems.map((item, index) => (
                <NavItem
                  key={item.href || `logout-${index}`}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  collapsed={collapsed}
                  active={item.active}
                  onClick={item.onClick}
                  isButton={item.isButton}
                />
              ))}
            </nav>
          </div>
        </div>

        {/* User profile section - Fixed at bottom */}
        <div
          className={cn(
            "border-t border-gray-100 p-4 flex items-center bg-gray-50",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          <div className="flex items-center min-w-0">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          <Image
                            src="/amrutha.jpg"
                            alt="User avatar"
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        </div>
            {!collapsed && (
              <div className="ml-3 min-w-0 flex-1 overflow-hidden">
                <div className="text-sm font-medium text-gray-700 truncate">
                  Welcome back 👋
                </div>
                <div className="text-xs text-gray-500 truncate">Admin</div>
              </div>
            )}
          </div>
          {!collapsed && (
            <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
          )}
        </div>
      </aside>
    </>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useMobile();

  // Handle mobile/desktop behavior
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    } else {
      // Check localStorage for preference when not on mobile
      const storedState = localStorage.getItem("sidebarCollapsed");
      if (storedState !== null) {
        setCollapsed(storedState === "true");
      } else {
        setCollapsed(false);
      }
    }
  }, [isMobile]);

  // Persist state to localStorage (only for desktop)
  useEffect(() => {
    if (!isMobile && typeof window !== "undefined") {
      localStorage.setItem("sidebarCollapsed", String(collapsed));
    }
  }, [collapsed, isMobile]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />

      {/* Main content area - Properly positioned relative to sidebar */}
      <main
        className={cn(
          "transition-all duration-300 min-h-screen",
          // Desktop: Always account for sidebar space
          !isMobile && (collapsed ? "ml-16 sm:ml-20" : "ml-64"),
          // Mobile: Full width when sidebar is collapsed (hidden)
          isMobile && "ml-0"
        )}
      >
        {/* Content wrapper with proper padding */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
