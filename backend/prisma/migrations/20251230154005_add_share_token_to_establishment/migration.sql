/*
  Warnings:

  - A unique constraint covering the columns `[shareToken]` on the table `Establishment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Establishment" ADD COLUMN     "shareToken" TEXT,
ADD COLUMN     "shareTokenExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Establishment_shareToken_key" ON "Establishment"("shareToken");
