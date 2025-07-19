import z from "zod"

// Custom email validation with at least 3 characters after the dot
const emailValidation = z
  .string()
  .email("Invalid email format")
  .refine(
    (email) => {
      const parts = email.split("@")
      if (parts.length !== 2) return false
      const domain = parts[1]
      const domainParts = domain.split(".")
      if (domainParts.length < 2) return false
      const extension = domainParts[domainParts.length - 1]
      return extension.length >= 2
    },
    {
      message: "Email domain extension must be at least 2 characters",
    },
  )

// Custom DOB validation
const dobValidation = z
  .string()
  .refine((val) => /^\d{2}\/\d{2}\/\d{4}$/.test(val), {
    message: "Date must be in DD/MM/YYYY format",
  })
  .refine(
    (val) => {
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(val)) return false

      const [day, month, year] = val.split("/").map(Number)
      const date = new Date(year, month - 1, day)

      // Check if the date is valid
      if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        return false
      }

      // Check if date is not in the future
      const today = new Date()
      if (date > today) {
        return false
      }

      // Check if person is not older than 120 years
      const age = today.getFullYear() - year
      if (age > 120) {
        return false
      }

      return true
    },
    {
      message: "Please enter a valid birth date",
    },
  )

export const formSchema = z
  .object({
    // Student Details
    studentName: z.string().min(1, "Name is required"),
    studentEmailOriginal: emailValidation,
    studentEmailFake: emailValidation.optional(),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^\+?[\d\s\-$$$$]+$/, "Invalid phone number format"),
    addressLine1: z.string().min(1, "Address is required"),
    addressLine2: z.string().optional(),
    state: z.string().min(1, "State is required"),
    postalCode: z
      .string()
      .min(1, "Postal code is required")
      .regex(/^[0-9]{6}$/, "Postal code must be 6 digits"),
    nationality: z.enum(["indian", "american", "british", "canadian", "australian"]),

    // Sender Details (conditionally required)
    senderName: z.string().optional(),
    relationship: z.enum(["self", "parent", "brother", "sister", "spouse", "other"]).optional(),
    bankCharges: z.enum(["resident", "nri", "pio"]).optional(),
    dob: dobValidation.optional(),
    senderNationality: z.enum(["indian", "american", "british", "canadian", "australian"]).optional(),
    senderEmail: emailValidation.optional(),
    sourceOfFunds: z.enum(["salary", "savings", "business", "investment"]).optional(),
    occupationStatus: z.enum(["employed", "self-employed", "business-owner", "retired", "student"]).optional(),
    senderAddressLine1: z.string().optional(),
    senderAddressLine2: z.string().optional(),
    senderState: z.string().optional(),
    senderPostalCode: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // If relationship is not "self" (meaning someone else is paying), validate sender fields
    if (data.relationship && data.relationship !== "self") {
      if (!data.senderName || data.senderName.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sender name is required",
          path: ["senderName"],
        })
      }

      if (!data.senderEmail || data.senderEmail.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sender email is required",
          path: ["senderEmail"],
        })
      }

      if (!data.bankCharges) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Bank charges type is required",
          path: ["bankCharges"],
        })
      }

    

      if (!data.dob || data.dob.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Date of birth is required",
          path: ["dob"],
        })
      }

      if (!data.senderNationality) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sender nationality is required",
          path: ["senderNationality"],
        })
      }

      if (!data.sourceOfFunds) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Source of funds is required",
          path: ["sourceOfFunds"],
        })
      }

      if (!data.occupationStatus) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Occupation status is required",
          path: ["occupationStatus"],
        })
      }



      if (!data.senderAddressLine1 || data.senderAddressLine1.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sender address is required",
          path: ["senderAddressLine1"],
        })
      }

      if (!data.senderState || data.senderState.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sender state is required",
          path: ["senderState"],
        })
      }

      if (!data.senderPostalCode || data.senderPostalCode.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sender postal code is required",
          path: ["senderPostalCode"],
        })
      } else if (!/^[0-9]{6}$/.test(data.senderPostalCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sender postal code must be 6 digits",
          path: ["senderPostalCode"],
        })
      }
    }
  })

export type FormValues = z.infer<typeof formSchema>
