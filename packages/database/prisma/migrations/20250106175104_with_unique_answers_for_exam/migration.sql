/*
  Warnings:

  - A unique constraint covering the columns `[user_id,question_id,for]` on the table `answers` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "answers_user_id_question_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "answers_user_id_question_id_for_key" ON "answers"("user_id", "question_id", "for");
