export interface Order {
  currencyValidation: string
  fcyAmtValidation: string
  purposeValidation: string
  receiverAccountValidation: string
  id: string
  date: string
  purpose: string
  name: string
  currency: string
  fcyAmt: number
  fxRate: number
  fxRateUpdated: boolean
  status: string
  receiverAccount: string
  receiverCountry: string
  forexPartner: string
}


export const statusOptions = [
  "Received",
  "QuoteDownloaded",
  "Authorized",
  "Blocked",
  "Documents placed",
  "RateCovered",
  "Pending",
  "Rejected",
  "Completed",
]

export const nonChangeableStatuses = [
  "QuoteDownloaded",
  "Blocked",
  "Documents placed",
  "Authorized",
  "RateCovered",
  "Rejected",
  "Completed",
]
