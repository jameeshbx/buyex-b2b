'use client';

import { Suspense } from 'react';
import { Topbar } from "../../(components)/Topbar";
import { pagesData } from "@/data/navigation";
import BreadcrumbMenubar from "../../(components)/Menubar";
import { SessionProvider } from "next-auth/react";
import OrderDetailsForm from "./order-details-form";

// Client component that contains the search params hook
function OrderDetailsContent() {
  return (
    <div>
      <Topbar pageData={pagesData.orderDetails} />
      <BreadcrumbMenubar />
      <div className="p-4 bg-white">
        <SessionProvider>
          <OrderDetailsForm />
        </SessionProvider>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading order details...</div>
      </div>
    }>
      <OrderDetailsContent />
    </Suspense>
  );
}

// Ensure this page is not statically generated
export const dynamic = 'force-dynamic';
