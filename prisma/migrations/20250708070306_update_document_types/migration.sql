/*
  Warnings:

  - The values [AADHAR_FRONT,AADHAR_BACK,PASSPORT_BACK,UNIVERSITY_FEE_RECEIPT] on the enum `DocumentType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DocumentType_new" AS ENUM ('PAN', 'IDENTITY', 'UNIVERSITY_OFFER_LETTER', 'PASSPORT_FRONT', 'VISA_PRP', 'VISA_INVOICE', 'FLYWIRE_INSTRUCTION', 'BLOCKED_ACCOUNT_LETTER', 'INVOICE', 'GIC_LETTER', 'LOAN_SANCTION_LETTER', 'OTHER');
ALTER TABLE "documents" ALTER COLUMN "type" TYPE "DocumentType_new" USING ("type"::text::"DocumentType_new");
ALTER TYPE "DocumentType" RENAME TO "DocumentType_old";
ALTER TYPE "DocumentType_new" RENAME TO "DocumentType";
DROP TYPE "DocumentType_old";
COMMIT;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "educationLoan" TEXT;
