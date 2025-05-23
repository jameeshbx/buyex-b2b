import { z } from "zod"

export const orderDetailsFormSchema = z.object({
  purpose: z.string().min(1, { message: "Purpose is required" }),
  foreignBankCharges: z.enum(["OUR", "BEN"]),
  payer: z.string().min(1, { message: "Payer is required" }),
  forexPartner: z.string().min(1, { message: "Forex partner is required" }),
  margin: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Margin must be a positive number",
  }),
  receiverBankCountry: z.string().min(1, { message: "Receiver's bank country is required" }),
  studentName: z.string().min(1, { message: "Student name is required" }),
  consultancy: z.string().min(1, { message: "Consultancy is required" }),
  ibrRate: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "IBR Rate must be a positive number",
  }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  currency: z.string().min(1, { message: "Currency is required" }),
  totalAmount: z.string().optional(),
  customerRate: z.string().optional(),
})

export type OrderDetailsFormValues = z.infer<typeof orderDetailsFormSchema>