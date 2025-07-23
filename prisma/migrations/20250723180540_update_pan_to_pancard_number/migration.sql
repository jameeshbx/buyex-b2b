/*
  Warnings:

  - You are about to drop the column `pan` on the `senders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "senders" DROP COLUMN "pan",
ADD COLUMN     "pancardNumber" TEXT;
