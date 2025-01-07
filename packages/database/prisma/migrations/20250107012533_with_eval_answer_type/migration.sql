/*
  Warnings:

  - Added the required column `type` to the `evaluation_answers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "evaluation_answers" ADD COLUMN     "type" "Eval" NOT NULL;
