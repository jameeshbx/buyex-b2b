"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import OrderDetailsForm from "./Agent-Order-details-form";
import { Topbar } from "../../(components)/Topbar";

function page() {
  return (
    <div>
      
      <div className="p-4 bg-white">
        <SessionProvider>
          <Topbar />
          <OrderDetailsForm/>
        </SessionProvider>
      </div>
    </div>
  );
}

export default page;
