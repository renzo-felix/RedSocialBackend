-- CreateTable
CREATE TABLE "ReaccionPuntuacion" (
    "id" SERIAL NOT NULL,
    "Puntuacion" INTEGER NOT NULL,
    "ReaccionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "PracticeId" INTEGER NOT NULL,
    "StudentId" INTEGER NOT NULL,

    CONSTRAINT "ReaccionPuntuacion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReaccionPuntuacion" ADD CONSTRAINT "ReaccionPuntuacion_PracticeId_fkey" FOREIGN KEY ("PracticeId") REFERENCES "Practice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReaccionPuntuacion" ADD CONSTRAINT "ReaccionPuntuacion_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "StudentProfile"("studentUserId") ON DELETE CASCADE ON UPDATE CASCADE;
