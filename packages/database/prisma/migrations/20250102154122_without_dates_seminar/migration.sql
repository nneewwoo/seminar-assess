/*
  Warnings:

  - You are about to drop the column `ends_at` on the `seminars` table. All the data in the column will be lost.
  - You are about to drop the column `starts_at` on the `seminars` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "seminars" DROP COLUMN "ends_at",
DROP COLUMN "starts_at";
