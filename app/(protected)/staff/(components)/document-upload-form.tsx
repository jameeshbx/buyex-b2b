"use client"

import type React from "react"
import { useState } from "react"
import { FileUploader } from "./file-uploader"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { toast } from "sonner"

type FormState = {
  senderDetails: {
    payerPAN: File | null
    aadhaar: File | null
    passport: File | null
  }
  studentDetails: {
    payerPAN: File | null
    aadhaar: File | null
    passport: File | null
  }
  universityDocuments: {
    feeReceipt: File | null
    loanSanctionLetter: File | null
    offerLetter: File | null
  }
}

export default function DocumentUploadForm() {
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
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const handleFileUpload = (section: keyof FormState, field: string, file: File | null) => {
    setFormState((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: file,
      },
    }))
    // Clear error when file is uploaded
    setFormErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[`${section}.${field}`]
      return newErrors
    })
  }

  const handleReset = () => {
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
    })
    setFormErrors({})
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    let isValid = true

    // Required fields validation
    if (!formState.senderDetails.payerPAN) {
      errors["senderDetails.payerPAN"] = "Payer PAN is required"
      isValid = false
    }
    if (!formState.senderDetails.aadhaar) {
      errors["senderDetails.aadhaar"] = "Aadhaar is required"
      isValid = false
    }

    if (!formState.studentDetails.payerPAN) {
      errors["studentDetails.payerPAN"] = "Payer PAN is required"
      isValid = false
    }
    if (!formState.studentDetails.aadhaar) {
      errors["studentDetails.aadhaar"] = "Aadhaar is required"
      isValid = false
    }

    if (!formState.universityDocuments.feeReceipt) {
      errors["universityDocuments.feeReceipt"] = "Fee receipt is required"
      isValid = false
    }
    if (!formState.universityDocuments.loanSanctionLetter) {
      errors["universityDocuments.loanSanctionLetter"] = "Loan sanction letter is required"
      isValid = false
    }
    if (!formState.universityDocuments.offerLetter) {
      errors["universityDocuments.offerLetter"] = "Offer letter is required"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fill all required fields")
      return
    }

    // Here you would typically send the files to your server
    console.log("Form submitted:", formState)
    toast.success("Documents uploaded successfully!")
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
      {/* Sender Details Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold font-jakarta mb-4">Sender Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-jakarta text-sm mb-2">Payer&apos;s PAN*</label>
            <FileUploader
              onFileUpload={(file) => handleFileUpload("senderDetails", "payerPAN", file)}
              currentFile={formState.senderDetails.payerPAN}
              acceptedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
              maxSizeMB={5}
              required
              fieldName="Payer PAN"
            />
            {formErrors["senderDetails.payerPAN"] && (
              <p className="text-red-500 text-xs mt-1">{formErrors["senderDetails.payerPAN"]}</p>
            )}
          </div>
          <div>
            <label className="block font-jakarta text-sm mb-2">Aadhaar (front and back)*</label>
            <FileUploader
              onFileUpload={(file) => handleFileUpload("senderDetails", "aadhaar", file)}
              currentFile={formState.senderDetails.aadhaar}
              acceptedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
              maxSizeMB={5}
              required
              fieldName="Aadhaar"
            />
            {formErrors["senderDetails.aadhaar"] && (
              <p className="text-red-500 text-xs mt-1">{formErrors["senderDetails.aadhaar"]}</p>
            )}
          </div>
          <div>
            <label className="block font-jakarta text-sm mb-2">Passport (front and back)</label>
            <FileUploader
              onFileUpload={(file) => handleFileUpload("senderDetails", "passport", file)}
              currentFile={formState.senderDetails.passport}
              acceptedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
              maxSizeMB={5}
              fieldName="Passport"
            />
          </div>
        </div>
      </div>

      {/* Student Details Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold font-jakarta mb-4">Student Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-jakarta mb-2">Payer&apos;s PAN*</label>
            <FileUploader
              onFileUpload={(file) => handleFileUpload("studentDetails", "payerPAN", file)}
              currentFile={formState.studentDetails.payerPAN}
              acceptedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
              maxSizeMB={5}
              required
              fieldName="Payer PAN"
            />
            {formErrors["studentDetails.payerPAN"] && (
              <p className="text-red-500 text-xs mt-1">{formErrors["studentDetails.payerPAN"]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-jakarta mb-2">Aadhaar (front and back)*</label>
            <FileUploader
              onFileUpload={(file) => handleFileUpload("studentDetails", "aadhaar", file)}
              currentFile={formState.studentDetails.aadhaar}
              acceptedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
              maxSizeMB={5}
              required
              fieldName="Aadhaar"
            />
            {formErrors["studentDetails.aadhaar"] && (
              <p className="text-red-500 text-xs mt-1">{formErrors["studentDetails.aadhaar"]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-jakarta mb-2">Passport (front and back)</label>
            <FileUploader
              onFileUpload={(file) => handleFileUpload("studentDetails", "passport", file)}
              currentFile={formState.studentDetails.passport}
              acceptedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
              maxSizeMB={5}
              fieldName="Passport"
            />
          </div>
        </div>
      </div>

      {/* University related documents Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold font-jakarta mb-4">University related documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-jakarta mb-2">University fee receipt*</label>
            <FileUploader
              onFileUpload={(file) => handleFileUpload("universityDocuments", "feeReceipt", file)}
              currentFile={formState.universityDocuments.feeReceipt}
              acceptedFileTypes={[".pdf"]}
              maxSizeMB={5}
              required
              fieldName="Fee receipt"
            />
            {formErrors["universityDocuments.feeReceipt"] && (
              <p className="text-red-500 text-xs mt-1">{formErrors["universityDocuments.feeReceipt"]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-jakarta mb-2">Education loan sanction letter*</label>
            <FileUploader
              onFileUpload={(file) => handleFileUpload("universityDocuments", "loanSanctionLetter", file)}
              currentFile={formState.universityDocuments.loanSanctionLetter}
              acceptedFileTypes={[".pdf"]}
              maxSizeMB={5}
              required
              fieldName="Loan sanction letter"
            />
            {formErrors["universityDocuments.loanSanctionLetter"] && (
              <p className="text-red-500 text-xs mt-1">{formErrors["universityDocuments.loanSanctionLetter"]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-jakarta mb-2">University offer letter*</label>
            <FileUploader
              onFileUpload={(file) => handleFileUpload("universityDocuments", "offerLetter", file)}
              currentFile={formState.universityDocuments.offerLetter}
              acceptedFileTypes={[".pdf"]}
              maxSizeMB={5}
              required
              fieldName="Offer letter"
            />
            {formErrors["universityDocuments.offerLetter"] && (
              <p className="text-red-500 text-xs mt-1">{formErrors["universityDocuments.offerLetter"]}</p>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-center gap-4 mt-8">
        <Button
          type="submit"
          className="bg-dark-blue hover:bg-dark-blue text-white px-4 sm:px-8 font-jakarta h-12 sm:h-15 w-full sm:w-55 rounded-md"
        >
          <Image src="/continue.svg" alt="" width={15} height={15} className="mr-2" /> CONTINUE
        </Button>
        <Button
          type="button"
          variant="outline"
          className="bg-white hover:bg-white text-dark-gray font-jakarta border-gray-300 h-12 sm:h-15 w-full sm:w-55 rounded-md"
          onClick={handleReset}
        >
          <Image src="/reset.svg" alt="" width={15} height={15} className="mr-2" /> RESET
        </Button>
      </div>
    </form>
  )
}
