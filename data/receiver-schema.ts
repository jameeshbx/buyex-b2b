import { z } from "zod"

// Country data type
export type Country = {
  value: string
  label: string
}

// List of supported countries
export const countries: Country[] = [
  { value: "United States", label: "United States" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Canada", label: "Canada" },
  { value: "Australia", label: "Australia" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
  // Add more countries as needed
]

// Fields required for different countries' banking systems
export const countryBankFields: Record<string, string[]> = {
  "United Kingdom": ["sortCode"],
  Germany: ["iban"],
  France: ["iban"],
  Australia: ["bsbCode"],
  "United States": ["routingNumber"],
  Canada: ["transitNumber"],
}

// Receiver form schema with proper typing
export const receiverFormSchema = z.object({
  receiverFullName: z.string().min(1, "Receiver's full name is required"),
  receiverCountry: z.string().min(1, "Receiver's country is required"),
  address: z.string().min(1, "Address is required"),
  receiverBank: z.string().min(1, "Receiver's bank is required"),
  receiverBankAddress: z.string().min(1, "Receiver's bank address is required"),
  receiverBankCountry: z.string().min(1, "Receiver bank's country is required"),
  receiverAccount: z.string().min(1, "Receiver's account is required"),
  receiverBankSwiftCode: z.string().min(1, "Receiver's bank swift code is required"),
  iban: z.string().optional(),
  sortCode: z.string().optional(),
  transitNumber: z.string().optional(),
  bsbCode: z.string().optional(),
  routingNumber: z.string().optional(),
  anyIntermediaryBank: z.enum(["YES", "NO"]),
  intermediaryBankName: z.string().optional(),
  intermediaryBankAccountNo: z.string().optional(),
  intermediaryBankIBAN: z.string().optional(),
  intermediaryBankSwiftCode: z.string().optional(),
  status: z.boolean().optional(),
})

export type ReceiverFormValues = z.infer<typeof receiverFormSchema>

export const defaultReceiverFormValues: ReceiverFormValues = {
  receiverFullName: "",
  receiverCountry: "United States",
  address: "",
  receiverBank: "",
  receiverBankAddress: "",
  receiverBankCountry: "United States",
  receiverAccount: "",
  receiverBankSwiftCode: "",
  iban: "",
  sortCode: "",
  transitNumber: "",
  bsbCode: "",
  routingNumber: "",
  anyIntermediaryBank: "NO",
  intermediaryBankName: "",
  intermediaryBankAccountNo: "",
  intermediaryBankIBAN: "",
  intermediaryBankSwiftCode: "",
  status: true,
}
