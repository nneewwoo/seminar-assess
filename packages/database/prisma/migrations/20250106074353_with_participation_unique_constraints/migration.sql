/*
  Warnings:

  - You are about to drop the `Participation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Participation" DROP CONSTRAINT "Participation_user_id_fkey";

-- DropTable
DROP TABLE "Participation";

-- CreateTable
CREATE TABLE "participations" (
    "id" TEXT NOT NULL,
    "voted" BOOLEAN NOT NULL DEFAULT false,
    "answered_pre" BOOLEAN NOT NULL DEFAULT false,
    "answered_post" BOOLEAN NOT NULL DEFAULT false,
    "attended_seminar" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,
    "cycle_id" TEXT NOT NULL,

    CONSTRAINT "participations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "participations_user_id_cycle_id_key" ON "participations"("user_id", "cycle_id");

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participations" ADD CONSTRAINT "participations_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "cycles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
