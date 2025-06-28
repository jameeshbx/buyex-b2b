"use client";

import { useState } from "react";
import { CloudinaryFileUploader } from "./cloudinary-file-uploader";

interface FileState {
  file: File | null;
  cloudinaryUrl?: string;
  publicId?: string;
}

export default function CloudinaryUploadDemo() {
  const [fileState, setFileState] = useState<FileState>({
    file: null,
    cloudinaryUrl: undefined,
    publicId: undefined,
  });

  const handleFileUpload = (
    file: File | null,
    cloudinaryUrl?: string,
    publicId?: string
  ) => {
    setFileState({
      file,
      cloudinaryUrl,
      publicId,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Cloudinary File Upload Demo</h2>
        <p className="text-gray-600">
          This component demonstrates file upload to Cloudinary with automatic
          S3 storage.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Document Upload
          </label>
          <CloudinaryFileUploader
            onFileUpload={handleFileUpload}
            currentFile={fileState.file}
            currentCloudinaryUrl={fileState.cloudinaryUrl}
            currentPublicId={fileState.publicId}
            acceptedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
            maxSizeMB={5}
            fieldName="Document"
            folder="demo-documents"
          />
        </div>

        {fileState.file && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">Upload Details:</h3>
            <div className="text-sm space-y-1">
              <p>
                <strong>File Name:</strong> {fileState.file.name}
              </p>
              <p>
                <strong>File Size:</strong>{" "}
                {(fileState.file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <p>
                <strong>File Type:</strong> {fileState.file.type}
              </p>
              {fileState.cloudinaryUrl && (
                <p>
                  <strong>Cloudinary URL:</strong>
                  <a
                    href={fileState.cloudinaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline ml-1"
                  >
                    View File
                  </a>
                </p>
              )}
              {fileState.publicId && (
                <p>
                  <strong>Public ID:</strong> {fileState.publicId}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
