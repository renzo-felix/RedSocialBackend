-- AlterTable
ALTER TABLE "Comentario" ADD COLUMN     "SobreEmpresaId" INTEGER;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_SobreEmpresaId_fkey" FOREIGN KEY ("SobreEmpresaId") REFERENCES "CompanyProfile"("CompanyUserId") ON DELETE CASCADE ON UPDATE CASCADE;
