export interface ForexPartner {
  accountNumber: string;
  accountName: string;
  bankName: string;
  ifscCode: string;
  branch: string;
  email: string;
}


export const forexPartnerData = [
  {
    accountNumber: "35544886567",
    accountName: "Ebix Cash World Money Pvt Ltd",
    bankName: "State Bank of India",
    ifscCode: "SBIN0014914",
    branch: "Kalina, Mumbai",
    email: "digitalfxsupport@ebixcash.com",
  },
  {
    accountNumber: "WALLST17960000",
    accountName: "Wsfx Global Pay Ltd",
    bankName: "HDFC BANK",
    ifscCode: "HDFC0001372",
    branch: "Mumbai",
    email: "kochi@wsfx.in",
  },
  {
    accountNumber: "50200004078768",
    accountName: "NIUM Forex India Pvt Ltd",
    bankName: "HDFC",
    ifscCode: "HDFC0001208",
    branch: "HDFC Banglore Branch",
    email: "trivandrum.nt@niumforex.com",
  }
  
];