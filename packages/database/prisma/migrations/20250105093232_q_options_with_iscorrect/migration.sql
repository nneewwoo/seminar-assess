/*
  Warnings:

  - Added the required column `is_correct` to the `question_options` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "question_options" ADD COLUMN     "is_correct" BOOLEAN NOT NULL;
