"use client"

import React, { use } from "react"
import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Upload, Download, Edit, Trash2, Paperclip, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dailog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { z } from "zod"
import { fileUploadSchema, editFileSchema } from "@/schema/uploadfiles"
import { Topbar } from "../../../(components)/Topbar"
import { pagesData } from "@/data/navigation"
import {
  type UploadedFile,
  type Message,
  type SelectedFile,
  initialUploadedFiles,
  initialMessages,
  fileUploadConstants,
  getFileIcon,
  formatFileSize,
} from "@/data/fileUploads"

export default function UploadsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params)
  console.log(orderId)
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedFileForShare, setSelectedFileForShare] = useState<string | null>(null)

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(initialUploadedFiles)
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([])
  const [comment, setComment] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [editingFile, setEditingFile] = useState<UploadedFile | null>(null)
  const [editFileName, setEditFileName] = useState("")
  const [editComment, setEditComment] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

const handleDrag = useCallback((e: React.DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  if (e.type === "dragenter" || e.type === "dragover") {
    setDragActive(true)
  } else if (e.type === "dragleave") {
    setDragActive(false)
  }
}, [])

const handleFileSelection = async (fileList: FileList) => {
  const newFiles: SelectedFile[] = []

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i]

    try {
      // Validate against our schema rules
      fileUploadSchema.pick({ files: true }).parse({ files: [file] })

      let preview = undefined
      if (file.type.startsWith("image/")) {
        preview = URL.createObjectURL(file)
      }

      newFiles.push({ file, preview })
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message)
      }
    }
  }

  setSelectedFiles((prev) => [...prev, ...newFiles])
}

const handleDrop = useCallback((e: React.DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  setDragActive(false)

  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    handleFileSelection(e.dataTransfer.files)
  }
}, [handleFileSelection]) // Add the dependency here

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelection(e.target.files)
    }
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev]
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!)
      }
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const handleUpload = () => {
    setValidationErrors([])

    try {
      const validation = fileUploadSchema.parse({
        files: selectedFiles.map((sf) => sf.file),
        comment: comment.trim(),
      })
      console.log(validation.files);
      console.log(validation.comment);

      // Process upload
      const newUploadedFiles: UploadedFile[] = selectedFiles.map((selectedFile) => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: selectedFile.file.name,
        type: selectedFile.file.type,
        size: selectedFile.file.size,
        comment: comment.trim(),
        uploadedBy: fileUploadConstants.currentUser,
        uploadedAt: new Date().toLocaleString(),
        file: selectedFile.file,
        url: selectedFile.preview,
      }))

      setUploadedFiles((prev) => [...newUploadedFiles, ...prev])

      // Clear selected files and comment
      selectedFiles.forEach((sf) => {
        if (sf.preview) URL.revokeObjectURL(sf.preview)
      })
      setSelectedFiles([])
      setComment("")

      toast(`Files uploaded successfully: ${newUploadedFiles.length} file(s) uploaded`)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors(error.errors.map((err) => err.message))
      }
    }
  }

  const handleDownload = (file: UploadedFile) => {
    if (file.file) {
      // For newly uploaded files
      const url = URL.createObjectURL(file.file)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      // For existing files (simulate download)
      toast(`Download started: Downloading ${file.name}`)
    }
  }

  const handleEdit = (file: UploadedFile) => {
    setEditingFile(file)
    setEditFileName(file.name)
    setEditComment(file.comment)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingFile) return

    try {
      const validation = editFileSchema.parse({
        fileName: editFileName.trim(),
        comment: editComment.trim(),
      })

      console.log(validation.comment);

      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.id === editingFile.id ? { ...file, name: editFileName.trim(), comment: editComment.trim() } : file,
        ),
      )

      setIsEditDialogOpen(false)
      setEditingFile(null)

      toast(`File updated successfully: ${editFileName} has been updated`)
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message)
      }
    }
  }

  const handleDelete = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
    toast("File deleted. File has been removed successfully.")
  }

  const handleShareToStudent = () => {
    if (selectedFileForShare) {
      const fileToShare = uploadedFiles.find((file) => file.id === selectedFileForShare)
      if (fileToShare) {
        toast(`${fileToShare.name} has been shared with the student`)
        setSelectedFileForShare(null)
      }
    } else {
      toast.error("No file selected. Please select a file to share with the student.")
    }
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: "Current User",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " PM",
        isStaff: true,
      }
      setMessages((prev) => [...prev, message])
      setNewMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      {/* Fixed Topbar */}
      <div className="sticky top-0 z-40">
        <Topbar pageData={pagesData.fileUpload} />
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Main Content - Two Equal Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* Left Section - File Upload */}
          <Card className="h-[500px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Zoe Fernandes</CardTitle>
                <Badge className="bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Completed
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4 md:p-6">
              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center flex-1 flex flex-col justify-center transition-colors mb-4 cursor-pointer ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFiles.length === 0 ? (
                  <div className="text-gray-500">
                    <p className="text-sm">{fileUploadConstants.dragDropText.browse}</p>
                    <p className="text-sm">{fileUploadConstants.dragDropText.dragDrop}</p>
                    <p className="text-xs mt-2">{fileUploadConstants.dragDropText.allowedTypes}</p>
                  </div>
                ) : (
                  <ScrollArea className="w-full h-full">
                    <div className="space-y-2">
                      {selectedFiles.map((selectedFile, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                          <div className="flex items-center gap-2">
                            {selectedFile.preview ? (
                              <Image
                                src={selectedFile.preview || "/placeholder.svg"}
                                alt={selectedFile.file.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                            ) : (
                              getFileIcon(selectedFile.file.type, selectedFile.file.name)
                            )}
                            <div className="text-left">
                              <p className="text-xs font-medium truncate max-w-[150px]">{selectedFile.file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(selectedFile.file.size)}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeSelectedFile(index)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="mb-2">
                  {validationErrors.map((error, index) => (
                    <p key={index} className="text-red-500 text-xs">
                      {error}
                    </p>
                  ))}
                </div>
              )}

              {/* Comment Input */}
              <div className="mb-4">
                <Input
                  placeholder={fileUploadConstants.commentInputPlaceholder}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Upload Button */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInput}
                className="hidden"
                accept={fileUploadConstants.allowedFileTypes}
              />
              <Button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                {fileUploadConstants.uploadButtonText}
              </Button>
            </CardContent>
          </Card>

          {/* Right Section - Messages */}
          <Card className="h-[500px] flex flex-col">
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Area with Scroll */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.isStaff ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] ${message.isStaff ? "order-2" : "order-1"}`}>
                          <div
                            className={`rounded-lg p-3 ${message.isStaff ? "bg-gray-100 text-gray-900" : "bg-blue-500 text-white"
                              }`}
                          >
                            <p className="text-sm">{message.text}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs bg-orange-200 text-orange-800">
                                {message.sender.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-500">{message.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </div>

              {/* Message Input Area */}
              <div className="border-t p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Button variant="ghost" size="sm" className="p-1">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder={fileUploadConstants.messageInputPlaceholder}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="sm" className="p-1" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Share to student button */}
        <div className="flex justify-end">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 my-4"
            onClick={handleShareToStudent}
          >
            {fileUploadConstants.shareButtonText}
          </Button>
        </div>

        {/* Files Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-2 md:p-4 font-medium text-gray-600">Files</th>
                    <th className="text-left p-2 md:p-4 font-medium text-gray-600">Comment</th>
                    <th className="text-left p-2 md:p-4 font-medium text-gray-600 hidden sm:table-cell">Uploaded by</th>
                    <th className="text-left p-2 md:p-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedFiles.map((file) => (
                    <tr
                      key={file.id}
                      className={`border-b hover:bg-gray-50 ${selectedFileForShare === file.id ? "bg-blue-50" : ""}`}
                      onClick={() => setSelectedFileForShare(file.id)}
                    >
                      <td className="p-2 md:p-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={selectedFileForShare === file.id}
                            onChange={() => setSelectedFileForShare(file.id === selectedFileForShare ? null : file.id)}
                          />
                          {getFileIcon(file.type, file.name)}
                          <div>
                            <div className="font-medium text-gray-900 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[200px]">
                              {file.name}
                            </div>
                            <div className="text-xs text-gray-500 hidden sm:block">{formatFileSize(file.size)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 md:p-4 text-gray-600 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[200px]">
                        {file.comment}
                      </td>
                      <td className="p-2 md:p-4 text-gray-600 text-xs sm:text-sm hidden sm:table-cell">
                        {file.uploadedBy}
                      </td>
                      <td className="p-2 md:p-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-800 p-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownload(file)
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-800 p-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEdit(file)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800 p-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(file.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Edit File Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit File</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fileName">File Name</Label>
                <Input
                  className="bg-white mt-2"
                  id="fileName"
                  value={editFileName}
                  onChange={(e) => setEditFileName(e.target.value)}
                  placeholder="Enter file name"
                />
              </div>
              <div>
                <Label htmlFor="comment">Comment</Label>
                <Input
                  className="bg-white mt-2"
                  id="comment"
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  placeholder="Enter comment"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-dark-blue" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Footer */}
        <div className="mt-4 text-center text-xs text-gray-500">© 2025, Made by BuyExchange.</div>
      </div>
    </div>
  )
}
