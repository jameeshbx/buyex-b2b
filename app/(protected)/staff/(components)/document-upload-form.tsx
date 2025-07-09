"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { S3FileUploader } from "./s3-file-uploader";
import { Sender } from "@prisma/client";
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
  checklist: Record<string, File | null>;
};

export default function DocumentUploadForm({ orderID }: { orderID: string }) {
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

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        const order = await axios.get(`/api/orders/${orderId}`);
        setPurpose(order.data.purpose);
        setEducationLoan(order.data.educationLoan); // assuming this field exists

        if (order.data.senderId) {
          const sender = await axios.get(`/api/senders/${order.data.senderId}`);
          if (sender.data) {
            setSenderDetails(sender.data);
          }
        } else {
          router.push(`/staff/dashboard/sender-details?orderId=${orderId}`);
        }
      } else {
        router.push(`/staff/dashboard/sender-details`);
      }
    };
    fetchOrder();
  }, [orderId]);

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

  const handleReset = () => {
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
    toast.info("Form has been reset");
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    // Validate KYC documents
    const panError = validateFile(
      formState.kyc.pan,
      "Pancard",
      5,
      [".jpg", ".jpeg", ".png", ".pdf"]
    );
    if (panError) {
      errors["kyc.pan"] = panError;
      isValid = false;
    } else if (!formState.kyc.pan) {
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
    } else if (!formState.kyc.identity) {
      errors["kyc.identity"] = "Identity document is required";
      isValid = false;
    }

    // Validate checklist documents
    if (purpose && CHECKLIST_FIELDS[purpose]) {
      for (const item of CHECKLIST_FIELDS[purpose]) {
        const file = formState.checklist?.[item.type];
        if (!file) {
          errors[`checklist.${item.type}`] = `${item.label} is required`;
          isValid = false;
        }
      }
    }
    // Loan sanction letter if educationLoan is yes
    if (educationLoan === "yes") {
      const file = formState.checklist?.["LOAN_SANCTION_LETTER"];
      if (!file) {
        errors["checklist.LOAN_SANCTION_LETTER"] = "Loan Sanction Letter is required";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const filesArray = [];

      // Add KYC files
      if (formState.kyc.pan) {
        filesArray.push({
          role: "SENDER",
          type: "PAN",
          imageUrl: formState.kyc.panUrl,
          userId: senderDetails?.id,
          orderId,
          name: "Pancard",
          uploadedBy: "Staff",
          comment: "Sender Pancard",
        });
      }
      if (formState.kyc.identity) {
        filesArray.push({
          role: "SENDER",
          type: "IDENTITY",
          imageUrl: formState.kyc.identityUrl,
          userId: senderDetails?.id,
          orderId,
          name: "Identity Document",
          uploadedBy: "Staff",
          comment: "Sender Identity document",
        });
      }

      // Add checklist files
      if (purpose && CHECKLIST_FIELDS[purpose]) {
        for (const item of CHECKLIST_FIELDS[purpose]) {
          const file = formState.checklist?.[item.type];
          const fileUrl = formState.checklist?.[`${item.type}Url`];
          if (file) {
            filesArray.push({
              role: "SENDER",
              type: item.type,
              imageUrl: fileUrl,
              userId: senderDetails?.id,
              orderId,
              name: item.label,
              uploadedBy: "Staff",
              comment: `Sender ${item.label}`,
            });
          }
        }
      }
      // Loan sanction letter if educationLoan is yes
      if (educationLoan === "yes") {
        const file = formState.checklist?.["LOAN_SANCTION_LETTER"];
        const fileUrl = formState.checklist?.["LOAN_SANCTION_LETTERUrl"];
        if (file) {
          filesArray.push({
            role: "SENDER",
            type: "LOAN_SANCTION_LETTER",
            imageUrl: fileUrl,
            userId: senderDetails?.id,
            orderId,
            name: "Loan Sanction Letter",
            uploadedBy: "Staff",
            comment: "Loan Sanction Letter",
          });
        }
      }

      for (const file of filesArray) {
        const response = await fetch("/api/upload/document", {
          method: "POST",
          body: JSON.stringify(file),
        });

        if (!response.ok) {
          let errorDetails = "";
          try {
            const errorData = await response.json();
            errorDetails =
              errorData.details || errorData.message || "Unknown error";
          } catch {
            errorDetails = `Status: ${response.status} - ${response.statusText}`;
          }
          throw new Error(`Upload failed: ${errorDetails}`);
        }
      }
      router.push(`/staff/dashboard/order-preview?orderId=${orderId}`);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload documents. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
      {/* KYC Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold font-jakarta mb-4">KYC Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-jakarta text-sm mb-2">
              PanCard of Remitter*
            </label>
            <S3FileUploader
              onFileUpload={(file, s3Url, s3Key) =>
                handleFileUpload("kyc", "pan", file, s3Url, s3Key)
              }
              currentFile={formState.kyc.pan}
              currentS3Url={formState.kyc.panUrl}
              currentS3Key={formState.kyc.panS3Key}
              acceptedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
              maxSizeMB={5}
              fieldName="PanCard"
              folder="buyex-documents"
            />
            {formErrors["kyc.pan"] && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors["kyc.pan"]}
              </p>
            )}
          </div>
          <div>
            <label className="block font-jakarta text-sm mb-2">
              Aadhaar/Passport/Driving license of Remitter*
            </label>
            <S3FileUploader
              onFileUpload={(file, s3Url, s3Key) =>
                handleFileUpload("kyc", "identity", file, s3Url, s3Key)
              }
              currentFile={formState.kyc.identity}
              currentS3Url={formState.kyc.identityUrl}
              currentS3Key={formState.kyc.identityS3Key}
              acceptedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
              maxSizeMB={5}
              fieldName="Identity Document"
              folder="buyex-documents"
            />
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
            CHECKLIST_FIELDS[purpose]?.map((item) => (
              <div key={item.type}>
                <label className="block text-sm font-jakarta mb-2">
                  {item.label}*
                </label>
                <S3FileUploader
                  onFileUpload={(file, s3Url, s3Key) =>
                    handleFileUpload("checklist", item.type, file, s3Url, s3Key)
                  }
                  currentFile={formState.checklist?.[item.type] ?? null}
                  currentS3Url={
                    typeof formState.checklist?.[`${item.type}Url`] === "string"
                      ? (formState.checklist?.[`${item.type}Url`] as unknown as string)
                      : undefined
                  }
                  currentS3Key={
                    typeof formState.checklist?.[`${item.type}S3Key`] === "string"
                      ? (formState.checklist?.[`${item.type}S3Key`] as unknown as string)
                      : undefined
                  }
                  acceptedFileTypes={[".pdf", ".jpg", ".jpeg", ".png"]}
                  maxSizeMB={5}
                  fieldName={item.label}
                  folder="buyex-documents"
                />
                {formErrors[`checklist.${item.type}`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors[`checklist.${item.type}`]}
                  </p>
                )}
              </div>
            ))}
          {/* Add Loan Sanction Letter if educationLoan is yes */}
          {educationLoan === "yes" && (
            <div>
              <label className="block text-sm font-jakarta mb-2">
                Loan Sanction Letter*
              </label>
              <S3FileUploader
                onFileUpload={(file, s3Url, s3Key) =>
                  handleFileUpload("checklist", "LOAN_SANCTION_LETTER", file, s3Url, s3Key)
                }
                currentFile={formState.checklist?.LOAN_SANCTION_LETTER ?? null}
                currentS3Url={
                  typeof formState.checklist?.LOAN_SANCTION_LETTERUrl === "string"
                    ? formState.checklist?.LOAN_SANCTION_LETTERUrl
                    : undefined
                }
                currentS3Key={
                  typeof formState.checklist?.LOAN_SANCTION_LETTERS3Key === "string"
                    ? formState.checklist?.LOAN_SANCTION_LETTERS3Key
                    : undefined
                }
                acceptedFileTypes={[".pdf"]}
                maxSizeMB={5}
                fieldName="Loan Sanction Letter"
                folder="buyex-documents"
              />
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
              CONTINUE
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
