
export interface Order {
  id: string
  date: string
  purpose: string
  name: string
  currency: string
  fcyAmt: string
  inrAmt: string
  customerRate: string
  status: string
  receiverAccount?: string
  receiverCountry?: string
  forexPartner?: string
}

export const orders: Order[] = [
  {
    id: "ORD040",
    date: "20 Apr 2025",
    purpose: "Blocked Account",
    name: "Aanya Patel",
    currency: "USD",
    fcyAmt: "12,000",
    inrAmt: "10,12,348.12",
    customerRate: "0.43",
    status: "Received",
    receiverAccount: "DE89 3704 0044 0532 0130 00",
    receiverCountry: "Germany",
    forexPartner: "FXPrime Global Pvt Ltd",
  },
  {
    id: "ORD039",
    date: "19 Apr 2025",
    purpose: "Tuition Payment",
    name: "Vikram Shah",
    currency: "EUR",
    fcyAmt: "8,500",
    inrAmt: "8,13,271.50",
    customerRate: "0.37",
    status: "Quote downloaded",
    receiverAccount: "FR14 2004 1010 0505 0001 3M02 606",
    receiverCountry: "France",
    forexPartner: "EuroFX Solutions Ltd",
  },
  {
    id: "ORD038",
    date: "18 Apr 2025",
    purpose: "University Fee",
    name: "Zoe Fernandes",
    currency: "GBP",
    fcyAmt: "9,000",
    inrAmt: "10,11,399.30",
    customerRate: "0.37",
    status: "Received",
    receiverAccount: "GB29 NWBK 6016 1331 9268 19",
    receiverCountry: "United Kingdom",
    forexPartner: "Sterling Exchange Ltd",
  },
  {
    id: "ORD037",
    date: "17 Apr 2025",
    purpose: "Blocked Account",
    name: "Rahul Menon",
    currency: "USD",
    fcyAmt: "15,000",
    inrAmt: "12,65,693.25",
    customerRate: "0.25",
    status: "Authorize",
    receiverAccount: "US64 SVBK US6S 3300 0000 0000 0000",
    receiverCountry: "United States",
    forexPartner: "AmericaFX Corp",
  },
  {
    id: "ORD036",
    date: "22 Mar 2025",
    purpose: "Living Expenses",
    name: "Sara Thomas",
    currency: "AUD",
    fcyAmt: "7,200",
    inrAmt: "3,92,372.78",
    customerRate: "0.28",
    status: "Received",
    receiverAccount: "AU21 0123 4567 8901 2345 67",
    receiverCountry: "Australia",
    forexPartner: "OzForex Trading Pty",
  },
]

export const statusOptions = ["Received", "Verified", "Pending", "Rejected", "Completed"]
export const nonChangeableStatuses = ["Quote downloaded", "Authorize", "Documents placed", "Rate expired"]