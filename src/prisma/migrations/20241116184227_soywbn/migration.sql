/*
  Warnings:

  - You are about to drop the column `StudenId` on the `Reaccion` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reaccion" DROP CONSTRAINT "Reaccion_StudenId_fkey";

-- AlterTable
ALTER TABLE "Reaccion" DROP COLUMN "StudenId",
ADD COLUMN     "StudentId" INTEGER;

-- AddForeignKey
ALTER TABLE "Reaccion" ADD CONSTRAINT "Reaccion_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "StudentProfile"("studentUserId") ON DELETE SET NULL ON UPDATE CASCADE;
