import SignupSection from "@/components/landing-content/signup-section";
import { redirect } from "next/navigation";
import React from "react";

function page() {
  redirect("/");
  return (
    <div>
      <SignupSection />
    </div>
  );
}

export default page;
