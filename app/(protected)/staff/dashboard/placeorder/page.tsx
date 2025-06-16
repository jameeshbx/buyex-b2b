"use client";

import React from "react";
import OrderDetailsForm from "./order-details-form";
import { Topbar } from "../../(components)/Topbar";
import { pagesData } from "@/data/navigation";
import BreadcrumbMenubar from "../../(components)/Menubar";
import { SessionProvider } from "next-auth/react";

function page() {
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

export default page;
