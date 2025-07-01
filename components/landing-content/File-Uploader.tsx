"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Trash2, Upload, Check, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FilePreview } from "./File-Preview"
import { fileUploadSchema } from "@/schema/fileUpload"
import { z } from "zod"
import { toast } from "sonner"

interface FileUploaderProps {
  onFileUpload: (file: File | null) => void
  currentFile: File | null
  acceptedFileTypes: string[]
  maxSizeMB: number
  required?: boolean
  fieldName?: string
}

export function FileUploader({
onFileUpload,
currentFile,
acceptedFileTypes,
maxSizeMB,
fieldName = "File",
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    try {
      fileUploadSchema.parse({ file })
      setError(null)
      return true
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message)
      } else {
        setError("Invalid file")
      }
      return false
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      if (validateFile(file)) {
        onFileUpload(file)
        toast.success(`${fieldName} uploaded successfully!`)
      } else {
        onFileUpload(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
      }
    } else {
      onFileUpload(null)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files?.[0] || null
      if (file) {
        if (validateFile(file)) {
          onFileUpload(file)
          toast.success(`${fieldName} uploaded successfully!`)
        } else {
          toast.error(`Invalid file: ${error}`)
        }
      }
    },
    [onFileUpload, error, fieldName],
  )

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = () => {
    onFileUpload(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    setShowPreview(false)
    setError(null)
    toast.info(`${fieldName} removed`)
  }

  const handlePreviewClick = () => {
    setShowPreview(true)
  }

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedFileTypes.join(",")}
        className="hidden"
      />

      {currentFile ? (
        <div className="mb-2 flex items-center bg-sky-blue p-2 rounded">
          <Image src="/images/System Icons.svg" alt="File Icon" width={16} height={16} className="mr-2" />
          <span className="text-sm text-gray-600 truncate max-w-[200px]">{currentFile.name}</span>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handlePreviewClick}
              className="text-blue-500 hover:text-blue-700"
              aria-label="Preview file"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-gray-500 hover:text-red-500"
              aria-label="Remove file"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      <div
        className={`border border-dashed border-blue-400 rounded-lg p-6 flex flex-col items-center justify-center h-[150px] relative ${isDragging ? "border-blue-500 bg-blue-50" : "border-blue-400"
          } ${error ? "border-red-500" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {currentFile ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-2">
              <span className="text-green-500 flex items-center text-xs">
                Get a preview <Check className="h-3 w-3 ml-1" />
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
              <button type="button" onClick={handleBrowseClick} className="text-blue-500 hover:text-blue-700">
                upload
              </button>
            </p>
            <p className="text-xs text-gray-400">
              Supported: {acceptedFileTypes.join(", ")} (Max {maxSizeMB}MB)
            </p>
          </>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      <FilePreview file={currentFile} isOpen={showPreview} onClose={() => setShowPreview(false)} />
    </div>
  )
}
