// src/schemas/uploadfiles.ts
import { z } from "zod";

// Define allowed file types
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf'
];

// Define allowed file extensions for better error messages
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf'];

// Helper function to validate file type
const validateFileType = (file: File) => {
  return ALLOWED_FILE_TYPES.includes(file.type) || 
         ALLOWED_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext));
};

export const fileUploadSchema = z.object({
  files: z.array(z.instanceof(File))
    .min(1, "At least one file is required")
    .refine(
      files => files.every(file => file.size <= 5 * 1024 * 1024), 
      "File size must be less than 5MB"
    )
    .refine(
      files => files.every(validateFileType),
      `Only ${ALLOWED_EXTENSIONS.join(', ')} files are allowed`
    ),
  comment: z.string()
    .min(1, "Comment is required")
    .max(500, "Comment must be less than 500 characters")
});

export const editFileSchema = z.object({
  fileName: z.string()
    .min(1, "File name is required")
    .max(255, "File name must be less than 255 characters"),
  comment: z.string()
    .max(500, "Comment must be less than 500 characters")
});