/*
  Warnings:

  - You are about to drop the `Otp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Otp";

-- CreateTable
CREATE TABLE "otp_codes" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "counter" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "otp_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "otp_codes_email_key" ON "otp_codes"("email");
