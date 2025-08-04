"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TestA2FormPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const testGenerateA2Form = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/generate-a2-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "test-a2-form.pdf";
      a.click();
      window.URL.revokeObjectURL(url);

      setMessage(`✅ PDF generated successfully! Size: ${blob.size} bytes`);
    } catch (error) {
      console.error("Error:", error);
      setMessage(
        `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Test A2 Form Generation</h1>

      <div className="space-y-4">
        <Button
          onClick={testGenerateA2Form}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? "Generating PDF..." : "Generate A2 Form PDF"}
        </Button>

        {message && (
          <div
            className={`p-4 rounded-md ${
              message.includes("✅")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Click the button above to test the A2 form generation</li>
            <li>The PDF will be automatically downloaded</li>
            <li>Check the console for any errors</li>
            <li>The API uses hardcoded test data</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
