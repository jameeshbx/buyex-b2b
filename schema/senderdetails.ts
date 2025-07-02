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
  senderEmail: z.string().optional(),
  sourceOfFunds: z.enum(["salary", "savings", "business", "investment"]).optional(),
  occupationStatus: z.enum(["employed", "self-employed", "business-owner", "retired", "student"]).optional(),
  payerAccountNumber: z.string().optional(),
  payerBankName: z.string().optional(),
  senderAddressLine1: z.string().optional(),
  senderAddressLine2: z.string().optional(),
  senderState: z.string().optional(),
  senderPostalCode: z.string().optional(),
}).superRefine((data, ctx) => {
  // If relationship is not "self" (meaning someone else is paying), validate sender fields
  if (data.relationship && data.relationship !== "self") {
    if (!data.senderName || data.senderName.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sender name is required",
        path: ["senderName"],
      });
    }
    if (!data.senderEmail || data.senderEmail.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sender email is required",
        path: ["senderEmail"],
      });
    } else if (data.senderEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.senderEmail)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid email format",
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
    if (!data.mothersName || data.mothersName.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mother's name is required",
        path: ["mothersName"],
      });
    }
    if (!data.dob || data.dob.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Date of birth is required",
        path: ["dob"],
      });
    }
    if (!data.sourceOfFunds) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Source of funds is required",
        path: ["sourceOfFunds"],
      });
    }
    if (!data.occupationStatus) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Occupation status is required",
        path: ["occupationStatus"],
      });
    }
    if (!data.payerAccountNumber || data.payerAccountNumber.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Payer account number is required",
        path: ["payerAccountNumber"],
      });
    }
    if (!data.payerBankName || data.payerBankName.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Payer bank name is required",
        path: ["payerBankName"],
      });
    }
    if (!data.senderAddressLine1 || data.senderAddressLine1.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sender address is required",
        path: ["senderAddressLine1"],
      });
    }
    if (!data.senderState || data.senderState.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sender state is required",
        path: ["senderState"],
      });
    }
    if (!data.senderPostalCode || data.senderPostalCode.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sender postal code is required",
        path: ["senderPostalCode"],
      });
    }
  }
});

export type FormValues = z.infer<typeof formSchema>;