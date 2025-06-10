-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('PAN', 'AADHAR_FRONT', 'AADHAR_BACK', 'PASSPORT_FRONT', 'PASSPORT_BACK', 'UNIVERSITY_FEE_RECEIPT', 'LOAN_SANCTION_LETTER', 'UNIVERSITY_OFFER_LETTER', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentRole" AS ENUM ('SENDER', 'BENEFICIARY', 'STUDENT');

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "foreignBankCharges" DOUBLE PRECISION NOT NULL,
    "payer" TEXT NOT NULL,
    "forexPartner" TEXT NOT NULL,
    "margin" DOUBLE PRECISION NOT NULL,
    "receiverBankCountry" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "consultancy" TEXT NOT NULL,
    "ibrRate" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "customerRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "role" "DocumentRole" NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);
