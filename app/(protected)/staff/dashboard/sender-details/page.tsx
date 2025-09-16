'use client';

import { Suspense } from 'react';
import Sender from "@/app/(protected)/staff/dashboard/sender-details/Senderdetails";
import { Topbar } from "@/app/(protected)/staff/(components)/Topbar";
import { pagesData } from "@/data/navigation";
import BreadcrumbMenubar from "../../(components)/Menubar";

// Create a client component that uses useSearchParams
function SenderDetailsContent() {
  return (
    <div>
      <div className="sticky top-0 z-10 bg-gray-50">
        <Topbar pageData={pagesData.senderDetails} />
      </div>
      <div className="sticky top-25 z-10 bg-gray-50">
        <BreadcrumbMenubar />
      </div>
      <Suspense fallback={<div>Loading sender details...</div>}>
        <Sender />
      </Suspense>
    </div>
  );
}

// Main page component
function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SenderDetailsContent />
    </Suspense>
  );
}

// Export a dynamic component to disable SSR for this page
export const dynamic = 'force-dynamic';

export default Page;
