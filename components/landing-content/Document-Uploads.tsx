"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { FileUploader } from "./File-Uploader"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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
  const router = useRouter()
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
  const [payer, setPayer] = useState<string | null>(null);
  const [educationLoan, setEducationLoan] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false)
  // Get values from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPayer(localStorage.getItem('selectedPayer'));
      setEducationLoan(localStorage.getItem('educationLoan'));
    }
  }, []);

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
      toast.info("Form has been reset")
  }

  const validateForm = (): boolean => {
  const errors: Record<string, string> = {}
  let isValid = true

  // Validate sender details
  const senderPanError = validateFile(
    formState.senderDetails.payerPAN,
    "Payer PAN",
    5,
    [".jpg", ".jpeg", ".png", ".pdf"]
  )
  if (senderPanError) {
    errors["senderDetails.payerPAN"] = senderPanError
    isValid = false
  } else if (!formState.senderDetails.payerPAN) {
    errors["senderDetails.payerPAN"] = "Payer PAN is required"
    isValid = false
  }

  const senderAadhaarError = validateFile(
    formState.senderDetails.aadhaar,
    "Aadhaar",
    5,
    [".jpg", ".jpeg", ".png", ".pdf"]
  )
  if (senderAadhaarError) {
    errors["senderDetails.aadhaar"] = senderAadhaarError
    isValid = false
  } else if (!formState.senderDetails.aadhaar) {
    errors["senderDetails.aadhaar"] = "Aadhaar is required"
    isValid = false
  }

  const senderPassportError = validateFile(
    formState.senderDetails.passport,
    "Passport",
    5,
    [".jpg", ".jpeg", ".png", ".pdf"]
  )
  if (senderPassportError) {
    errors["senderDetails.passport"] = senderPassportError
    isValid = false
  }


// Required fields validation for student (only if payer is not self)
  if (payer !== "Self") {
    const studentPanError = validateFile(
      formState.studentDetails.payerPAN,
      "Student PAN",
      5,
      [".jpg", ".jpeg", ".png", ".pdf"]
    )
    if (studentPanError) {
      errors["studentDetails.payerPAN"] = studentPanError
      isValid = false
    } else if (!formState.studentDetails.payerPAN) {
      errors["studentDetails.payerPAN"] = "Student PAN is required"
      isValid = false
    }

    const studentAadhaarError = validateFile(
      formState.studentDetails.aadhaar,
      "Student Aadhaar",
      5,
      [".jpg", ".jpeg", ".png", ".pdf"]
    )
    if (studentAadhaarError) {
      errors["studentDetails.aadhaar"] = studentAadhaarError
      isValid = false
    } else if (!formState.studentDetails.aadhaar) {
      errors["studentDetails.aadhaar"] = "Student Aadhaar is required"
      isValid = false
    }

    const studentPassportError = validateFile(
      formState.studentDetails.passport,
      "Student Passport",
      5,
      [".jpg", ".jpeg", ".png", ".pdf"]
    )
    if (studentPassportError) {
      errors["studentDetails.passport"] = studentPassportError
      isValid = false
    }
  }

  // Validate university documents
  const feeReceiptError = validateFile(
    formState.universityDocuments.feeReceipt,
    "Fee Receipt",
    5,
    [".pdf"]
  )
  if (feeReceiptError) {
    errors["universityDocuments.feeReceipt"] = feeReceiptError
    isValid = false
  } else if (!formState.universityDocuments.feeReceipt) {
    errors["universityDocuments.feeReceipt"] = "Fee receipt is required"
    isValid = false
  }

  if (educationLoan === "yes") {
    const loanLetterError = validateFile(
      formState.universityDocuments.loanSanctionLetter,
      "Loan Sanction Letter",
      5,
      [".pdf"]
    )
    if (loanLetterError) {
      errors["universityDocuments.loanSanctionLetter"] = loanLetterError
      isValid = false
    } else if (!formState.universityDocuments.loanSanctionLetter) {
      errors["universityDocuments.loanSanctionLetter"] = "Loan sanction letter is required when education loan is selected"
      isValid = false
    }
  }

  const offerLetterError = validateFile(
    formState.universityDocuments.offerLetter,
    "Offer Letter",
    5,
    [".pdf"]
  )
  if (offerLetterError) {
    errors["universityDocuments.offerLetter"] = offerLetterError
    isValid = false
  } else if (!formState.universityDocuments.offerLetter) {
    errors["universityDocuments.offerLetter"] = "Offer letter is required"
    isValid = false
  }

  setFormErrors(errors)
  return isValid
}

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)

  if (!validateForm()) {
    toast.error("Please fill all required fields")
    setIsSubmitting(false)
    return
  }

  try {
    const formData = new FormData()

      // Append sender details
      if (formState.senderDetails.payerPAN) formData.append('senderPAN', formState.senderDetails.payerPAN)
      if (formState.senderDetails.aadhaar) formData.append('senderAadhaar', formState.senderDetails.aadhaar)
      if (formState.senderDetails.passport) formData.append('senderPassport', formState.senderDetails.passport)

      // Append student details (if payer is not self)
      if (payer !== "Self") {
        if (formState.studentDetails.payerPAN) formData.append('studentPAN', formState.studentDetails.payerPAN)
        if (formState.studentDetails.aadhaar) formData.append('studentAadhaar', formState.studentDetails.aadhaar)
        if (formState.studentDetails.passport) formData.append('studentPassport', formState.studentDetails.passport)
      }

      // Append university documents
      if (formState.universityDocuments.feeReceipt) formData.append('feeReceipt', formState.universityDocuments.feeReceipt)
      if (formState.universityDocuments.loanSanctionLetter) formData.append('loanSanctionLetter', formState.universityDocuments.loanSanctionLetter)
      if (formState.universityDocuments.offerLetter) formData.append('offerLetter', formState.universityDocuments.offerLetter)

      // Add metadata
      formData.append('payerType', payer || '')
      formData.append('hasEducationLoan', educationLoan || 'no')

      const response = await fetch('/api/documents', {
      method: 'POST',
      body: formData,
      headers: {
        // Add any required headers here
      },
    })

    if (!response.ok) {
      let errorDetails = ''
      try {
        const errorData = await response.json()
        errorDetails = errorData.details || errorData.message || 'Unknown error'
      } catch {
        errorDetails = `Status: ${response.status} - ${response.statusText}`
      }
      throw new Error(`Upload failed: ${errorDetails}`)
    }

     await response.json()
    toast.success("Documents uploaded successfully!")
    router.push('/staff/dashboard/order-preview')
  } catch (error) {
    console.error('Submission error:', error)
    toast.error(
      error instanceof Error ? error.message : "Failed to upload documents. Please try again."
    )
    
    // Additional error logging if needed
    if (process.env.NODE_ENV === 'development') {
      console.group('Detailed error info')
      console.error('Error object:', error)
      console.groupEnd()
    }
  } finally {
    setIsSubmitting(false)
  }
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
      {payer !== "Self" && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold font-jakarta mb-4">Student Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-jakarta mb-2">Student&apos;s PAN*</label>
              <FileUploader
                onFileUpload={(file) => handleFileUpload("studentDetails", "payerPAN", file)}
                currentFile={formState.studentDetails.payerPAN}
                acceptedFileTypes={[".jpg", ".jpeg", ".png", ".pdf"]}
                maxSizeMB={5}
                required
                fieldName="Student PAN"
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
      )}


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
          
          {educationLoan === "yes" && (
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
          )}
          
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
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Processing..."
          ) : (
            <>
              <Image src="/continue.svg" alt="" width={15} height={15} className="mr-2" /> CONTINUE
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
          <Image src="/reset.svg" alt="" width={15} height={15} className="mr-2" /> RESET
        </Button>
      </div>
    </form>
  )
}

function validateFile(
  file: File | null,
  fieldName: string,
  maxSizeMB: number,
  acceptedFileTypes: string[]
): string | undefined {
  if (!file) return undefined;
  const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  if (!acceptedFileTypes.includes(fileExtension)) {
    return `${fieldName} must be one of the following types: ${acceptedFileTypes.join(", ")}`;
  }
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `${fieldName} must be less than ${maxSizeMB} MB`;
  }
  return undefined;
}
