"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { S3FileUploader } from "./s3-file-uploader";
import { Sender } from "@prisma/client";
import axios from "axios";

type FormState = {
  senderDetails: {
    payerPAN: File | null;
    payerPANUrl?: string;
    payerPANS3Key?: string;
    aadhaar: File | null;
    aadhaarUrl?: string;
    aadhaarS3Key?: string;
    passport: File | null;
    passportUrl?: string;
    passportS3Key?: string;
  };
  studentDetails: {
    payerPAN: File | null;
    payerPANUrl?: string;
    payerPANS3Key?: string;
    aadhaar: File | null;
    aadhaarUrl?: string;
    aadhaarS3Key?: string;
    passport: File | null;
    passportUrl?: string;
    passportS3Key?: string;
  };
  universityDocuments: {
    feeReceipt: File | null;
    feeReceiptUrl?: string;
    feeReceiptS3Key?: string;
    loanSanctionLetter: File | null;
    loanSanctionLetterUrl?: string;
    loanSanctionLetterS3Key?: string;
    offerLetter: File | null;
    offerLetterUrl?: string;
    offerLetterS3Key?: string;
  };
};

export default function DocumentUploadForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({
    senderDetails: {
      payerPAN: null,
      aadhaar: null,
      passport: null,
    },
    studentDetails: {
      payerPAN: null,
      aadhaar: null,
      passport: null,
    },
    universityDocuments: {
      feeReceipt: null,
      loanSanctionLetter: null,
      offerLetter: null,
    },
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [payer, setPayer] = useState<string | null>(null);
  const [educationLoan, setEducationLoan] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const [senderDetails, setSenderDetails] = useState<Sender | null>(null);
  const [orderId] = useState<string | null>(
    searchParams.get("orderId") || null
  );

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        const order = await axios.get(`/api/orders/${orderId}`);

        if (order.data.senderId) {
          const sender = await axios.get(`/api/senders/${order.data.senderId}`);
          if (sender.data) {
            setSenderDetails(sender.data);
          }

          // router.push(
          //   `/staff/dashboard/beneficiary-details?orderId=${orderId}`
          // );
        } else {
          router.push(`/staff/dashboard/sender-details?orderId=${orderId}`);
        }
      } else {
        router.push(`/staff/dashboard/sender-details`);
      }
    };
    fetchOrder();
  }, [orderId]);
  // Get values from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPayer(localStorage.getItem("selectedPayer"));
      setEducationLoan(localStorage.getItem("educationLoan"));
    }
  }, []);

  const handleFileUpload = (
    section: keyof FormState,
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
    // Clear error when file is uploaded
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`${section}.${field}`];
      return newErrors;
    });
  };

  const handleReset = async () => {
    // Delete all uploaded files from S3 before resetting the form
    const s3KeysToDelete = [
      formState.senderDetails.payerPANS3Key,
      formState.senderDetails.aadhaarS3Key,
      formState.senderDetails.passportS3Key,
      formState.studentDetails.payerPANS3Key,
      formState.studentDetails.aadhaarS3Key,
      formState.studentDetails.passportS3Key,
      formState.universityDocuments.feeReceiptS3Key,
      formState.universityDocuments.loanSanctionLetterS3Key,
      formState.universityDocuments.offerLetterS3Key,
    ].filter(Boolean) as string[];

    // Delete files from S3 in parallel
    if (s3KeysToDelete.length > 0) {
      try {
        const deletePromises = s3KeysToDelete.map(async (key) => {
          const response = await fetch("/api/upload/s3/delete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ key }),
          });
          return response.ok;
        });

        const results = await Promise.allSettled(deletePromises);
        const successCount = results.filter(
          (result) => result.status === "fulfilled" && result.value
        ).length;

        if (successCount === s3KeysToDelete.length) {
          toast.success("All files deleted from S3 successfully");
        } else if (successCount > 0) {
          toast.warning(
            `${successCount}/${s3KeysToDelete.length} files deleted from S3`
          );
        } else {
          toast.error("Failed to delete files from S3");
        }
      } catch (error) {
        console.error("Error deleting files from S3:", error);
        toast.error("Failed to delete files from S3");
      }
    }

    setFormState({
      senderDetails: {
        payerPAN: null,
        aadhaar: null,
        passport: null,
      },
      studentDetails: {
        payerPAN: null,
        aadhaar: null,
        passport: null,
      },
      universityDocuments: {
        feeReceipt: null,
        loanSanctionLetter: null,
        offerLetter: null,
      },
    });
    setFormErrors({});
    toast.info("Form has been reset");
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    // Validate sender details
    const senderPanError = validateFile(
      formState.senderDetails.payerPAN,
      "Payer PAN",
      5,
      [".jpg", ".jpeg", ".png", ".pdf"]
    );
    if (senderPanError) {
      errors["senderDetails.payerPAN"] = senderPanError;
      isValid = false;
    } else if (!formState.senderDetails.payerPAN) {
      errors["senderDetails.payerPAN"] = "Payer PAN is required";
      isValid = false;
    }

    const senderAadhaarError = validateFile(
      formState.senderDetails.aadhaar,
      "Aadhaar",
      5,
      [".jpg", ".jpeg", ".png", ".pdf"]
    );
    if (senderAadhaarError) {
      errors["senderDetails.aadhaar"] = senderAadhaarError;
      isValid = false;
    } else if (!formState.senderDetails.aadhaar) {
      errors["senderDetails.aadhaar"] = "Aadhaar is required";
      isValid = false;
    }

    const senderPassportError = validateFile(
      formState.senderDetails.passport,
      "Passport",
      5,
      [".jpg", ".jpeg", ".png", ".pdf"]
    );
    if (senderPassportError) {
      errors["senderDetails.passport"] = senderPassportError;
      isValid = false;
    }

    // Required fields validation for student (only if payer is not self)
    if (payer !== "Self") {
      const studentPanError = validateFile(
        formState.studentDetails.payerPAN,
        "Student PAN",
        5,
        [".jpg", ".jpeg", ".png", ".pdf"]
      );
      if (studentPanError) {
        errors["studentDetails.payerPAN"] = studentPanError;
        isValid = false;
      } else if (!formState.studentDetails.payerPAN) {
        errors["studentDetails.payerPAN"] = "Student PAN is required";
        isValid = false;
      }

      const studentAadhaarError = validateFile(
        formState.studentDetails.aadhaar,
        "Student Aadhaar",
        5,
        [".jpg", ".jpeg", ".png", ".pdf"]
      );
      if (studentAadhaarError) {
        errors["studentDetails.aadhaar"] = studentAadhaarError;
        isValid = false;
      } else if (!formState.studentDetails.aadhaar) {
        errors["studentDetails.aadhaar"] = "Student Aadhaar is required";
        isValid = false;
      }

      const studentPassportError = validateFile(
        formState.studentDetails.passport,
        "Student Passport",
        5,
        [".jpg", ".jpeg", ".png", ".pdf"]
      );
      if (studentPassportError) {
        errors["studentDetails.passport"] = studentPassportError;
        isValid = false;
      }
    }

    // Validate university documents
    const feeReceiptError = validateFile(
      formState.universityDocuments.feeReceipt,
      "Fee Receipt",
      5,
      [".pdf"]
    );
    if (feeReceiptError) {
      errors["universityDocuments.feeReceipt"] = feeReceiptError;
      isValid = false;
    } else if (!formState.universityDocuments.feeReceipt) {
      errors["universityDocuments.feeReceipt"] = "Fee receipt is required";
      isValid = false;
    }

    if (educationLoan === "yes") {
      const loanLetterError = validateFile(
        formState.universityDocuments.loanSanctionLetter,
        "Loan Sanction Letter",
        5,
        [".pdf"]
      );
      if (loanLetterError) {
        errors["universityDocuments.loanSanctionLetter"] = loanLetterError;
        isValid = false;
      } else if (!formState.universityDocuments.loanSanctionLetter) {
        errors["universityDocuments.loanSanctionLetter"] =
          "Loan sanction letter is required when education loan is selected";
        isValid = false;
      }
    }

    const offerLetterError = validateFile(
      formState.universityDocuments.offerLetter,
      "Offer Letter",
      5,
      [".pdf"]
    );
    if (offerLetterError) {
      errors["universityDocuments.offerLetter"] = offerLetterError;
      isValid = false;
    } else if (!formState.universityDocuments.offerLetter) {
      errors["universityDocuments.offerLetter"] = "Offer letter is required";
      isValid = false;
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
      if (formState.senderDetails?.aadhaar) {
        filesArray.push({
          role: "SENDER",
          type: "AADHAR_FRONT",
          imageUrl: formState.senderDetails.aadhaarUrl,
          userId: senderDetails?.id,
        });
      }
      if (formState.senderDetails?.passport) {
        filesArray.push({
          role: "SENDER",
          type: "PASSPORT_FRONT",
          imageUrl: formState.senderDetails.passportUrl,
          userId: senderDetails?.id,
        });
      }
      if (formState.senderDetails?.payerPAN) {
        filesArray.push({
          role: "SENDER",
          type: "PAN",
          imageUrl: formState.senderDetails.payerPANUrl,
          userId: senderDetails?.id,
        });
      }

      if (payer !== "Self") {
        if (formState.studentDetails?.aadhaar) {
          filesArray.push({
            role: "STUDENT",
            type: "AADHAR_FRONT",
            imageUrl: formState.studentDetails.aadhaarUrl,
            userId: senderDetails?.id,
          });
        }
        if (formState.studentDetails?.passport) {
          filesArray.push({
            role: "STUDENT",
            type: "PASSPORT_FRONT",
            imageUrl: formState.studentDetails.passportUrl,
            userId: senderDetails?.id,
          });
        }
        if (formState.studentDetails?.payerPAN) {
          filesArray.push({
            role: "STUDENT",
            type: "PAN",
            imageUrl: formState.studentDetails.payerPANUrl,
            userId: senderDetails?.id,
          });
        }
      }

      if (formState.universityDocuments?.feeReceipt) {
        filesArray.push({
          role: "STUDENT",
          type: "UNIVERSITY_FEE_RECEIPT",
          imageUrl: formState.universityDocuments.feeReceiptUrl,
          userId: senderDetails?.id,
        });
      }
      if (formState.universityDocuments?.loanSanctionLetter) {
        filesArray.push({
          role: "STUDENT",
          type: "LOAN_SANCTION_LETTER",
          imageUrl: formState.universityDocuments.loanSanctionLetterUrl,
          userId: senderDetails?.id,
        });
      }
      if (formState.universityDocuments?.offerLetter) {
        filesArray.push({
          role: "STUDENT",
          type: "UNIVERSITY_OFFER_LETTER",
          imageUrl: formState.universityDocuments.offerLetterUrl,
          userId: senderDetails?.id,
        });
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
      router.push("/staff/dashboard/order-preview");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload documents. Please try again."
      );

      // Additional error logging if needed
      if (process.env.NODE_ENV === "development") {
        console.group("Detailed error info");
        console.error("Error object:", error);
        console.groupEnd();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
      {/* Sender Details Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold font-jakarta mb-4">
          Sender Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-jakarta text-sm mb-2">
              Payer&apos;s PAN*
            </label>
            <S3FileUploader
              onFileUpload={(file, s3Url, s3Key) =>
                handleFileUpload(
                  "senderDetails",
                  "payerPAN",
                  file,
                  s3Url,
                  s3Key
                )
              }
              currentFile={formState.senderDetails.payerPAN}
              currentS3Url={formState.senderDetails.payerPANUrl}
              currentS3Key={formState.senderDetails.payerPANS3Key}
              acceptedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
              maxSizeMB={5}
              fieldName="Payer PAN"
              folder="buyex-documents"
            />
            {formErrors["senderDetails.payerPAN"] && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors["senderDetails.payerPAN"]}
              </p>
            )}
          </div>
          <div>
            <label className="block font-jakarta text-sm mb-2">
              Aadhaar (front and back)*
            </label>
            <S3FileUploader
              onFileUpload={(file, s3Url, s3Key) =>
                handleFileUpload("senderDetails", "aadhaar", file, s3Url, s3Key)
              }
              currentFile={formState.senderDetails.aadhaar}
              currentS3Url={formState.senderDetails.aadhaarUrl}
              currentS3Key={formState.senderDetails.aadhaarS3Key}
              acceptedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
              maxSizeMB={5}
              fieldName="Aadhaar"
              folder="buyex-documents"
            />
            {formErrors["senderDetails.aadhaar"] && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors["senderDetails.aadhaar"]}
              </p>
            )}
          </div>
          <div>
            <label className="block font-jakarta text-sm mb-2">
              Passport (front and back)
            </label>
            <S3FileUploader
              onFileUpload={(file, s3Url, s3Key) =>
                handleFileUpload(
                  "senderDetails",
                  "passport",
                  file,
                  s3Url,
                  s3Key
                )
              }
              currentFile={formState.senderDetails.passport}
              currentS3Url={formState.senderDetails.passportUrl}
              currentS3Key={formState.senderDetails.passportS3Key}
              acceptedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
              maxSizeMB={5}
              fieldName="Passport"
              folder="buyex-documents"
            />
          </div>
        </div>
      </div>

      {/* Student Details Section */}
      {payer !== "Self" && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold font-jakarta mb-4">
            Student Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-jakarta mb-2">
                Student&apos;s PAN*
              </label>
              <S3FileUploader
                onFileUpload={(file, s3Url, s3Key) =>
                  handleFileUpload(
                    "studentDetails",
                    "payerPAN",
                    file,
                    s3Url,
                    s3Key
                  )
                }
                currentFile={formState.studentDetails.payerPAN}
                currentS3Url={formState.studentDetails.payerPANUrl}
                currentS3Key={formState.studentDetails.payerPANS3Key}
                acceptedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
                maxSizeMB={5}
                fieldName="Student PAN"
                folder="buyex-documents"
              />
              {formErrors["studentDetails.payerPAN"] && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors["studentDetails.payerPAN"]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-jakarta mb-2">
                Aadhaar (front and back)*
              </label>
              <S3FileUploader
                onFileUpload={(file, s3Url, s3Key) =>
                  handleFileUpload(
                    "studentDetails",
                    "aadhaar",
                    file,
                    s3Url,
                    s3Key
                  )
                }
                currentFile={formState.studentDetails.aadhaar}
                currentS3Url={formState.studentDetails.aadhaarUrl}
                currentS3Key={formState.studentDetails.aadhaarS3Key}
                acceptedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
                maxSizeMB={5}
                fieldName="Aadhaar"
                folder="buyex-documents"
              />
              {formErrors["studentDetails.aadhaar"] && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors["studentDetails.aadhaar"]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-jakarta mb-2">
                Passport (front and back)
              </label>
              <S3FileUploader
                onFileUpload={(file, s3Url, s3Key) =>
                  handleFileUpload(
                    "studentDetails",
                    "passport",
                    file,
                    s3Url,
                    s3Key
                  )
                }
                currentFile={formState.studentDetails.passport}
                currentS3Url={formState.studentDetails.passportUrl}
                currentS3Key={formState.studentDetails.passportS3Key}
                acceptedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
                maxSizeMB={5}
                fieldName="Passport"
                folder="buyex-documents"
              />
            </div>
          </div>
        </div>
      )}

      {/* University related documents Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold font-jakarta mb-4">
          University related documents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-jakarta mb-2">
              University fee receipt*
            </label>
            <S3FileUploader
              onFileUpload={(file, s3Url, s3Key) =>
                handleFileUpload(
                  "universityDocuments",
                  "feeReceipt",
                  file,
                  s3Url,
                  s3Key
                )
              }
              currentFile={formState.universityDocuments.feeReceipt}
              currentS3Url={formState.universityDocuments.feeReceiptUrl}
              currentS3Key={formState.universityDocuments.feeReceiptS3Key}
              acceptedFileTypes={[".pdf"]}
              maxSizeMB={5}
              fieldName="Fee receipt"
              folder="buyex-documents"
            />
            {formErrors["universityDocuments.feeReceipt"] && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors["universityDocuments.feeReceipt"]}
              </p>
            )}
          </div>

          {educationLoan === "yes" && (
            <div>
              <label className="block text-sm font-jakarta mb-2">
                Education loan sanction letter*
              </label>
              <S3FileUploader
                onFileUpload={(file, s3Url, s3Key) =>
                  handleFileUpload(
                    "universityDocuments",
                    "loanSanctionLetter",
                    file,
                    s3Url,
                    s3Key
                  )
                }
                currentFile={formState.universityDocuments.loanSanctionLetter}
                currentS3Url={
                  formState.universityDocuments.loanSanctionLetterUrl
                }
                currentS3Key={
                  formState.universityDocuments.loanSanctionLetterS3Key
                }
                acceptedFileTypes={[".pdf"]}
                maxSizeMB={5}
                fieldName="Loan sanction letter"
                folder="buyex-documents"
              />
              {formErrors["universityDocuments.loanSanctionLetter"] && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors["universityDocuments.loanSanctionLetter"]}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-jakarta mb-2">
              University offer letter*
            </label>
            <S3FileUploader
              onFileUpload={(file, s3Url, s3Key) =>
                handleFileUpload(
                  "universityDocuments",
                  "offerLetter",
                  file,
                  s3Url,
                  s3Key
                )
              }
              currentFile={formState.universityDocuments.offerLetter}
              currentS3Url={formState.universityDocuments.offerLetterUrl}
              currentS3Key={formState.universityDocuments.offerLetterS3Key}
              acceptedFileTypes={[".pdf"]}
              maxSizeMB={5}
              fieldName="Offer letter"
              folder="buyex-documents"
            />
            {formErrors["universityDocuments.offerLetter"] && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors["universityDocuments.offerLetter"]}
              </p>
            )}
          </div>
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
