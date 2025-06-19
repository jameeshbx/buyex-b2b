"use client";
import React, { Suspense } from "react";
import Sender from "@/app/(protected)/staff/dashboard/sender-details/Senderdetails";
import { Topbar } from "@/app/(protected)/staff/(components)/Topbar";
import { pagesData } from "@/data/navigation";
import BreadcrumbMenubar from "../../(components)/Menubar";

function page() {
  return (
    <div>
      <div className="sticky top-0 z-10 bg-gray-50">
        <Topbar pageData={pagesData.senderDetails} />
      </div>
      <div className="sticky top-25 z-10 bg-gray-50">
        <BreadcrumbMenubar />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Sender />
      </Suspense>
    </div>
  );
}

export default page;
