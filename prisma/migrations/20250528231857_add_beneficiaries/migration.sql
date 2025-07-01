-- CreateTable
CREATE TABLE "beneficiaries" (
    "id" TEXT NOT NULL,
    "receiverFullName" TEXT NOT NULL,
    "receiverCountry" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "receiverBank" TEXT NOT NULL,
    "receiverBankAddress" TEXT NOT NULL,
    "receiverBankCountry" TEXT NOT NULL,
    "receiverAccount" TEXT NOT NULL,
    "receiverBankSwiftCode" TEXT NOT NULL,
    "iban" TEXT,
    "sortCode" TEXT,
    "transitNumber" TEXT,
    "bsbCode" TEXT,
    "routingNumber" TEXT,
    "anyIntermediaryBank" TEXT NOT NULL DEFAULT 'NO',
    "intermediaryBankName" TEXT,
    "intermediaryBankAccountNo" TEXT,
    "intermediaryBankIBAN" TEXT,
    "intermediaryBankSwiftCode" TEXT,
    "totalRemittance" TEXT NOT NULL,
    "field70" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beneficiaries_pkey" PRIMARY KEY ("id")
);
