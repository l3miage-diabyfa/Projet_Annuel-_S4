/*
  Warnings:

  - Added the required column `classCount` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "classCount",
ADD COLUMN     "classCount" INTEGER NOT NULL;
