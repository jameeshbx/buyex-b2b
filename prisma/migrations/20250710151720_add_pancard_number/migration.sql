-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "pancardNumber" TEXT,
ALTER COLUMN "forexPartner" DROP NOT NULL;
