-- CreateTable
CREATE TABLE "downloaded_quotes" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "quote" JSONB NOT NULL,
    "calculations" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "downloaded_quotes_pkey" PRIMARY KEY ("id")
);
