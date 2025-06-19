-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "beneficiaryId" TEXT,
ADD COLUMN     "senderId" TEXT;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "senders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "beneficiaries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
