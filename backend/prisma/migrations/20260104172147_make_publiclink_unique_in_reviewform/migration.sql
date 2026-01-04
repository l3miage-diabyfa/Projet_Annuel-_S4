/*
  Warnings:

  - A unique constraint covering the columns `[publicLink]` on the table `ReviewForm` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ReviewForm_publicLink_key" ON "ReviewForm"("publicLink");
