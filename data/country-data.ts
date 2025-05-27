import { z } from "zod"

// Country specific bank fields
export const countryBankFields = {
  UK: ["sortCode"],
  USA: ["routingNumber"],
  Canada: ["transitNumber"],
  Australia: ["bsbCode"],
  "UK, Europe, Bahrain, Germany, France, Saudi Arabia, UAE": ["iban"],
}

// Countries data
export const countries = [
  { value: "UK", label: "UK" },
  { value: "USA", label: "USA" },
  { value: "Canada", label: "Canada" },
  { value: "Australia", label: "Australia" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
  { value: "Bahrain", label: "Bahrain" },
  { value: "Saudi Arabia", label: "Saudi Arabia" },
  { value: "UAE", label: "UAE" },
]

// Sample existing receivers data
export const existingReceivers = [
  {
    id: "#REC040",
    name: "University of Toronto",
    country: "Canada",
    address: "45 Queen St, Toronto, ON",
    bankName: "Royal Bank of Canada",
    bankCountry: "Canada",
    accountNo: "12345678912",
    status: true,
  },
  {
    id: "#REC039",
    name: "University of Munich",
    country: "Germany",
    address: "Berliner Str. 12, Frankfurt",
    bankName: "Deutsche Bank AG",
    bankCountry: "Germany",
    accountNo: "DE8937040044",
    status: true,
  },
  {
    id: "#REC038",
    name: "University of Sydney",
    country: "Australia",
    address: "25 George St, Sydney NSW",
    bankName: "Commonwealth Bank",
    bankCountry: "Australia",
    accountNo: "987654321012",
    status: true,
  },
  {
    id: "#REC037",
    name: "San Jose State University",
    country: "USA",
    address: "332 Main St, San Jose, CA",
    bankName: "Bank of America",
    bankCountry: "USA",
    accountNo: "001122334455",
    status: false,
  },
  {
    id: "#REC036",
    name: "University College London (UCL)",
    country: "UK",
    address: "15 King's Rd, London",
    bankName: "Barclays Bank",
    bankCountry: "UK",
    accountNo: "GB29NWBK601",
    status: true,
  },
]

// Validation schemas
export const beneficiaryFormSchema = z.object({
  existingReceiver: z.enum(["YES", "NO"]),
  receiverFullName: z.string().min(1, "Receiver's full name is required"),
  receiverCountry: z.string().min(1, "Receiver's country is required"),
  address: z.string().min(1, "Address is required"),
  receiverBank: z.string().min(1, "Receiver's bank is required"),
  receiverBankAddress: z.string().min(1, "Receiver's bank address is required"),
  receiverBankCountry: z.string().min(1, "Receiver bank's country is required"),
  receiverAccount: z.string().min(1, "Receiver's account is required"),
  receiverBankSwiftCode: z
  .string()
  .min(1, "Receiver's bank swift code is required")
  .refine(
    (val) => /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(val),
    {
      message: "Invalid SWIFT code format. Must be 8 or 11 characters (e.g., ABCDGB2L or ABCDGB2LXXX)",
    }
  ),
  iban: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[A-Z]{2}[0-9A-Z]{13,32}$/.test(val),
      { message: "Invalid IBAN format" }
    ),

  sortCode: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{6}$/.test(val), {
      message: "Sort Code must be exactly 6 digits",
    }),

  transitNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{5}$/.test(val), {
      message: "Transit Number must be exactly 5 digits",
    }),

  bsbCode: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{6}$/.test(val), {
      message: "BSB Code must be exactly 6 digits",
    }),

  routingNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^\d{9}$/.test(val), {
      message: "Routing Number must be exactly 9 digits",
    }),
  anyIntermediaryBank: z.enum(["YES", "NO"]),
  intermediaryBankName: z.string().optional(),
  intermediaryBankAccountNo: z.string().optional(),
  intermediaryBankIBAN: z.string().optional(),
  intermediaryBankSwiftCode: z.string().optional(),
  totalRemittance: z.string().min(1, "Total remittance is required"),
  field70: z.string().optional(),
  selectedReceiverId: z.string().optional(),
})

export type BeneficiaryFormValues = z.infer<typeof beneficiaryFormSchema>

export const defaultFormValues: BeneficiaryFormValues = {
  existingReceiver: "NO",
  receiverFullName: "",
  receiverCountry: "UK",
  address: "",
  receiverBank: "",
  receiverBankAddress: "",
  receiverBankCountry: "UK",
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
  totalRemittance: "",
  field70: "",
  selectedReceiverId: "",
}
