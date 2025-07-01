import { z } from "zod"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]
const ACCEPTED_PDF_TYPES = ["application/pdf"]

export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "File is required" })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    })
    .refine(
      (file) => {
        const extension = file.name.split(".").pop()?.toLowerCase()
        const mimeType = file.type

        // For images
        if (["jpg", "jpeg", "png"].includes(extension || "")) {
          return ACCEPTED_IMAGE_TYPES.includes(mimeType)
        }
        // For PDFs
        if (extension === "pdf") {
          return ACCEPTED_PDF_TYPES.includes(mimeType)
        }

        return false
      },
      {
        message: "Only .jpg, .jpeg, .png and .pdf files are allowed",
      },
    ),
})

// Schema for image-only uploads (PAN, Aadhaar, Passport)
export const imageUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "File is required" })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    })
    .refine(
      (file) => {
        const extension = file.name.split(".").pop()?.toLowerCase()
        const mimeType = file.type

        if (["jpg", "jpeg", "png", "webp"].includes(extension || "")) {
          return ACCEPTED_IMAGE_TYPES.includes(mimeType)
        }

        return false
      },
      {
        message: "Only .jpg, .jpeg, .png and .webp files are allowed",
      },
    ),
})

// Schema for PDF-only uploads (University documents)
export const pdfUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, { message: "File is required" })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    })
    .refine(
      (file) => {
        const extension = file.name.split(".").pop()?.toLowerCase()
        const mimeType = file.type

        if (extension === "pdf") {
          return ACCEPTED_PDF_TYPES.includes(mimeType)
        }

        return false
      },
      {
        message: "Only .pdf files are allowed",
      },
    ),
})

export type FileUploadSchemaType = z.infer<typeof fileUploadSchema>
export type ImageUploadSchemaType = z.infer<typeof imageUploadSchema>
export type PdfUploadSchemaType = z.infer<typeof pdfUploadSchema>

// Helper function to get accepted file types based on schema
export const getAcceptedFileTypes = (schemaType: "image" | "pdf" | "all") => {
  switch (schemaType) {
    case "image":
      return [".jpg", ".jpeg", ".png", ".webp"]
    case "pdf":
      return [".pdf"]
    case "all":
    default:
      return [".jpg", ".jpeg", ".png", ".webp", ".pdf"]
  }
}

// Helper function to get max file size
export const getMaxFileSize = () => MAX_FILE_SIZE
export const getMaxFileSizeMB = () => MAX_FILE_SIZE / (1024 * 1024)
