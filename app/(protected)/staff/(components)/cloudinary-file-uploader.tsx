"use client";

import type React from "react";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Trash2, Upload, Check, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilePreview } from "./file-preview";
import { fileUploadSchema } from "@/schema/fileUpload";
import { z } from "zod";
import { toast } from "sonner";

interface CloudinaryFileUploaderProps {
  onFileUpload: (
    file: File | null,
    cloudinaryUrl?: string,
    publicId?: string
  ) => void;
  currentFile: File | null;
  currentCloudinaryUrl?: string;
  currentPublicId?: string;
  acceptedFileTypes: string[];
  maxSizeMB: number;
  required?: boolean;
  fieldName?: string;
  folder?: string;
}

export function CloudinaryFileUploader({
  onFileUpload,
  currentFile,
  currentCloudinaryUrl,
  currentPublicId,
  acceptedFileTypes,
  maxSizeMB,
  fieldName = "File",
  folder = "buyex-documents",
}: CloudinaryFileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    try {
      fileUploadSchema.parse({ file });
      setError(null);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("Invalid file");
      }
      return false;
    }
  };

  const uploadToCloudinary = async (
    file: File
  ): Promise<{ url?: string; publicId?: string; error?: string }> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload/cloudinary", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      return {
        url: result.url,
        publicId: result.publicId,
      };
    } catch (error) {
      console.error("Upload error:", error);
      return {
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (validateFile(file)) {
        setIsUploading(true);
        setError(null);

        try {
          const uploadResult = await uploadToCloudinary(file);

          if (uploadResult.error) {
            setError(uploadResult.error);
            onFileUpload(null);
            toast.error(`Failed to upload ${fieldName}: ${uploadResult.error}`);
          } else {
            onFileUpload(file, uploadResult.url, uploadResult.publicId);
            toast.success(`${fieldName} uploaded successfully to Cloudinary!`);
          }
        } catch (error) {
          setError("Upload failed");
          console.log(error);
          onFileUpload(null);
          toast.error(`Failed to upload ${fieldName}`);
        } finally {
          setIsUploading(false);
        }
      } else {
        onFileUpload(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } else {
      onFileUpload(null);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0] || null;
      if (file) {
        if (validateFile(file)) {
          setIsUploading(true);
          setError(null);

          try {
            const uploadResult = await uploadToCloudinary(file);

            if (uploadResult.error) {
              setError(uploadResult.error);
              onFileUpload(null);
              toast.error(
                `Failed to upload ${fieldName}: ${uploadResult.error}`
              );
            } else {
              onFileUpload(file, uploadResult.url, uploadResult.publicId);
              toast.success(
                `${fieldName} uploaded successfully to Cloudinary!`
              );
            }
          } catch (error) {
            setError("Upload failed");
            console.log(error);
            onFileUpload(null);
            toast.error(`Failed to upload ${fieldName}`);
          } finally {
            setIsUploading(false);
          }
        } else {
          toast.error(`Invalid file: ${error}`);
        }
      }
    },
    [onFileUpload, error, fieldName, validateFile, uploadToCloudinary]
  );

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = async () => {
    // If there's a Cloudinary public ID, delete the file from Cloudinary first
    if (currentPublicId) {
      try {
        const response = await fetch("/api/upload/cloudinary/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ publicId: currentPublicId }),
        });

        if (response.ok) {
          toast.success(`${fieldName} deleted from Cloudinary successfully`);
        } else {
          console.error(
            "Failed to delete from Cloudinary:",
            await response.text()
          );
          toast.warning(
            `${fieldName} removed locally but Cloudinary deletion failed`
          );
        }
      } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        toast.warning(
          `${fieldName} removed locally but Cloudinary deletion failed`
        );
      }
    }

    onFileUpload(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShowPreview(false);
    setError(null);
    toast.info(`${fieldName} removed`);
  };

  const handlePreviewClick = () => {
    setShowPreview(true);
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedFileTypes.join(",")}
        className="hidden"
        disabled={isUploading}
      />

      {currentFile ? (
        <div className="mb-2 flex items-center bg-sky-blue p-2 rounded">
          <Image
            src="/images/System Icons.svg"
            alt="File Icon"
            width={16}
            height={16}
            className="mr-2"
          />
          <span className="text-sm text-gray-600 truncate max-w-[200px]">
            {currentFile.name}
          </span>
          {currentCloudinaryUrl && (
            <span className="text-xs text-green-600 ml-2">✓ Cloudinary</span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handlePreviewClick}
              className="text-blue-500 hover:text-blue-700"
              aria-label="Preview file"
              disabled={isUploading}
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-gray-500 hover:text-red-500"
              aria-label="Remove file"
              disabled={isUploading}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      <div
        className={`border border-dashed border-blue-400 rounded-lg p-6 flex flex-col items-center justify-center h-[150px] relative ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-blue-400"
        } ${error ? "border-red-500" : ""} ${
          isUploading ? "opacity-50 pointer-events-none" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-6 w-6 text-blue-500 animate-spin mb-2" />
            <p className="text-sm text-gray-500">Uploading to Cloudinary...</p>
          </div>
        ) : currentFile ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-2">
              <span className="text-green-500 flex items-center text-xs">
                {currentCloudinaryUrl
                  ? "Uploaded to Cloudinary"
                  : "Processing..."}{" "}
                <Check className="h-3 w-3 ml-1" />
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-blue-500 hover:text-blue-700 text-xs"
              onClick={handlePreviewClick}
            >
              <Eye className="h-4 w-4 mr-1" />
              View file
            </Button>
          </div>
        ) : (
          <>
            <Upload className="h-6 w-6 text-gray-400 mb-2" />
            <p className="text-sm text-center text-gray-500 mb-1">
              Drop here to attach or{" "}
              <button
                type="button"
                onClick={handleBrowseClick}
                className="text-blue-500 hover:text-blue-700"
                disabled={isUploading}
              >
                upload
              </button>
            </p>
            <p className="text-xs text-gray-400">
              Supported: {acceptedFileTypes.join(", ")} (Max {maxSizeMB}MB)
            </p>
            <p className="text-xs text-blue-500 mt-1">
              Files will be uploaded to Cloudinary
            </p>
          </>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      <FilePreview
        file={currentFile}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        cloudinaryUrl={currentCloudinaryUrl}
      />
    </div>
  );
}
