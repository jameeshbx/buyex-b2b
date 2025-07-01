/*
  Warnings:

  - Added the required column `calculations` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `generatedPDF` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quote` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "calculations" JSONB NOT NULL,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "generatedPDF" TEXT NOT NULL,
ADD COLUMN     "quote" JSONB NOT NULL;
