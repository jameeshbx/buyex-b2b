"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Download,
  Edit,
  Trash2,
  FileText,
  Archive,
  FileAudio,
  FileSpreadsheet,
  FileVideo,
  ImageIcon,
  File as FileIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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

type DocumentFromAPI = {
  id: string;
  name?: string;
  type: string;
  comment?: string;
  fileSize?: number;
  uploadedBy?: string;
  createdAt: string;
  imageUrl: string;
};

interface ListDocumentsProps {
  orderID: string;
}

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

export default function ListDocuments({ orderID }: ListDocumentsProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [editingFile, setEditingFile] = useState<UploadedFile | null>(null);
  const [editFileName, setEditFileName] = useState("");
  const [editComment, setEditComment] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await fetch(`/api/upload/document/${orderID}`);
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
          size: doc.fileSize || 0,
          comment: doc.comment || "",
          uploadedBy: doc.uploadedBy || "Unknown",
          uploadedAt: doc.createdAt,
          url: doc.imageUrl,
        }))
        .filter((file) => file.name && file.type);

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
  }, [orderID, toast]);

  useEffect(() => {
    if (orderID) {
      fetchDocuments();
    }
  }, [orderID, fetchDocuments]);

  const handleDownload = (file: UploadedFile) => {
    if (file.url) {
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.name;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.custom(
        <div className="bg-red-100 text-red-800 p-2 rounded">
          <strong>Error:</strong> Download URL not available
        </div>
      );
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
      const response = await fetch(
        `/api/upload/document/${orderID}/${editingFile.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editFileName,
            comment: editComment,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update document");
      }

      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.id === editingFile.id
            ? {
                ...file,
                name: editFileName,
                comment: editComment,
              }
            : file
        )
      );

      toast.custom(
        <div className="bg-green-100 text-green-800 p-2 rounded">
          <strong>Success:</strong> Document updated successfully
        </div>
      );

      setIsEditDialogOpen(false);
      setEditingFile(null);
      setEditFileName("");
      setEditComment("");
    } catch (error) {
      console.error("Error updating document:", error);
      toast.custom(
        <div className="bg-red-100 text-red-800 p-2 rounded">
          <strong>Error:</strong> Failed to update document
        </div>
      );
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/upload/document/${orderID}/${fileId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId));

      toast.custom(
        <div className="bg-green-100 text-green-800 p-2 rounded">
          <strong>Success:</strong> Document deleted successfully
        </div>
      );
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.custom(
        <div className="bg-red-100 text-red-800 p-2 rounded">
          <strong>Error:</strong> Failed to delete document
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (uploadedFiles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <>
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
                  <tr key={file.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 md:p-4">
                      <div className="flex items-center gap-3">
                        {/* File icon */}
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
    </>
  );
}
