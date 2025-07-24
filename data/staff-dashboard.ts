export interface Order {
  fxRateUpdated: any
  id: string
  date: string
  purpose: string
  name?: string
  currency: string
  fcyAmt: string
  inrAmt: string
  customerRate: string
  status: string
  receiverAccount?: string
  receiverCountry?: string
  forexPartner?: string
  addedBy?: string
  addedDate?: string
}

export const purposeOptions = [
  "Blocked Account",
  "Tuition Payment",
  "University Fee",
  "Living Expenses",
  "Travel Expenses",
  "Family Support",
  "Medical Expenses",
  "Property Purchase",
  "Investment",
]



export const statusOptions = ["Received", "RateCovered", , "Rejected", "Completed"]
export const nonChangeableStatuses = ["QuoteDownloaded", "Authorized","Blocked", "DocumentsPlaced","Pending", "Rate expired"]
