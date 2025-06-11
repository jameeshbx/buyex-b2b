"use client"

import { useState } from 'react';
import { Sidebar } from '@/app/(protected)/super-admin/(components)/Sidebar';

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
      <Sidebar 
        collapsed={!sidebarExpanded}
        toggleSidebar={toggleSidebar}
      />
      <main className={`flex-1 transition-all duration-300 ${sidebarExpanded ? 'lg:ml-64' : 'lg:ml-20'} ml-16`}>
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

