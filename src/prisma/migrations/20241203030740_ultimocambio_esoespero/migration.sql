/*
  Warnings:

  - The `Cycle` column on the `StudentProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "CompanyProfile" ADD COLUMN     "InfoCorta" TEXT DEFAULT 'Sin descripción',
ADD COLUMN     "InfoLarga" TEXT DEFAULT 'Sin descripción',
ADD COLUMN     "PortadaImg" TEXT;

-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "PortadaImg" TEXT,
DROP COLUMN "Cycle",
ADD COLUMN     "Cycle" INTEGER;
