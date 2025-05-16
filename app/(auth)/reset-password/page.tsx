"use client";

import React, { Suspense } from "react";
import ResetpasswordPage from "@/components/landing-content/reset-password";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetpasswordPage/>
    </Suspense>
  );
}
