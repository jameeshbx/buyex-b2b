"use client";

import React, { useState, Suspense } from "react";
import { Topbar } from "@/app/(protected)/staff/(components)/Topbar";
import { pagesData } from "@/data/navigation";
import TransactionDetails from "./Order";
import SuccessModal from "./Popup";
import { useSearchParams } from "next/navigation";

function OrderPreviewContent() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const orderId = useSearchParams().get("orderId");

  const handleCreateOrder = () => {
    setShowSuccessModal(true);
  };
   const handleBack = () => {
    window.history.back(); // or use router.back() if using useRouter()
  };

  return (
    <>
      <TransactionDetails
        onCreateOrder={handleCreateOrder}
        orderId={orderId || ""}
        onBack={handleBack}
      />
      {showSuccessModal && (
        <SuccessModal onClose={() => setShowSuccessModal(false)} />
      )}
    </>
  );
}

function Page() {
  return (
    <div>
      <div className="sticky top-0 z-10 bg-gray-50">
        <Topbar pageData={pagesData.orderPreview} />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <OrderPreviewContent />
      </Suspense>
    </div>
  );
}

export default Page;
