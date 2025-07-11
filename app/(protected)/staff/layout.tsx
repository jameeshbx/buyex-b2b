"use client";

import { useState } from "react";
import { Sidebar } from "@/app/(protected)/staff/(components)/Sidebar";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={cn(
          "flex-shrink-0 transition-all duration-300 h-screen",
          sidebarExpanded ? "w-64" : "w-20"
        )}
      >
        <Sidebar collapsed={!sidebarExpanded} toggleSidebar={toggleSidebar} />
      </div>
      <main className="flex-1 h-screen overflow-auto">
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
        <Toaster />
        <SonnerToaster />
      </main>
    </div>
  );
}
