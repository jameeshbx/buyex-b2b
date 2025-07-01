"use client";

import type React from "react";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Trash2, Upload, Check, Eye, Loader2, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilePreview } from "./file-preview";
import { fileUploadSchema } from "@/schema/fileUpload";
import { z } from "zod";
import { toast } from "sonner";

interface S3FileUploaderProps {
  onFileUpload: (file: File | null, s3Url?: string, s3Key?: string) => void;
  currentFile: File | null;
  currentS3Url?: string;
  currentS3Key?: string;
  acceptedFileTypes: string[];
  maxSizeMB: number;
  required?: boolean;
  fieldName?: string;
  folder?: string;
}

export function S3FileUploader({
  onFileUpload,
  currentFile,
  currentS3Url,
  currentS3Key,
  acceptedFileTypes,
  maxSizeMB,
  fieldName = "File",
  folder = "buyex-documents",
}: S3FileUploaderProps) {
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

  const uploadToS3 = async (
    file: File
  ): Promise<{ url?: string; key?: string; error?: string }> => {
    try {
      // console.log("Starting S3 upload for file:", {
      //   name: file.name,
      //   size: file.size,
      //   type: file.type,
      // });

      // Step 1: Get presigned URL from our API
      const requestBody = {
        fileName: file.name,
        fileType: file.type,
        folder,
      };

      // console.log("Requesting presigned URL with body:", requestBody);

      const presignedResponse = await fetch("/api/upload/s3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // console.log("Presigned response status:", presignedResponse.status);
      // console.log(
      //   "Presigned response headers:",
      //   Object.fromEntries(presignedResponse.headers.entries())
      // );

      const presignedData = await presignedResponse.json();
      // console.log("Presigned response data:", presignedData);

      if (!presignedResponse.ok) {
        // console.error("Presigned URL request failed:", presignedData);
        throw new Error(presignedData.error || "Failed to get upload URL");
      }

      // Step 2: Upload directly to S3 using presigned URL
      // console.log(
      //   "Uploading to S3 with presigned URL:",
      //   presignedData.presignedUrl
      // );

      // Test the presigned URL first
      // console.log("Testing presigned URL connectivity...");
      try {
        const testResponse = await fetch(presignedData.presignedUrl, {
          method: "HEAD",
        });
        console.log("Presigned URL test response:", testResponse.status);
      } catch (testError) {
        console.warn(
          "Presigned URL test failed (this might be expected):",
          testError
        );
      }

      // Add better error handling for the fetch request
      let uploadResponse;
      try {
        uploadResponse = await fetch(presignedData.presignedUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
            "Cache-Control": "no-cache",
          },
        });
      } catch (fetchError) {
        console.error("Fetch error details:", {
          error: fetchError,
          message:
            fetchError instanceof Error
              ? fetchError.message
              : "Unknown fetch error",
          presignedUrl: presignedData.presignedUrl,
          fileSize: file.size,
          fileType: file.type,
        });

        // Try alternative approach without additional headers
        try {
          console.log("Retrying upload without additional headers...");
          uploadResponse = await fetch(presignedData.presignedUrl, {
            method: "PUT",
            body: file,
          });
        } catch (retryError) {
          console.error("Retry also failed:", retryError);
          throw new Error(
            `Network error: ${
              fetchError instanceof Error
                ? fetchError.message
                : "Failed to connect to S3"
            }`
          );
        }
      }

      // console.log("S3 upload response status:", uploadResponse.status);
      // console.log(
      //   "S3 upload response headers:",
      //   Object.fromEntries(uploadResponse.headers.entries())
      // );

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error(
          "S3 upload failed:",
          uploadResponse.status,
          uploadResponse.statusText,
          errorText
        );
        throw new Error(
          `S3 upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`
        );
      }

      // console.log("S3 upload successful, returning:", {
      //   url: presignedData.cloudFrontUrl,
      //   key: presignedData.key,
      // });

      return {
        url: presignedData.cloudFrontUrl,
        key: presignedData.key,
      };
    } catch (error) {
      console.error("S3 upload error:", error);
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
          const uploadResult = await uploadToS3(file);

          if (uploadResult.error) {
            setError(uploadResult.error);
            onFileUpload(null);
            toast.error(`Failed to upload ${fieldName}: ${uploadResult.error}`);
          } else {
            onFileUpload(file, uploadResult.url, uploadResult.key);
            toast.success(`${fieldName} uploaded successfully to S3!`);
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
            const uploadResult = await uploadToS3(file);

            if (uploadResult.error) {
              setError(uploadResult.error);
              onFileUpload(null);
              toast.error(
                `Failed to upload ${fieldName}: ${uploadResult.error}`
              );
            } else {
              onFileUpload(file, uploadResult.url, uploadResult.key);
              toast.success(`${fieldName} uploaded successfully to S3!`);
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
    [onFileUpload, error, fieldName, validateFile, uploadToS3]
  );

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = async () => {
    // If there's an S3 key, delete the file from S3 first
    if (currentS3Key) {
      try {
        const response = await fetch("/api/upload/s3/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ key: currentS3Key }),
        });

        if (response.ok) {
          toast.success(`${fieldName} deleted from S3 successfully`);
        } else {
          console.error("Failed to delete from S3:", await response.text());
          toast.warning(`${fieldName} removed locally but S3 deletion failed`);
        }
      } catch (error) {
        console.error("Error deleting from S3:", error);
        toast.warning(`${fieldName} removed locally but S3 deletion failed`);
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
          {currentS3Url && (
            <span className="text-xs text-green-600 ml-2 flex items-center">
              <Cloud className="h-3 w-3 mr-1" /> S3 + CloudFront
            </span>
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
            <p className="text-sm text-gray-500">Uploading to S3...</p>
          </div>
        ) : currentFile ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-2">
              <span className="text-green-500 flex items-center text-xs">
                {currentS3Url ? "Uploaded to S3 + CloudFront" : "Processing..."}{" "}
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
            <p className="text-xs text-blue-500 mt-1 flex items-center">
              <Cloud className="h-3 w-3 mr-1" />
              Files will be uploaded to S3 + CloudFront
            </p>
          </>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      <FilePreview
        file={currentFile}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        cloudinaryUrl={currentS3Url}
      />
    </div>
  );
}
