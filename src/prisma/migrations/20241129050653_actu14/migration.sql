/*
  Warnings:

  - Added the required column `ComentarioId` to the `ReaccionPuntuacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReaccionPuntuacion" ADD COLUMN     "ComentarioId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ReaccionPuntuacion" ADD CONSTRAINT "ReaccionPuntuacion_ComentarioId_fkey" FOREIGN KEY ("ComentarioId") REFERENCES "Comentario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
