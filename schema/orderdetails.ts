// schema/orderdetails.ts
import { z } from "zod"

export const MAX_USD_EQUIVALENT = 250000 // 2.5 lakh USD

export const orderDetailsFormSchema = z
  .object({
    purpose: z.string().min(1, { message: "Purpose is required" }),
    foreignBankCharges: z.enum(["OUR", "BEN"]),
    educationLoan: z.enum(["yes", "no"]).optional(),
    payer: z.string().min(1, { message: "Payer is required" }),
    forexPartner: z.string().min(1, { message: "Forex partner is required" }),
    margin: z.string().refine(
      (val) => {
        const num = Number(val)
        return !isNaN(num) && num >= 0.2 && num <= 4
      },
      {
        message: "Margin must be a number between 0.20 and 4",
      },
    ),
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
  .refine(
    async (data) => {
      const amount = Number(data.amount)
      const currency = data.currency
      const ibrRate = Number(data.ibrRate)

      if (!amount || !currency || isNaN(ibrRate)) return true // Let other validations handle empty values

      // If currency is USD, direct comparison
      if (currency === "USD") {
        return amount <= MAX_USD_EQUIVALENT
      }

      // For other currencies, convert to USD equivalent using IBR rates
      try {
        // Get USD IBR rate
        const usdIbrResponse = await fetch(`/api/currency/ibr?currency=USD`)
        if (!usdIbrResponse.ok) throw new Error("Failed to fetch USD IBR rate")
        const usdIbrData = await usdIbrResponse.json()
        const usdIbrRate = usdIbrData.rate

        if (!usdIbrRate) throw new Error("USD IBR rate not available")

        // Calculate USD equivalent: (amount * currencyIBR) / USD_IBR
        const usdEquivalent = (amount * ibrRate) / usdIbrRate
        
        return usdEquivalent <= MAX_USD_EQUIVALENT
      } catch (error) {
        console.error("Error validating transaction limit:", error)
        return true // Allow transaction if we can't validate (fallback)
      }
    },
    {
      message: `Transaction amount exceeds maximum limit of ${MAX_USD_EQUIVALENT.toLocaleString()} USD equivalent`,
      path: ["amount"],
    },
  )

export type OrderDetailsFormValues = z.infer<typeof orderDetailsFormSchema>

export const validateTransactionLimit = async (
amount: number, currency: string, ibrRate?: number, currentMargin?: string): Promise<{ isValid: boolean; message?: string; usdEquivalent?: number }> => {
  try {
    // If currency is USD, direct comparison
    if (currency === "USD") {
      return {
        isValid: amount <= MAX_USD_EQUIVALENT,
        message: `Transaction amount exceeds maximum limit of ${MAX_USD_EQUIVALENT.toLocaleString()} USD`,
        usdEquivalent: amount
      };
    }

    // For other currencies, we need the IBR rate
    if (!ibrRate) {
      console.error("IBR rate is required for non-USD currencies");
      return { isValid: true }; // Fallback if we can't validate
    }

    // Get USD IBR rate
    const usdIbrResponse = await fetch(`/api/currency?base=INR&target=USD`);
    console.log("usdIbrResponse", usdIbrResponse);
    console.log("IBR rate", ibrRate);
    
    
    if (!usdIbrResponse.ok) {
      console.error("Failed to fetch USD IBR rate");
      return { isValid: true }; // Fallback if we can't validate
    }

    const usdIbrData = await usdIbrResponse.json();
    const usdIbrRate = usdIbrData.rate;
    console.log("USD IBR rate", usdIbrRate);
    

    if (!usdIbrRate) {
      console.error("USD IBR rate not available");
      return { isValid: true }; // Fallback if we can't validate
    }

    // Calculate USD equivalent using the formula: (amount * currency's IBR) / USD IBR
    const usdEquivalent = (amount * ibrRate) / usdIbrRate;
    
    return {
      isValid: usdEquivalent <= MAX_USD_EQUIVALENT,
      message: `Transaction amount exceeds maximum limit of ${MAX_USD_EQUIVALENT.toLocaleString()} USD equivalent`,
      usdEquivalent
    };
  } catch (error) {
    console.error("Error validating transaction limit:", error);
    return { isValid: true };
  }
}
