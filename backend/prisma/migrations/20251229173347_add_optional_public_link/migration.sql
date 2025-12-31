-- AlterTable
ALTER TABLE "ReviewForm" ADD COLUMN     "publicLink" TEXT;

-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "afterFormId" TEXT,
ADD COLUMN     "duringFormId" TEXT;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_duringFormId_fkey" FOREIGN KEY ("duringFormId") REFERENCES "ReviewForm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_afterFormId_fkey" FOREIGN KEY ("afterFormId") REFERENCES "ReviewForm"("id") ON DELETE SET NULL ON UPDATE CASCADE;
