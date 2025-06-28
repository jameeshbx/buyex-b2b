"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Download, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface FilePreviewProps {
  file: File | null;
  isOpen: boolean;
  onClose: () => void;
  cloudinaryUrl?: string;
}

export function FilePreview({
  file,
  isOpen,
  onClose,
  cloudinaryUrl,
}: FilePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (cloudinaryUrl) {
      // Use Cloudinary URL if available
      setPreviewUrl(cloudinaryUrl);
    } else if (file) {
      // Fallback to local file URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, cloudinaryUrl]);

  const handleDownload = () => {
    if (cloudinaryUrl) {
      // Download from Cloudinary URL
      const link = document.createElement("a");
      link.href = cloudinaryUrl;
      link.download = file?.name || "download";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (file && previewUrl) {
      // Download local file
      const link = document.createElement("a");
      link.href = previewUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!file && !cloudinaryUrl) return null;

  const fileName = file?.name || "Cloudinary File";
  const fileType =
    file?.type || (cloudinaryUrl ? "image/jpeg" : "application/octet-stream");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>File Preview - {fileName}</span>
            <div className="flex items-center gap-2">
              {fileType === "application/pdf" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">{Math.round(zoom * 100)}%</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <button
                onClick={onClose}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 max-h-[70vh] overflow-auto">
          {fileType.startsWith("image/") ? (
            <div className="flex justify-center">
              <Image
                src={previewUrl || ""}
                alt="Preview"
                width={800}
                height={600}
                className="max-h-[60vh] max-w-full object-contain"
                style={{ transform: `scale(${zoom})` }}
              />
            </div>
          ) : fileType === "application/pdf" ? (
            <div className="w-full h-[60vh] border rounded">
              <object
                data={previewUrl || ""}
                type="application/pdf"
                width="100%"
                height="100%"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "top left",
                }}
              >
                <div className="flex flex-col items-center justify-center h-full bg-gray-50">
                  <p className="text-gray-600 mb-4">
                    PDF preview not available in this browser.
                  </p>
                  <Button onClick={handleDownload} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF to view
                  </Button>
                </div>
              </object>
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">
                Preview not available for this file type.
              </p>
              <p className="text-sm text-gray-500 mb-4">{fileName}</p>
              {file && (
                <p className="text-xs text-gray-400 mb-4">
                  File size: {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
              {cloudinaryUrl && (
                <p className="text-xs text-blue-500 mb-4">
                  ✓ Stored in Cloudinary
                </p>
              )}
              <Button onClick={handleDownload} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download File
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
