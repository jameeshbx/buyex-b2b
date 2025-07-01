/*
  Warnings:

  - Added the required column `status` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Received', 'Verified', 'Pending', 'Rejected', 'Completed', 'QuoteDownloaded', 'Authorize', 'DocumentsPlaced', 'RateExpired');

-- AlterEnum
ALTER TYPE "DocumentRole" ADD VALUE 'ORDER';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "status" "OrderStatus" NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;
