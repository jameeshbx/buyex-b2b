import DocumentUploadForm from "@/app/(protected)/staff/(components)/document-upload-form";
import React from "react";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

async function page({ params }: PageProps) {
  const { orderId } = await params;
  return (
    <div>
      <DocumentUploadForm orderID={orderId} />
    </div>
  );
}

export default page;
