"use client";

import React, { useState, useRef, useEffect, useCallback, use } from "react";
import Image from "next/image";
import {
  Upload,
  Download,
  Edit,
  Trash2,
  Paperclip,
  Send,
  X,
  FileText,
  Archive,
  FileAudio,
  FileSpreadsheet,
  FileVideo,
  ImageIcon,
  File as FileIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { fileUploadSchema } from "@/schema/uploadfiles";
import { Topbar } from "../../../(components)/Topbar";
import { pagesData } from "@/data/navigation";

type UploadedFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  comment: string;
  uploadedBy: string;
  uploadedAt: string;
  file?: File;
  url?: string;
};

type SelectedFile = {
  file: File;
  preview?: string;
};

type Message = {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  isAgent: boolean;
};

const fileUploadConstants = {
  dragDropText: {
    browse: "Click to browse or",
    dragDrop: "drag & drop your files here",
    allowedTypes: "Supports: PDF, JPG, PNG, DOCX up to 10MB",
  },
  commentInputPlaceholder: "Add a comment...",
  uploadButtonText: "Upload Files",
  messageInputPlaceholder: "Type a message...",
  shareButtonText: "Share with Student",
  currentUser: "Agent Member",
};

const getFileIcon = (fileType: string, fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  // PDF files - red color
  if (fileType === "application/pdf" || extension === "pdf") {
    return <FileText className="h-4 w-4 text-red-500" />;
  }

  // Excel files - blue color
  if (
    fileType.includes("spreadsheet") ||
    ["xlsx", "xls", "csv"].includes(extension || "")
  ) {
    return <FileSpreadsheet className="h-4 w-4 text-blue-500" />;
  }

  // Image files - orange color
  if (
    fileType.startsWith("image/") ||
    ["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(extension || "")
  ) {
    return <ImageIcon className="h-4 w-4 text-orange-500" />;
  }

  // Video files - purple color
  if (
    fileType.startsWith("video/") ||
    ["mp4", "avi", "mov", "wmv", "flv"].includes(extension || "")
  ) {
    return <FileVideo className="h-4 w-4 text-purple-500" />;
  }

  // Audio files - green color
  if (
    fileType.startsWith("audio/") ||
    ["mp3", "wav", "flac", "aac"].includes(extension || "")
  ) {
    return <FileAudio className="h-4 w-4 text-green-500" />;
  }

  // Archive files - yellow color
  if (["zip", "rar", "7z", "tar", "gz"].includes(extension || "")) {
    return <Archive className="h-4 w-4 text-yellow-500" />;
  }
  // Default file icon - gray color
  return <FileIcon className="h-4 w-4 text-gray-500" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

type DocumentFromAPI = {
  id: string;
  name?: string;
  type: string;
  fileSize?: number; // Add this field
  comment?: string;
  uploadedBy?: string;
  createdAt: string;
  imageUrl: string;
};

export default function UploadsPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedFileForShare, setSelectedFileForShare] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [comment, setComment] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [editingFile, setEditingFile] = useState<UploadedFile | null>(null);
  const [editFileName, setEditFileName] = useState("");
  const [editComment, setEditComment] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await fetch(`/api/upload/document/${orderId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }
      const documents = await response.json();
      const docsArray: DocumentFromAPI[] = Array.isArray(documents)
        ? documents
        : [];
      const initialFiles = docsArray
        .map((doc) => ({
          id: doc.id,
          name: doc.name || doc.type.split("/").pop() || doc.type,
          type: doc.type,
          size: doc.fileSize || 0, // Use the actual file size from database
          comment: doc.comment || "",
          uploadedBy: doc.uploadedBy || "-",
          uploadedAt: new Date(doc.createdAt).toLocaleString(),
          url: doc.imageUrl,
          file: undefined,
        }))
        .sort(
          (a, b) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );

      setUploadedFiles(initialFiles);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.custom(
        <div className="bg-red-100 text-red-800 p-2 rounded">
          <strong>Error:</strong> Failed to load documents for this order
        </div>
      );
    } finally {
      setIsLoading(false);
    }
  }, [orderId, toast]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleFileSelection = useCallback(
    (fileList: FileList) => {
      const newFiles: SelectedFile[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];

        try {
          fileUploadSchema.pick({ files: true }).parse({ files: [file] });

          let preview = undefined;
          if (file.type.startsWith("image/")) {
            preview = URL.createObjectURL(file);
          }

          newFiles.push({ file, preview });
        } catch (error) {
          if (error instanceof z.ZodError) {
            toast.custom(
              <div className="bg-red-100 text-red-800 p-2 rounded">
                <strong>Error:</strong> {error.errors[0].message}
              </div>
            );
          }
        }
      }

      setSelectedFiles((prev) => [...prev, ...newFiles]);
    },
    [toast]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelection(e.dataTransfer.files);
      }
    },
    [handleFileSelection]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFileSelection(e.target.files);
      }
    },
    [handleFileSelection]
  );

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = async () => {
    setValidationErrors([]);
    setIsUploading(true);

    try {
      const uploadPromises = selectedFiles.map(async (selectedFile) => {
        // Step 1: Get presigned URL from S3 API
        const presignedResponse = await fetch("/api/upload/s3", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: selectedFile.file.name,
            fileType: selectedFile.file.type,
            folder: `orders/${orderId}/documents`,
          }),
        });

        if (!presignedResponse.ok) {
          throw new Error("Failed to get upload URL");
        }

        const { presignedUrl, cloudFrontUrl } = await presignedResponse.json();

        // Step 2: Upload file directly to S3 using presigned URL
        const uploadResponse = await fetch(presignedUrl, {
          method: "PUT",
          body: selectedFile.file,
          headers: {
            "Content-Type": selectedFile.file.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload file to S3");
        }

        // Step 3: Save document record with CloudFront URL
        // Fetch userId from /api/users/me
        let userId = "";
        try {
          const userRes = await fetch("/api/users/me");
          if (userRes.ok) {
            const user = await userRes.json();
            userId = user.id || "";
          }
        } catch {
          // fallback: leave userId as empty string
        }

        const documentResponse = await fetch("/api/upload/document", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: "ORDER",
            userId,
            type: "OTHER",
            imageUrl: cloudFrontUrl, // Save CloudFront URL instead of file data
            orderId: orderId,
            name: selectedFile.file.name,
            uploadedBy: "Admin",
            comment: comment.trim(),
            fileSize: selectedFile.file.size, // Add this line
          }),
        });

        if (!documentResponse.ok) {
          throw new Error("Failed to create document record");
        }

        const document = await documentResponse.json();

        return {
          id: document.id,
          name: selectedFile.file.name,
          type: selectedFile.file.type,
          size: selectedFile.file.size,
          comment: comment.trim(),
          uploadedBy: "Agent",
          uploadedAt: new Date().toLocaleString(),
          file: selectedFile.file,
          url: cloudFrontUrl, // Use CloudFront URL
        };
      });

      const newUploadedFiles = await Promise.all(uploadPromises);
      setUploadedFiles((prev) => [...newUploadedFiles, ...prev]);

      selectedFiles.forEach((sf) => {
        if (sf.preview) URL.revokeObjectURL(sf.preview);
      });
      setSelectedFiles([]);
      setComment("");

      toast.custom(
        <div className="bg-green-100 text-green-800 p-2 rounded">
          Files uploaded successfully!
        </div>
      );

      // Refresh the list after upload
      await fetchDocuments();
    } catch (error) {
      console.error("Error uploading files:", error);
      if (error instanceof z.ZodError) {
        setValidationErrors(error.errors.map((err) => err.message));
      } else {
        toast.custom(
          <div className="bg-red-100 text-red-800 p-2 rounded">
            Failed to upload files:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </div>
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (file: UploadedFile) => {
    if (file.file) {
      const url = URL.createObjectURL(file.file);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (file.url) {
      const a = document.createElement("a");
      a.href = file.url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      toast.custom(<div>Download started: Downloading {file.name}</div>);
    }
  };

  const handleEdit = (file: UploadedFile) => {
    setEditingFile(file);
    setEditFileName(file.name);
    setEditComment(file.comment);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingFile) return;

    try {
      const response = await fetch("/api/upload/document", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingFile.id,
          name: editFileName.trim(),
          comment: editComment.trim(),
          uploadedBy: "Agent", 
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update document");
      }
      const updatedDoc = await response.json();

      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.id === editingFile.id
            ? {
                ...file,
                name: updatedDoc.name,
                comment: updatedDoc.comment,
                uploadedBy: updatedDoc.uploadedBy,
              }
            : file
        )
      );

      setIsEditDialogOpen(false);
      setEditingFile(null);

      toast.custom(
        <div className="bg-green-100 text-green-800 p-2 rounded">
          File updated successfully: {editFileName} has been updated
        </div>
      );
    } catch {
      toast.custom(
        <div className="bg-red-100 text-red-800 p-2 rounded">
          Failed to update file
        </div>
      );
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      const response = await fetch(`/api/upload/document?id=${fileId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete document");
      }
      setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));
      toast.custom(
        <div className="bg-green-100 text-green-800 p-2 rounded">
          File deleted successfully
        </div>
      );
    } catch {
      toast.custom(
        <div className="bg-red-100 text-red-800 p-2 rounded">
          Failed to delete file
        </div>
      );
    }
  };

  const handleShareToStudent = () => {
    if (selectedFileForShare) {
      setIsShareDialogOpen(true);
    } else {
      toast.custom(
        <div className="bg-red-100 text-red-800 p-2 rounded">
          Please select a file to share with the student
        </div>
      );
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: "Current User",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isAgent: true,
      };
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    }
  };

  const handleSendShareEmail = async () => {
    if (!selectedFileForShare || !studentEmail.trim()) {
      toast.custom(
        <div className="bg-red-100 text-red-800 p-2 rounded">
          Please select a file and enter student email
        </div>
      );
      return;
    }

    setIsSharing(true);

    try {
      // 1. Find the selected file object
      const fileToSend = uploadedFiles.find(
        (f) => f.id === selectedFileForShare
      );
      if (!fileToSend || !fileToSend.url) {
        toast.custom(
          <div className="bg-red-100 text-red-800 p-2 rounded">
            File not found or missing URL
          </div>
        );
        setIsSharing(false);
        return;
      }

      // 2. Fetch the file as a Blob
      const fileResponse = await fetch(fileToSend.url);
      const fileBlob = await fileResponse.blob();

      // 3. Build FormData
      const formData = new FormData();
      formData.append("studentEmail", studentEmail.trim());
      formData.append("studentName", studentName.trim());
      formData.append("fileName", fileToSend.name);
      formData.append("fileComment", fileToSend.comment || "");
      formData.append("uploadedBy", fileToSend.uploadedBy || "Agent");
      formData.append(
        "uploadedAt",
        fileToSend.uploadedAt || new Date().toLocaleString()
      );
      formData.append(
        "file",
        new File([fileBlob], fileToSend.name, { type: fileBlob.type })
      );

      // 4. Send to your API
      const response = await fetch("/api/email/share-file", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      toast.custom(
        <div className="bg-green-100 text-green-800 p-2 rounded">
          File shared with student successfully
        </div>
      );
      setIsShareDialogOpen(false);
      setStudentEmail("");
      setStudentName("");
      setSelectedFileForShare(null);
    } catch (error) {
      console.error("Sharing failed:", error);
      toast.custom(
        <div className="bg-red-100 text-red-800 p-2 rounded">
          Failed to send email:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      );
    } finally {
      setIsSharing(false);
    }
  };

  const fetchSenderDetails = useCallback(async () => {
    try {
      // Fetch the order to get senderId
      const orderRes = await fetch(`/api/orders/${orderId}`);
      if (!orderRes.ok) return;
      const order = await orderRes.json();
      if (!order.senderId) return;

      // Fetch the sender details
      const senderRes = await fetch(`/api/senders/${order.senderId}`);
      if (!senderRes.ok) return;
      const sender = await senderRes.json();

      setStudentName(sender.studentName || "");
      setStudentEmail(sender.studentEmailOriginal || "");
    } catch {
      // Optionally handle error
    }
  }, [orderId]);

  useEffect(() => {
    fetchSenderDetails();
  }, [fetchSenderDetails]);

  useEffect(() => {
    if (isShareDialogOpen) {
      fetchSenderDetails();
    }
  }, [isShareDialogOpen, fetchSenderDetails]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
        <div className="sticky top-0 z-40">
          <Topbar pageData={pagesData.fileUpload} />
        </div>
        <div className="max-w-7xl mx-auto flex justify-center items-center h-[calc(100vh-100px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      <div className="sticky top-0 z-40">
        <Topbar pageData={pagesData.fileUpload} />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          <Card className="h-[500px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Order Documents</CardTitle>
                <Badge className="bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4 md:p-6">
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center flex-1 flex flex-col justify-center transition-colors mb-4 cursor-pointer ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-gray-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFiles.length === 0 ? (
                  <div className="text-gray-500">
                    <p className="text-sm">
                      {fileUploadConstants.dragDropText.browse}
                    </p>
                    <p className="text-sm">
                      {fileUploadConstants.dragDropText.dragDrop}
                    </p>
                    <p className="text-xs mt-2">
                      {fileUploadConstants.dragDropText.allowedTypes}
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="w-full h-full">
                    <div className="space-y-2">
                      {selectedFiles.map((selectedFile, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-white p-2 rounded border"
                        >
                          <div className="flex items-center gap-2">
                            {selectedFile.preview ? (
                              <Image
                                src={selectedFile.preview}
                                alt={selectedFile.file.name}
                                width={32}
                                height={32}
                                className="w-8 h-8 object-cover rounded"
                              />
                            ) : (
                              getFileIcon(
                                selectedFile.file.type,
                                selectedFile.file.name
                              )
                            )}
                            <div className="text-left">
                              <p className="text-xs font-medium truncate max-w-[150px]">
                                {selectedFile.file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(selectedFile.file.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSelectedFile(index);
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

              {validationErrors.length > 0 && (
                <div className="mb-2">
                  {validationErrors.map((error, index) => (
                    <p key={index} className="text-red-500 text-xs">
                      {error}
                    </p>
                  ))}
                </div>
              )}

              <div className="mb-4">
                <Input
                  placeholder={fileUploadConstants.commentInputPlaceholder}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full"
                />
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInput}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
              />
              <Button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || isUploading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              >
                {isUploading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {fileUploadConstants.uploadButtonText}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="h-[500px] flex flex-col">
            <CardContent className="flex-1 flex flex-col p-0">
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.isAgent ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] ${
                            message.isAgent ? "order-2" : "order-1"
                          }`}
                        >
                          <div
                            className={`rounded-lg p-3 ${
                              message.isAgent
                                ? "bg-gray-100 text-gray-900"
                                : "bg-blue-500 text-white"
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
                            <span className="text-xs text-gray-500">
                              {message.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </div>

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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1"
                    onClick={handleSendMessage}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 my-4"
            onClick={handleShareToStudent}
            disabled={!selectedFileForShare}
          >
            {fileUploadConstants.shareButtonText}
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-2 md:p-4 font-medium text-gray-600">
                      Files
                    </th>
                    <th className="text-left p-2 md:p-4 font-medium text-gray-600">
                      Comment
                    </th>
                    <th className="text-left p-2 md:p-4 font-medium text-gray-600 hidden sm:table-cell">
                      Uploaded by
                    </th>
                    <th className="text-left p-2 md:p-4 font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedFiles.map((file) => (
                    <tr
                      key={file.id}
                      className={`border-b hover:bg-gray-50 ${
                        selectedFileForShare === file.id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => setSelectedFileForShare(file.id)}
                    >
                      <td className="p-2 md:p-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="rounded"
                            checked={selectedFileForShare === file.id}
                            onChange={() =>
                              setSelectedFileForShare(
                                file.id === selectedFileForShare
                                  ? null
                                  : file.id
                              )
                            }
                          />
                          {/* File icon right after checkbox */}
                          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded">
                            {getFileIcon(file.type, file.name)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[200px]">
                              {file.name}
                            </div>
                            <div className="text-xs text-gray-500 hidden sm:block">
                              {formatFileSize(file.size)}
                            </div>
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
                              e.stopPropagation();
                              handleDownload(file);
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-800 p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(file);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800 p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(file.id);
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
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button className="bg-blue-600" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share File with Student</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedFileForShare && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">
                    Selected File:
                  </p>
                  <p className="text-sm text-gray-600">
                    {
                      uploadedFiles.find((f) => f.id === selectedFileForShare)
                        ?.name
                    }
                  </p>
                </div>
              )}
              <div>
                <Label htmlFor="studentName">Student Name (Optional)</Label>
                <Input
                  className="bg-white mt-2"
                  id="studentName"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter student name"
                />
              </div>
              <div>
                <Label htmlFor="studentEmail">Student Email *</Label>
                <Input
                  className="bg-white mt-2"
                  id="studentEmail"
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="Enter student email address"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsShareDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSendShareEmail}
                disabled={!studentEmail.trim() || isSharing}
              >
                {isSharing ? "Sending..." : "Send Email"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="mt-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()}, Made by BuyEx Forex.
        </div>
      </div>
    </div>
  );
}
