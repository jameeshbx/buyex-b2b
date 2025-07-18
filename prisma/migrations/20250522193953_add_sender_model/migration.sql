-- CreateTable
CREATE TABLE "senders" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentEmailOriginal" TEXT NOT NULL,
    "studentEmailFake" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "nationality" TEXT NOT NULL DEFAULT 'indian',
    "relationship" TEXT NOT NULL DEFAULT 'self',
    "senderName" TEXT,
    "bankCharges" TEXT,
    "dob" TEXT,
    "senderNationality" TEXT DEFAULT 'indian',
    "senderEmail" TEXT,
    "sourceOfFunds" TEXT,
    "occupationStatus" TEXT,
    "senderAddressLine1" TEXT,
    "senderAddressLine2" TEXT,
    "senderState" TEXT,
    "senderPostalCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "senders_pkey" PRIMARY KEY ("id")
);
