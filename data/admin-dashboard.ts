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

export const initialOrders: Order[] = [
  {
    id: "ORDER001",
    date: "2024-01-20",
    purpose: "Education",
    name: "John Doe",
    currency: "USD",
    fcyAmt: 1000,
    fxRate: 0.0,
    fxRateUpdated: false,
    status: "Received",
    receiverAccount: "1234567890",
    receiverCountry: "USA",
    forexPartner: "Partner A",
    // Add these validation fields
  currencyValidation: 'valid', // or 'invalid'
  fcyAmtValidation: 'valid',
  purposeValidation: 'valid',
  receiverAccountValidation: 'valid'
},
  
  {
    id: "ORDER002",
    date: "2024-01-21",
    purpose: "Medical",
    name: "Jane Smith",
    currency: "EUR",
    fcyAmt: 500,
    fxRate: 0.0,
    fxRateUpdated: false,
    status: "Quote downloaded",
    receiverAccount: "0987654321",
    receiverCountry: "Germany",
    forexPartner: "Partner B",
    // Add these validation fields
  currencyValidation: 'valid', // or 'invalid'
  fcyAmtValidation: 'valid',
  purposeValidation: 'valid',
  receiverAccountValidation: 'valid'

  },
  {
    id: "ORDER003",
    date: "2024-01-22",
    purpose: "Travel",
    name: "Alice Johnson",
    currency: "GBP",
    fcyAmt: 200,
    fxRate: 0.0,
    fxRateUpdated: false,
    status: "Authorized",
    receiverAccount: "6789012345",
    receiverCountry: "UK",
    forexPartner: "Partner C",
    // Add these validation fields
  currencyValidation: 'valid', // or 'invalid'
  fcyAmtValidation: 'valid',
  purposeValidation: 'valid',
  receiverAccountValidation: 'valid'
  },
  {
    id: "ORDER004",
    date: "2024-01-23",
    purpose: "Business",
    name: "Bob Williams",
    currency: "JPY",
    fcyAmt: 30000,
    fxRate: 0.0,
    fxRateUpdated: false,
    status: "Documents placed",
    receiverAccount: "5432109876",
    receiverCountry: "Japan",
    forexPartner: "Partner A",
    // Add these validation fields
  currencyValidation: 'valid', // or 'invalid'
  fcyAmtValidation: 'valid',
  purposeValidation: 'valid',
  receiverAccountValidation: 'valid'

  },
  {
    id: "ORDER005",
    date: "2024-01-24",
    purpose: "Investment",
    name: "Charlie Brown",
    currency: "CAD",
    fcyAmt: 750,
    fxRate: 0.0,
    fxRateUpdated: false,
    status: "Verified",
    receiverAccount: "2345678901",
    receiverCountry: "Canada",
    forexPartner: "Partner B",
    // Add these validation fields
  currencyValidation: 'valid', // or 'invalid'
  fcyAmtValidation: 'valid',
  purposeValidation: 'valid',
  receiverAccountValidation: 'valid'
  },
  {
    id: "ORDER006",
    date: "2024-01-25",
    purpose: "Personal",
    name: "Diana Davis",
    currency: "AUD",
    fcyAmt: 600,
    fxRate: 0.0,
    fxRateUpdated: false,
    status: "Pending",
    receiverAccount: "3456789012",
    receiverCountry: "Australia",
    forexPartner: "Partner C",
    // Add these validation fields
  currencyValidation: 'valid', // or 'invalid'
  fcyAmtValidation: 'valid',
  purposeValidation: 'valid',
  receiverAccountValidation: 'valid'

  },
  {
    id: "ORDER007",
    date: "2024-01-26",
    purpose: "Other",
    name: "Eve Miller",
    currency: "CHF",
    fcyAmt: 400,
    fxRate: 0.0,
    fxRateUpdated: false,
    status: "Rejected",
    receiverAccount: "4567890123",
    receiverCountry: "Switzerland",
    forexPartner: "Partner A",
    // Add these validation fields
  currencyValidation: 'valid', // or 'invalid'
  fcyAmtValidation: 'valid',
  purposeValidation: 'valid',
  receiverAccountValidation: 'valid'
  },
  {
    id: "ORDER008",
    date: "2024-01-27",
    purpose: "Gift",
    name: "Frank Wilson",
    currency: "SEK",
    fcyAmt: 800,
    fxRate: 0.0,
    fxRateUpdated: false,
    status: "Completed",
    receiverAccount: "7890123456",
    receiverCountry: "Sweden",
    forexPartner: "Partner B",
    // Add these validation fields
  currencyValidation: 'valid', // or 'invalid'
  fcyAmtValidation: 'valid',
  purposeValidation: 'valid',
  receiverAccountValidation: 'valid'
  },
]

export const statusOptions = [
  "Received",
  "Quote downloaded",
  "Authorized",
  "Documents placed",
  "Verified",
  "Pending",
  "Rejected",
  "Completed",
]

export const nonChangeableStatuses = [
  "Quote downloaded",
  "Documents placed",
  "Authorized",
  "Verified",
  "Rejected",
  "Completed",
]
