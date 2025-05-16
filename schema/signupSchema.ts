// schemas/signupSchema.ts
import { z } from "zod"

export const formSchema = z.object({
  businessName: z
    .string()
    .min(2, { message: "Business name must be at least 2 characters" })
    .max(100, { message: "Business name cannot exceed 100 characters" })
    .regex(/^[a-zA-Z0-9\s\-&',.]+$/, {
      message: "Business name contains invalid characters",
    }),

  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .max(100, { message: "Email cannot exceed 100 characters" })
    .transform((val) => val.toLowerCase().trim()),

  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number cannot exceed 15 digits" })
    .regex(/^[0-9+\-()\s]+$/, {
      message: "Phone number contains invalid characters",
    })
    .transform((val) => val.replace(/\D/g, "")),

  logo: z
    .instanceof(File, { message: "Please upload a valid file" })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB",
    })
    .refine((file) => ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type), {
      message: "Only JPEG, PNG, GIF, or WEBP images are allowed",
    })
    .optional(),

  verified: z.boolean().refine((val) => val === true, {
    message: "Please complete the verification",
  }),

  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
})

export type FormValues = z.infer<typeof formSchema>
