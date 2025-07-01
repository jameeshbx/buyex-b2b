import { z } from "zod";

export const formSchema = z.object({
  // Student Details
  studentName: z.string().min(1, "Name is required"),
  studentEmailOriginal: z.string().email("Invalid email format"),
  studentEmailFake: z.string().email("Invalid email format").optional(),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  nationality: z.enum(["indian", "american", "british", "canadian", "australian"]),
  
  // Sender Details (conditionally required)
  senderName: z.string().optional(),
  relationship: z.enum(["self", "parent", "brother", "sister", "spouse", "other"]).optional(),
  bankCharges: z.enum(["resident", "nri", "pio"]).optional(),
  mothersName: z.string().optional(),
  dob: z.string().optional(),
  senderNationality: z.enum(["indian", "american", "british", "canadian", "australian"]).optional(),
  senderEmail: z.string().email("Invalid email format").optional(),
  sourceOfFunds: z.enum(["salary", "savings", "business", "investment"]).optional(),
  occupationStatus: z.enum(["employed", "self-employed", "business-owner", "retired", "student"]).optional(),
  payerAccountNumber: z.string().optional(),
  payerBankName: z.string().optional(),
  senderAddressLine1: z.string().optional(),
  senderAddressLine2: z.string().optional(),
  senderState: z.string().optional(),
  senderPostalCode: z.string().optional(),
}).superRefine((data, ctx) => {
  // If payer is not self, validate sender fields
  if (data.relationship !== "self") {
    if (!data.senderName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sender name is required",
        path: ["senderName"],
      });
    }
    if (!data.senderEmail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sender email is required",
        path: ["senderEmail"],
      });
    }
    if (!data.bankCharges) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bank charges type is required",
        path: ["bankCharges"],
      });
    }
  }
});

export type FormValues = z.infer<typeof formSchema>;