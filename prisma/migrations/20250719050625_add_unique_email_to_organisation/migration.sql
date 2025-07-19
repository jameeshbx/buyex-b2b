/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `organisations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "organisations_email_key" ON "organisations"("email");
