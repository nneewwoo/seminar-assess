-- AlterTable
ALTER TABLE "Participation" ALTER COLUMN "voted" SET DEFAULT false,
ALTER COLUMN "answered_pre" SET DEFAULT false,
ALTER COLUMN "answered_post" SET DEFAULT false,
ALTER COLUMN "attended_seminar" SET DEFAULT false;
