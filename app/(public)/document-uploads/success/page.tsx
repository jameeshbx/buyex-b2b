"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Try to close the window automatically after a delay
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.close();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-green-600 mb-2">Documents Uploaded Successfully!</h2>
          <p className="text-gray-600 mb-4">
            Your documents have been successfully uploaded{orderId ? ` for order #${orderId}` : ''}.
          </p>
          <p className="text-sm text-gray-500">
            This window will close automatically. If it doesn&apos;t close, you may close it manually.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DocumentUploadSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md text-center">
          <p>Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
