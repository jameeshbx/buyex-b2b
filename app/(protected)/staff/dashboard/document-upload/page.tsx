"use client";

import DocumentUploadForm from "@/app/(protected)/staff/(components)/document-upload-form";
import ListDocuments from "../../(components)/ListDocuments";
import { Topbar } from "../../(components)/Topbar";
import { pagesData } from "@/data/navigation";
import Menubar from "../../(components)/Menubar";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function DocumentUploadContent() {
  const searchParams = useSearchParams();
  const orderID = searchParams.get("orderId") || "";

  return (
    <main className="container  mx-auto py-8 px-4">
      <Topbar pageData={pagesData.documentUpload} />
      <Menubar />
      <div className="p-4 bg-white">
        <Suspense fallback={<div>Loading...</div>}>
          <DocumentUploadForm orderID={orderID} currentUser={null} />
          <div className="mt-4">
            <ListDocuments orderID={orderID} />
          </div>
        </Suspense>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DocumentUploadContent />
    </Suspense>
  );
}
