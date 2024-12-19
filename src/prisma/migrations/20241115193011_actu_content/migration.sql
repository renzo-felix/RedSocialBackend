/*
  Warnings:

  - Added the required column `InfoLarga` to the `Practice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Titulo` to the `Practice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Practice" ADD COLUMN     "InfoCorta" TEXT,
ADD COLUMN     "InfoLarga" TEXT NOT NULL,
ADD COLUMN     "Titulo" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PostUser" (
    "id" SERIAL NOT NULL,
    "PublicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "TituloPost" TEXT NOT NULL,
    "Descripcion" TEXT NOT NULL,
    "ImgPostUrl" TEXT,
    "CompanyId" INTEGER,
    "StudentId" INTEGER,

    CONSTRAINT "PostUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reaccion" (
    "id" SERIAL NOT NULL,
    "TypeReaction" TEXT NOT NULL,
    "PostId" INTEGER NOT NULL,
    "StudenId" INTEGER NOT NULL,

    CONSTRAINT "Reaccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comentario" (
    "id" SERIAL NOT NULL,
    "PublicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CompanyId" INTEGER,
    "StudentId" INTEGER,
    "PostId" INTEGER NOT NULL,

    CONSTRAINT "Comentario_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostUser" ADD CONSTRAINT "PostUser_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "CompanyProfile"("CompanyUserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostUser" ADD CONSTRAINT "PostUser_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "StudentProfile"("studentUserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaccion" ADD CONSTRAINT "Reaccion_PostId_fkey" FOREIGN KEY ("PostId") REFERENCES "PostUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaccion" ADD CONSTRAINT "Reaccion_StudenId_fkey" FOREIGN KEY ("StudenId") REFERENCES "StudentProfile"("studentUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "CompanyProfile"("CompanyUserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "StudentProfile"("studentUserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_PostId_fkey" FOREIGN KEY ("PostId") REFERENCES "PostUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
