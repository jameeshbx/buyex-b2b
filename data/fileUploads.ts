import { FileText, ImageIcon } from "lucide-react"

export interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  comment: string
  uploadedBy: string
  uploadedAt: string
  url?: string
  file?: File
}

export interface Message {
  id: string
  text: string
  sender: string
  timestamp: string
  isStaff: boolean
}

export interface SelectedFile {
  file: File
  preview?: string
}

export const initialUploadedFiles: UploadedFile[] = [
  {
    id: "1",
    name: "Swift copy.pdf",
    type: "application/pdf",
    size: 245760,
    comment: "Zoe Swift copy",
    uploadedBy: "Forex_staff",
    uploadedAt: "2024-03-24 10:30 AM",
  },
  {
    id: "2",
    name: "A2 Form_Zoe Fernandes.pdf",
    type: "application/pdf",
    size: 512000,
    comment: "Zoe A2 Form",
    uploadedBy: "Forex_staff",
    uploadedAt: "2024-03-24 11:15 AM",
  },
  {
    id: "3",
    name: "nature_wallpaperHD.png",
    type: "image/png",
    size: 2048000,
    comment: "Checklist",
    uploadedBy: "Forex_staff",
    uploadedAt: "2024-03-24 03:20 PM",
  },
  {
    id: "4",
    name: "KYC_Zoe.png",
    type: "image/png",
    size: 1536000,
    comment: "KYC",
    uploadedBy: "Forex_staff",
    uploadedAt: "2024-03-24 04:10 PM",
  },
]

export const initialMessages: Message[] = [
  {
    id: "1",
    text: "Lorem ipsum is simply",
    sender: "User",
    timestamp: "10:30 PM",
    isStaff: false,
  },
  {
    id: "2",
    text: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    sender: "User",
    timestamp: "10:30 PM",
    isStaff: false,
  },
  {
    id: "3",
    text: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    sender: "Staff",
    timestamp: "10:04 PM",
    isStaff: true,
  },
  {
    id: "4",
    text: "Lorem ipsum is simply dummy text of the printing and typesetting industry.",
    sender: "User",
    timestamp: "09:04 PM",
    isStaff: false,
  },
]

export const fileUploadConstants = {
  allowedFileTypes: ".pdf,.jpg,.jpeg,.png",
  maxFileSize: 5 * 1024 * 1024, // 5MB
  uploadButtonText: "Upload",
  shareButtonText: "Share it to student",
  dragDropText: {
    browse: "Click to browse or",
    dragDrop: "drag and drop your files",
    allowedTypes: "Allowed: JPG, JPEG, PNG, PDF (Max 5MB each)",
  },
  messageInputPlaceholder: "Type a message...",
  commentInputPlaceholder: "Add comment",
  currentUser: "Current_User",
}

import React from "react"

export const getFileIcon = (type: string, name: string) => {
  if (type.includes("pdf")) return React.createElement(FileText, { className: "h-5 w-5 text-red-500" })
  if (type.includes("image")) return React.createElement(ImageIcon, { className: "h-5 w-5 text-blue-500" })
  return React.createElement(FileText, { className: "h-5 w-5 text-gray-500" })
}

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
