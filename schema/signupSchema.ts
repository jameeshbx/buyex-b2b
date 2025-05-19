// schemas/signupSchema.ts
import { z } from "zod";

export const formSchema = z.object({
  organisationName: z
    .string()
    .min(2, { message: "Organisation name must be at least 2 characters" })
    .max(100, { message: "Organisation name cannot exceed 100 characters" })
    .regex(/^[a-zA-Z0-9\s\-&',.]+$/, {
      message: "Organisation name contains invalid characters",
    }),

  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .max(100, { message: "Email cannot exceed 100 characters" })
    .transform((val) => val.toLowerCase().trim()),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password cannot exceed 100 characters" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
      }
    ),

  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number cannot exceed 15 digits" })
    .regex(/^[0-9+\-()\s]+$/, {
      message: "Phone number contains invalid characters",
    })
    .transform((val) => val.replace(/\D/g, "")),

  logo: z.any().optional(),

  verified: z.boolean().refine((val) => val === true, {
    message: "Please complete the verification",
  }),

  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export type FormValues = z.infer<typeof formSchema>;
