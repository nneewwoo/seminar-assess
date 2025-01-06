-- CreateTable
CREATE TABLE "Participation" (
    "id" TEXT NOT NULL,
    "voted" BOOLEAN NOT NULL,
    "answered_pre" BOOLEAN NOT NULL,
    "answered_post" BOOLEAN NOT NULL,
    "attended_seminar" BOOLEAN NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Participation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
