// data/admin-dashboard.ts
export interface Order {
  id: string;
  date: string;
  purpose: string;
  name: string;
  currency: string;
  fcyAmt: string;
  fxRate: number;
  fxRateUpdated: boolean;
  status: string;
  receiverAccount: string;
  receiverCountry: string;
  forexPartner: string;
}

export const statusOptions = [
  "Received",
  "Quote downloaded",
  "Authorized",
  "Documents placed",
  "Verified",
  "Pending",
  "Rejected",
  "Completed"
];

export const nonChangeableStatuses = [
  "Quote downloaded",
  "Authorized",
  "Documents placed",
  "Verified",
  "Completed"
];

export const initialOrders: Order[] = [
  {
    id: "ORD-2023-001",
    date: "2023-10-15",
    purpose: "Education Fees",
    name: "John Smith",
    currency: "EUR",
    fcyAmt: "5,000.00",
    fxRate: 1.12,
    fxRateUpdated: false,
    status: "Received",
    receiverAccount: "DE89 3704 0044 0532 0130 00",
    receiverCountry: "Germany",
    forexPartner: "Deutsche Bank"
  },
  {
    id: "ORD-2023-002",
    date: "2023-10-16",
    purpose: "Medical Expenses",
    name: "Sarah Johnson",
    currency: "GBP",
    fcyAmt: "3,250.00",
    fxRate: 1.31,
    fxRateUpdated: true,
    status: "Quote downloaded",
    receiverAccount: "GB29 NWBK 6016 1331 9268 19",
    receiverCountry: "United Kingdom",
    forexPartner: "Barclays"
  },
  {
    id: "ORD-2023-003",
    date: "2023-10-17",
    purpose: "Family Support",
    name: "Michael Brown",
    currency: "CAD",
    fcyAmt: "7,500.00",
    fxRate: 1.36,
    fxRateUpdated: false,
    status: "Authorized",
    receiverAccount: "CA21 3080 0300 1000 0004 894",
    receiverCountry: "Canada",
    forexPartner: "Royal Bank of Canada"
  },
  {
    id: "ORD-2023-004",
    date: "2023-10-18",
    purpose: "Business Payment",
    name: "Emily Davis",
    currency: "AUD",
    fcyAmt: "12,000.00",
    fxRate: 1.52,
    fxRateUpdated: true,
    status: "Documents placed",
    receiverAccount: "AU12 3456 7890 1234 5678 901",
    receiverCountry: "Australia",
    forexPartner: "Commonwealth Bank"
  },
  {
    id: "ORD-2023-005",
    date: "2023-10-19",
    purpose: "Property Purchase",
    name: "Robert Wilson",
    currency: "EUR",
    fcyAmt: "85,000.00",
    fxRate: 1.11,
    fxRateUpdated: false,
    status: "Verified",
    receiverAccount: "FR14 2004 1010 0505 0001 3",
    receiverCountry: "France",
    forexPartner: "BNP Paribas"
  },
  {
    id: "ORD-2023-006",
    date: "2023-10-20",
    purpose: "Investment",
    name: "Jennifer Lee",
    currency: "USD",
    fcyAmt: "25,000.00",
    fxRate: 1.00,
    fxRateUpdated: true,
    status: "Pending",
    receiverAccount: "US64 1234 5678 9012 3456 7890",
    receiverCountry: "United States",
    forexPartner: "JPMorgan Chase"
  },
  {
    id: "ORD-2023-007",
    date: "2023-10-21",
    purpose: "Travel Expenses",
    name: "David Miller",
    currency: "JPY",
    fcyAmt: "500,000.00",
    fxRate: 0.0068,
    fxRateUpdated: false,
    status: "Rejected",
    receiverAccount: "JP12 3456 7890 1234 5678 9012",
    receiverCountry: "Japan",
    forexPartner: "MUFG Bank"
  },
  {
    id: "ORD-2023-008",
    date: "2023-10-22",
    purpose: "Tuition Fees",
    name: "Lisa Taylor",
    currency: "CHF",
    fcyAmt: "8,000.00",
    fxRate: 1.08,
    fxRateUpdated: true,
    status: "Completed",
    receiverAccount: "CH93 0076 2011 6238 5295 7",
    receiverCountry: "Switzerland",
    forexPartner: "UBS"
  }
];