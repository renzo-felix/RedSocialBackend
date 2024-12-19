-- DropForeignKey
ALTER TABLE "Reaccion" DROP CONSTRAINT "Reaccion_StudenId_fkey";

-- AlterTable
ALTER TABLE "Reaccion" ADD COLUMN     "CompanyId" INTEGER,
ALTER COLUMN "StudenId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Reaccion" ADD CONSTRAINT "Reaccion_StudenId_fkey" FOREIGN KEY ("StudenId") REFERENCES "StudentProfile"("studentUserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaccion" ADD CONSTRAINT "Reaccion_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "CompanyProfile"("CompanyUserId") ON DELETE SET NULL ON UPDATE CASCADE;
