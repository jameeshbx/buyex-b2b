"use client";

import { useState } from "react";
import { Sidebar } from "@/app/(protected)/staff/(components)/Sidebar";
import { cn } from "@/lib/utils";

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
    <div className="flex min-h-screen bg-gray-50">
      <div
        className={cn(
          "flex-shrink-0 transition-all duration-300",
          sidebarExpanded ? "w-64" : "w-20"
        )}
      >
        <Sidebar collapsed={!sidebarExpanded} toggleSidebar={toggleSidebar} />
      </div>
      <main className="flex-1">
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
