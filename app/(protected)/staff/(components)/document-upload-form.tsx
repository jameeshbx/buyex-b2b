"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { S3FileUploader } from "./s3-file-uploader";
import type { Sender } from "@prisma/client";
import axios from "axios";

type FormState = {
  kyc: {
    pan: File | null;
    panUrl?: string;
    panS3Key?: string;
    identity: File | null;
    identityUrl?: string;
    identityS3Key?: string;
  };
  checklist: Record<string, File | null | string>; // Allow string values for URLs
};

// Type for existing documents from API
type ExistingDocument = {
  id: string;
  name?: string;
  type: string;
  imageUrl: string;
  fileSize?: number;
  uploadedBy?: string;
  createdAt: string;
  comment?: string;
};

export default function DocumentUploadForm({
  orderID,
  currentUser,
}: {
  orderID: string;
  currentUser: { role: string; id?: string } | null;
}) {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({
    kyc: {
      pan: null,
      panUrl: "",
      panS3Key: "",
      identity: null,
      identityUrl: "",
      identityS3Key: "",
    },
    checklist: {},
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [purpose, setPurpose] = useState<string | null>(null);
  const [educationLoan, setEducationLoan] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [senderDetails, setSenderDetails] = useState<Sender | null>(null);
  const [orderId] = useState<string | null>(orderID);
  const [currentUserState, setCurrentUserState] = useState(currentUser);
  const [existingDocuments, setExistingDocuments] = useState<
    ExistingDocument[]
  >([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [reuploading, setReuploading] = useState<{ section: "kyc" | "checklist"; field: string } | null>(null);

  useEffect(() => {
    if (currentUser === null) {
      // Only fetch if not provided
      const fetchCurrentUser = async () => {
        try {
          const response = await axios.get("/api/users/me", {
            withCredentials: true,
          });
          setCurrentUserState(response.data);
        
        } catch {
          setCurrentUserState(null);
        }
      };
      fetchCurrentUser();
    }
  }, [currentUser]);

  // Fetch existing documents for this order
  useEffect(() => {
    const fetchExistingDocuments = async () => {
      if (!orderId) return;

      setIsLoadingDocuments(true);
      try {
        const response = await fetch(`/api/upload/document/${orderId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }
        const documents = await response.json();
        setExistingDocuments(Array.isArray(documents) ? documents : []);
      } catch (error) {
        console.error("Error fetching existing documents:", error);
        // Don't show error toast for this as it's not critical
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    fetchExistingDocuments();
  }, [orderId]);

  // Map existing documents to form state
  useEffect(() => {
    if (existingDocuments.length === 0) return;

    const newFormState = { ...formState };

    existingDocuments.forEach((doc) => {
      // Map KYC documents
      if (doc.type === "PAN") {
        newFormState.kyc.panUrl = doc.imageUrl;
        newFormState.kyc.panS3Key = doc.id; // Using id as S3Key for existing files
      } else if (doc.type === "IDENTITY") {
        newFormState.kyc.identityUrl = doc.imageUrl;
        newFormState.kyc.identityS3Key = doc.id;
      } else {
        // Map checklist documents
        const checklistKey = doc.type;
        // Don't set the file field for existing documents, only the URL
        newFormState.checklist[`${checklistKey}Url`] = doc.imageUrl;
        newFormState.checklist[`${checklistKey}S3Key`] = doc.id;
      }
    });

    setFormState(newFormState);
  }, [existingDocuments]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        try {
          const order = await axios.get(`/api/orders/${orderId}`);
          setPurpose(order.data.purpose);
          setEducationLoan(order.data.educationLoan);
          // Check user type and handle sender details accordingly
          if (currentUserState?.role === "staff") {
            // Staff user - must have sender details to proceed
            if (order.data.senderId) {
              try {
                const sender = await axios.get(`
                  /api/senders/${order.data.senderId}`);
                if (sender.data) {
                  setSenderDetails(sender.data);
                } else {
                  // Sender ID exists but no sender data found
                  toast.error("Sender details not found");
                  router.push(`
                    /staff/dashboard/sender-details?orderId=${orderId}`);
                  return;
                }
              } catch {
                toast.error("Failed to fetch sender details");
                router.push(
                  `/staff/dashboard/sender-details?orderId=${orderId}`
                );
                return;
              }
            } else {
              // Staff user with no sender details - redirect to sender details
              toast.info("Please add sender details first");
              router.push(`/staff/dashboard/sender-details?orderId=${orderId}`);
              return;
            }
          } else {
            // Student, user, or not logged in - allow upload without sender details check
            if (order.data.senderId) {
              try {
                const sender = await axios.get(`
                  /api/senders/${order.data.senderId}`);
                if (sender.data) {
                  setSenderDetails(sender.data);
                }
              } catch {
                // Sender details not found, but that's okay for students/users/non-logged users
                console.log(
                  "Sender details not found, proceeding without them"
                );
              }
            }
            // For students/users/non-logged users, we don't require sender details
          }
        } catch (error) {
          console.error("Error fetching order:", error);
          toast.error("Failed to fetch order details");
        }
      } else {
        // No order ID provided
        if (currentUserState?.role === "staff") {
          // Staff users need an order ID
          toast.error("Order ID is required");
          router.push(`/staff/dashboard/sender-details`);
        }
        // Students/users/non-logged users might access this differently, so we don't redirect
      }
    };

    // Only fetch order after we have user info (or confirmed no user)
    if (currentUserState !== undefined) {
      fetchOrder();
    }
  }, [orderId, currentUserState, router]);

  const handleFileUpload = (
    section: "kyc" | "checklist",
    field: string,
    file: File | null,
    s3Url?: string,
    s3Key?: string
  ) => {
    setFormState((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: file,
        [`${field}Url`]: s3Url,
        [`${field}S3Key`]: s3Key,
      },
    }));
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`${section}.${field}`];
      return newErrors;
    });
  };

 const handleReset = (event?: React.MouseEvent<HTMLButtonElement> | boolean) => {
  // If we get a MouseEvent (from button click), show toast
  // If we get a boolean, use that to determine toast visibility
  // If we get nothing (undefined), default to showing toast
  const shouldShowToast = typeof event === 'boolean' ? event : true;
    setFormState({
      kyc: {
        pan: null,
        panUrl: "",
        panS3Key: "",
        identity: null,
        identityUrl: "",
        identityS3Key: "",
      },
      checklist: {},
    });
   
    setFormErrors({});
     if (shouldShowToast) {
    toast.info("Form has been reset");
  }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    // Validate KYC documents
    const panError = validateFile(formState.kyc.pan, "Pancard", 5, [
      ".jpg",
      ".jpeg",
      ".png",
      ".pdf",
    ]);
    if (panError) {
      errors["kyc.pan"] = panError;
      isValid = false;
    } else if (!formState.kyc.pan && !formState.kyc.panUrl) {
      errors["kyc.pan"] = "Pancard is required";
      isValid = false;
    }

    const identityError = validateFile(
      formState.kyc.identity,
      "Identity Document",
      5,
      [".jpg", ".jpeg", ".png", ".pdf"]
    );
    if (identityError) {
      errors["kyc.identity"] = identityError;
      isValid = false;
    } else if (!formState.kyc.identity && !formState.kyc.identityUrl) {
      errors["kyc.identity"] = "Identity document is required";
      isValid = false;
    }

    // Validate checklist documents
    if (purpose && CHECKLIST_FIELDS[purpose]) {
      for (const item of CHECKLIST_FIELDS[purpose]) {
        const file = formState.checklist?.[item.type];
        const fileUrl = formState.checklist?.[`${item.type}Url`];
        if (!file && !fileUrl) {
          errors[`checklist.${item.type}`] = `${item.label} is required`;
          isValid = false;
        }
      }
    }

    // Loan sanction letter if educationLoan is yes
    if (educationLoan === "yes") {
      const file = formState.checklist?.["LOAN_SANCTION_LETTER"];
      const fileUrl = formState.checklist?.["LOAN_SANCTION_LETTERUrl"];
      if (!file && !fileUrl) {
        errors["checklist.LOAN_SANCTION_LETTER"] =
          "Loan Sanction Letter is required";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // If MANAGER and documents already exist, just redirect
    if (currentUserState?.role === "MANAGER" && existingDocuments.length > 0) {
      toast.info("Documents already uploaded. Redirecting to order preview...");
      router.push(`/staff/dashboard/order-preview?orderId=${orderId}`);
      setIsSubmitting(false);
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const filesArray = [];

      // Determine the user ID to use
      let documentUserId = senderDetails?.id;
      if (!documentUserId) {
        // For students, users, or non-logged users, use appropriate fallback
        if (currentUserState?.id) {
          documentUserId = currentUserState.id;
        } else if (currentUserState?.role === "student") {
          documentUserId = "student-user";
        } else if (currentUserState?.role === "user") {
          documentUserId = "regular-user";
        } else {
          documentUserId = "anonymous-user";
        }
      }

      // Determine who uploaded the document
      const getUploadedBy = () => {
        if (!currentUserState) return "Anonymous";
        switch (currentUserState.role) {
          case "staff":
            return "Staff";
          case "student":
            return "Student";
          case "user":
            return "User";
          default:
            return "User";
        }
      };

      const uploadedBy = getUploadedBy();

      // Add KYC files
      if (formState.kyc.pan || formState.kyc.panUrl) {
        filesArray.push({
          role: "SENDER",
          type: "PAN",
          imageUrl: formState.kyc.panUrl,
          userId: documentUserId,
          orderId,
          name: "Pancard",
          uploadedBy,
          comment: "Sender Pancard",
          fileSize: formState.kyc.pan?.size || null,
        });
      }

      if (formState.kyc.identity || formState.kyc.identityUrl) {
        filesArray.push({
          role: "SENDER",
          type: "IDENTITY",
          imageUrl: formState.kyc.identityUrl,
          userId: documentUserId,
          orderId,
          name: "Identity Document",
          uploadedBy,
          comment: "Sender Identity document",
          fileSize: formState.kyc.identity?.size || null,
        });
      }

      // Add checklist files
      if (purpose && CHECKLIST_FIELDS[purpose]) {
        for (const item of CHECKLIST_FIELDS[purpose]) {
          const file = formState.checklist?.[item.type];
          const fileUrl = formState.checklist?.[`${item.type}Url`];
          if (file || fileUrl) {
            filesArray.push({
              role: "SENDER",
              type: item.type,
              imageUrl: fileUrl,
              userId: documentUserId,
              orderId,
              name: item.label,
              uploadedBy,
              comment: `Sender ${item.label}`,
              fileSize: file instanceof File ? file.size : null,
            });
          }
        }
      }

      // Loan sanction letter if educationLoan is yes
      if (educationLoan === "yes") {
        const file = formState.checklist?.["LOAN_SANCTION_LETTER"];
        const fileUrl = formState.checklist?.["LOAN_SANCTION_LETTERUrl"];
        if (file || fileUrl) {
          filesArray.push({
            role: "SENDER",
            type: "LOAN_SANCTION_LETTER",
            imageUrl: fileUrl,
            userId: documentUserId,
            orderId,
            name: "Loan Sanction Letter",
            uploadedBy,
            comment: "Loan Sanction Letter",
            fileSize: file instanceof File ? file.size : null,
          });
        }
      }

      // Upload all files to database
      let uploadedCount = 0;
      for (const file of filesArray) {
        try {
          const response = await fetch("/api/upload/document", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(file),
          });

          if (!response.ok) {
            let errorDetails = "";
            try {
              const errorData = await response.json();
              errorDetails =
                errorData.error ||
                errorData.message ||
                errorData.details ||
                "Unknown error";
              console.error("API Error Response:", errorData);
            } catch (parseError) {
              errorDetails = `HTTP ${response.status}: ${response.statusText}`;
              console.error("Failed to parse error response:", parseError);
            }
            throw new Error(`Upload failed for ${file.name}: ${errorDetails}`);
          }

          const result = await response.json();
          console.log("Document uploaded successfully:", result);
          uploadedCount++;
        } catch (fileError) {
          console.error(`Error uploading ${file.name}:, fileError`);
          throw fileError;
        }
      }

      // After successful uploads, update order status if not MANAGER
      if (currentUserState?.role !== "MANAGER") {
        try {
          await fetch(`/api/orders/${orderId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "DocumentsPlaced" }),
          });
        } catch (err) {
          console.error("Failed to update order status:", err);
          // Optionally show a toast or handle error
        }
      }

      // Success handling - Only MANAGER gets redirected, all others get popup only
      if (
        currentUserState?.role === "MANAGER" ||
        currentUserState?.role === "ADMIN"
      ) {
        // MANAGER: Show success message and redirect to order preview
        toast.success(`${uploadedCount} documents uploaded successfully!`);
        router.push(`/staff/dashboard/order-preview?orderId=${orderId}`);
      } else {
        // All other roles: Only show success popup, no redirect
        toast.success("Documents uploaded successfully!");
        // Reset the form for non-manager users to allow new uploads
        handleReset(false);
      }
    } catch (error) {
      console.error("Submission error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to upload documents. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while fetching documents
  if (isLoadingDocuments) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-blue"></div>
          <span className="ml-2 text-gray-600">
            Loading existing documents...
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
      {/* Existing Documents Summary */}
      {existingDocuments.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            Existing Documents ({existingDocuments.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {existingDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center space-x-2 p-2 bg-white rounded border"
              >
                <div className="flex-shrink-0">
                  {doc.imageUrl.match(/\.(pdf)$/i) ? (
                    <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                      <span className="text-red-600 text-xs font-bold">
                        PDF
                      </span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-blue-600 text-xs font-bold">
                        IMG
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.name || doc.type}
                  </p>
                  <p className="text-xs text-gray-500">
                    {doc.uploadedBy} •{" "}
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={doc.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-xs"
                >
                  View
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KYC Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold font-jakarta mb-4">
          KYC Documents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PAN */}
          <div>
            <label className="block font-jakarta text-sm mb-2">
              PanCard of Remitter*
            </label>
            {formState.kyc.panUrl && !(reuploading?.section === "kyc" && reuploading?.field === "pan") ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded flex items-center justify-between">
                <div>
                  <p className="text-green-800 text-sm">✓ Pancard uploaded</p>
                  <a
                    href={formState.kyc.panUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    View document
                  </a>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="ml-2"
                  onClick={() => setReuploading({ section: "kyc", field: "pan" })}
                >
                  Re-upload
                </Button>
              </div>
            ) : (
              <S3FileUploader
                onFileUpload={(file, s3Url, s3Key) => {
                  handleFileUpload("kyc", "pan", file, s3Url, s3Key);
                  setReuploading(null);
                }}
                currentFile={formState.kyc.pan}
                currentS3Url={formState.kyc.panUrl}
                currentS3Key={formState.kyc.panS3Key}
                acceptedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
                maxSizeMB={5}
                fieldName="PanCard"
                folder="buyex-documents"
              />
            )}
            {formErrors["kyc.pan"] && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors["kyc.pan"]}
              </p>
            )}
          </div>
          {/* Identity */}
          <div>
            <label className="block font-jakarta text-sm mb-2">
              Aadhaar/Passport/Driving license of Remitter*
            </label>
            {formState.kyc.identityUrl && !(reuploading?.section === "kyc" && reuploading?.field === "identity") ? (
              <div className="p-3 bg-green-50 border border-green-200 rounded flex items-center justify-between">
                <div>
                  <p className="text-green-800 text-sm">
                    ✓ Identity document uploaded
                  </p>
                  <a
                    href={formState.kyc.identityUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-xs"
                  >
                    View document
                  </a>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="ml-2"
                  onClick={() => setReuploading({ section: "kyc", field: "identity" })}
                >
                  Re-upload
                </Button>
              </div>
            ) : (
              <S3FileUploader
                onFileUpload={(file, s3Url, s3Key) => {
                  handleFileUpload("kyc", "identity", file, s3Url, s3Key);
                  setReuploading(null);
                }}
                currentFile={formState.kyc.identity}
                currentS3Url={formState.kyc.identityUrl}
                currentS3Key={formState.kyc.identityS3Key}
                acceptedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
                maxSizeMB={5}
                fieldName="Identity Document"
                folder="buyex-documents"
              />
            )}
            {formErrors["kyc.identity"] && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors["kyc.identity"]}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Checklist Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold font-jakarta mb-4">Checklist</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {purpose &&
            CHECKLIST_FIELDS[purpose]?.map((item) => {
              const fileUrl = formState.checklist?.[`${item.type}Url`] as string;
              const isReuploading = reuploading?.section === "checklist" && reuploading?.field === item.type;
              return (
                <div key={item.type}>
                  <label className="block text-sm font-jakarta mb-2">
                    {item.label}*
                  </label>
                  {fileUrl && !isReuploading ? (
                    <div className="p-3 bg-green-50 border border-green-200 rounded flex items-center justify-between">
                      <div>
                        <p className="text-green-800 text-sm">
                          ✓ {item.label} uploaded
                        </p>
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          View document
                        </a>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="ml-2"
                        onClick={() => setReuploading({ section: "checklist", field: item.type })}
                      >
                        Re-upload
                      </Button>
                    </div>
                  ) : (
                    <S3FileUploader
                      onFileUpload={(file, s3Url, s3Key) => {
                        handleFileUpload("checklist", item.type, file, s3Url, s3Key);
                        setReuploading(null);
                      }}
                      currentFile={
                        formState.checklist?.[item.type] instanceof File
                          ? (formState.checklist?.[item.type] as File)
                          : null
                      }
                      currentS3Url={
                        typeof formState.checklist?.[`${item.type}Url`] ===
                        "string"
                          ? (formState.checklist?.[`${item.type}Url`] as string)
                          : undefined
                      }
                      currentS3Key={
                        typeof formState.checklist?.[`${item.type}S3Key`] ===
                        "string"
                          ? (formState.checklist?.[
                              ` ${item.type}S3Key`
                            ] as string)
                          : undefined
                      }
                      acceptedFileTypes={[".pdf", ".jpg", ".jpeg", ".png"]}
                      maxSizeMB={5}
                      fieldName={item.label}
                      folder="buyex-documents"
                    />
                  )}
                  {formErrors[`checklist.${item.type}`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors[`checklist.${item.type}`]}
                    </p>
                  )}
                </div>
              );
            })}
          {/* Loan Sanction Letter */}
          {educationLoan === "yes" && (
            <div>
              <label className="block text-sm font-jakarta mb-2">
                Loan Sanction Letter*
              </label>
              {formState.checklist?.LOAN_SANCTION_LETTERUrl && !(reuploading?.section === "checklist" && reuploading?.field === "LOAN_SANCTION_LETTER") ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded flex items-center justify-between">
                  <div>
                    <p className="text-green-800 text-sm">
                      ✓ Loan Sanction Letter uploaded
                    </p>
                    <a
                      href={formState.checklist.LOAN_SANCTION_LETTERUrl as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-xs"
                    >
                      View document
                    </a>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="ml-2"
                    onClick={() => setReuploading({ section: "checklist", field: "LOAN_SANCTION_LETTER" })}
                  >
                    Re-upload
                  </Button>
                </div>
              ) : (
                <S3FileUploader
                  onFileUpload={(file, s3Url, s3Key) => {
                    handleFileUpload("checklist", "LOAN_SANCTION_LETTER", file, s3Url, s3Key);
                    setReuploading(null);
                  }}
                  currentFile={
                    formState.checklist?.LOAN_SANCTION_LETTER instanceof File
                      ? (formState.checklist?.LOAN_SANCTION_LETTER as File)
                      : null
                  }
                  currentS3Url={
                    typeof formState.checklist?.LOAN_SANCTION_LETTERUrl ===
                    "string"
                      ? formState.checklist?.LOAN_SANCTION_LETTERUrl
                      : undefined
                  }
                  currentS3Key={
                    typeof formState.checklist?.LOAN_SANCTION_LETTERS3Key ===
                    "string"
                      ? formState.checklist?.LOAN_SANCTION_LETTERS3Key
                      : undefined
                  }
                  acceptedFileTypes={[".pdf"]}
                  maxSizeMB={5}
                  fieldName="Loan Sanction Letter"
                  folder="buyex-documents"
                />
              )}
              {formErrors["checklist.LOAN_SANCTION_LETTER"] && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors["checklist.LOAN_SANCTION_LETTER"]}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
<div className="flex justify-center gap-4 mt-8">
  <Button
    type="submit"
    className="bg-dark-blue hover:bg-dark-blue text-white px-4 sm:px-8 font-jakarta h-12 sm:h-15 w-full sm:w-55 rounded-md"
    disabled={isSubmitting}
  >
    {isSubmitting ? (
      "Processing..."
    ) : (
      <>
        <Image
          src="/continue.svg"
          alt=""
          width={15}
          height={15}
          className="mr-2"
        />{" "}
        {/* Show "CONTINUE" for staff/admin/manager, "SUBMIT" for agent/user */}
        {currentUserState?.role === "staff" || 
         currentUserState?.role === "ADMIN" || 
         currentUserState?.role === "MANAGER" ? "CONTINUE" : "SUBMIT"}
      </>
    )}
  </Button>
  <Button
    type="button"
    variant="outline"
    className="bg-white hover:bg-white text-dark-gray font-jakarta border-gray-300 h-12 sm:h-15 w-full sm:w-55 rounded-md"
    onClick={handleReset}
    disabled={isSubmitting}
  >
    <Image
      src="/reset.svg"
      alt=""
      width={15}
      height={15}
      className="mr-2"
    />{" "}
    RESET
  </Button>
</div>
    </form>
  );
}

function validateFile(
  file: File | null,
  fieldName: string,
  maxSizeMB: number,
  acceptedFileTypes: string[]
): string | undefined {
  if (!file) return undefined;

  const fileExtension = file.name
    .substring(file.name.lastIndexOf("."))
    .toLowerCase();
  if (!acceptedFileTypes.includes(fileExtension)) {
    return `${fieldName} must be one of the following types: ${acceptedFileTypes.join(
      ", "
    )}`;
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `${fieldName} must be less than ${maxSizeMB} MB`;
  }

  return undefined;
}

const CHECKLIST_FIELDS: Record<string, { label: string; type: string }[]> = {
  "University fee transfer": [
    { label: "Offer Letter", type: "UNIVERSITY_OFFER_LETTER" },
    { label: "Student Passport", type: "PASSPORT_FRONT" },
  ],
  "Convera registered payment": [
    { label: "Offer Letter", type: "UNIVERSITY_OFFER_LETTER" },
    { label: "Student Passport", type: "PASSPORT_FRONT" },
  ],
  "Student Living expenses transfer": [
    { label: "Offer Letter", type: "UNIVERSITY_OFFER_LETTER" },
    { label: "Student Passport", type: "PASSPORT_FRONT" },
    { label: "Visa/PRP", type: "VISA_PRP" },
  ],
  "Student Visa fee payment": [
    { label: "Offer Letter", type: "UNIVERSITY_OFFER_LETTER" },
    { label: "Student Passport", type: "PASSPORT_FRONT" },
    { label: "Visa Invoice", type: "VISA_INVOICE" },
  ],
  "Flywire registered payment": [
    { label: "Offer Letter", type: "UNIVERSITY_OFFER_LETTER" },
    { label: "Student Passport", type: "PASSPORT_FRONT" },
    { label: "Flywire Instruction", type: "FLYWIRE_INSTRUCTION" },
  ],
  "Blocked account transfer": [
    { label: "Offer Letter", type: "UNIVERSITY_OFFER_LETTER" },
    { label: "Student Passport", type: "PASSPORT_FRONT" },
    { label: "Blocked Account Letter", type: "BLOCKED_ACCOUNT_LETTER" },
  ],
  "Application fee": [
    { label: "Offer Letter", type: "UNIVERSITY_OFFER_LETTER" },
    { label: "Student Passport", type: "PASSPORT_FRONT" },
    { label: "Invoice", type: "INVOICE" },
  ],
  "Accomodation fee": [
    { label: "Offer Letter", type: "UNIVERSITY_OFFER_LETTER" },
    { label: "Student Passport", type: "PASSPORT_FRONT" },
    { label: "Invoice", type: "INVOICE" },
  ],
  "GIC Canada fee deposite": [
    { label: "Offer Letter", type: "UNIVERSITY_OFFER_LETTER" },
    { label: "Student Passport", type: "PASSPORT_FRONT" },
    { label: "GIC Letter", type: "GIC_LETTER" },
  ],
};
