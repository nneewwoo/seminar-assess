/*
  Warnings:

  - You are about to drop the column `family_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `given_name` on the `users` table. All the data in the column will be lost.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "family_name",
DROP COLUMN "given_name",
ADD COLUMN     "name" TEXT NOT NULL;
