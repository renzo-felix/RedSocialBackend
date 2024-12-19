/*
  Warnings:

  - You are about to drop the column `ComentarioId` on the `ReaccionPuntuacion` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReaccionPuntuacion" DROP CONSTRAINT "ReaccionPuntuacion_ComentarioId_fkey";

-- AlterTable
ALTER TABLE "ReaccionPuntuacion" DROP COLUMN "ComentarioId";
