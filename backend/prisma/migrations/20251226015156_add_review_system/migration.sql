-- CreateEnum
CREATE TYPE "ReviewFormType" AS ENUM ('DURING_CLASS', 'AFTER_CLASS');

-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('STARS', 'RADIO', 'CHECKBOX', 'TEXTAREA');

-- CreateTable
CREATE TABLE "ReviewForm" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "ReviewFormType" NOT NULL,
    "classId" TEXT NOT NULL,
    "subjectId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewFormField" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "FieldType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "options" JSONB,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewFormField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "studentId" TEXT,
    "sessionId" TEXT,
    "publicLink" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewResponse" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReviewForm_classId_idx" ON "ReviewForm"("classId");

-- CreateIndex
CREATE INDEX "ReviewForm_subjectId_idx" ON "ReviewForm"("subjectId");

-- CreateIndex
CREATE INDEX "ReviewFormField_formId_idx" ON "ReviewFormField"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_publicLink_key" ON "Review"("publicLink");

-- CreateIndex
CREATE INDEX "Review_formId_idx" ON "Review"("formId");

-- CreateIndex
CREATE INDEX "Review_studentId_idx" ON "Review"("studentId");

-- CreateIndex
CREATE INDEX "ReviewResponse_reviewId_idx" ON "ReviewResponse"("reviewId");

-- CreateIndex
CREATE INDEX "ReviewResponse_fieldId_idx" ON "ReviewResponse"("fieldId");

-- AddForeignKey
ALTER TABLE "ReviewForm" ADD CONSTRAINT "ReviewForm_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewForm" ADD CONSTRAINT "ReviewForm_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewFormField" ADD CONSTRAINT "ReviewFormField_formId_fkey" FOREIGN KEY ("formId") REFERENCES "ReviewForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_formId_fkey" FOREIGN KEY ("formId") REFERENCES "ReviewForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewResponse" ADD CONSTRAINT "ReviewResponse_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewResponse" ADD CONSTRAINT "ReviewResponse_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "ReviewFormField"("id") ON DELETE CASCADE ON UPDATE CASCADE;
