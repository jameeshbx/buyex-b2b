"use client";

import { useState } from "react";
import { S3FileUploader } from "./s3-file-uploader";

interface FileState {
  file: File | null;
  s3Url?: string;
  s3Key?: string;
}

export default function S3UploadDemo() {
  const [fileState, setFileState] = useState<FileState>({
    file: null,
    s3Url: undefined,
    s3Key: undefined,
  });

  const handleFileUpload = (
    file: File | null,
    s3Url?: string,
    s3Key?: string
  ) => {
    setFileState({
      file,
      s3Url,
      s3Key,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">S3 + CloudFront File Upload Demo</h2>
        <p className="text-gray-600">
          This component demonstrates direct file upload to AWS S3 with
          CloudFront CDN delivery.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Document Upload
          </label>
          <S3FileUploader
            onFileUpload={handleFileUpload}
            currentFile={fileState.file}
            currentS3Url={fileState.s3Url}
            currentS3Key={fileState.s3Key}
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
              {fileState.s3Url && (
                <p>
                  <strong>CloudFront URL:</strong>
                  <a
                    href={fileState.s3Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline ml-1"
                  >
                    View File
                  </a>
                </p>
              )}
              {fileState.s3Key && (
                <p>
                  <strong>S3 Key:</strong> {fileState.s3Key}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
