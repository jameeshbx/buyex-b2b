import { z } from "zod"

export const consultancySchema = z.object({
  consultancyName: z.string().min(3, { message: "Consultancy name must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  state: z.string().min(1, { message: "Please select a state" }),
  phone: z.string()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number is too long" })
    .regex(/^[0-9+\-\s]+$/, { message: "Please enter a valid phone number" })
})

export type ConsultancyFormValues = z.infer<typeof consultancySchema>
