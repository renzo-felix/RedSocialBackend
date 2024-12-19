-- DropForeignKey
ALTER TABLE "Comentario" DROP CONSTRAINT "Comentario_CompanyId_fkey";

-- DropForeignKey
ALTER TABLE "Comentario" DROP CONSTRAINT "Comentario_PostId_fkey";

-- DropForeignKey
ALTER TABLE "Comentario" DROP CONSTRAINT "Comentario_PracticeId_fkey";

-- DropForeignKey
ALTER TABLE "Comentario" DROP CONSTRAINT "Comentario_StudentId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyProfile" DROP CONSTRAINT "CompanyProfile_CompanyUserId_fkey";

-- DropForeignKey
ALTER TABLE "PostUser" DROP CONSTRAINT "PostUser_CompanyId_fkey";

-- DropForeignKey
ALTER TABLE "PostUser" DROP CONSTRAINT "PostUser_StudentId_fkey";

-- DropForeignKey
ALTER TABLE "Reaccion" DROP CONSTRAINT "Reaccion_CompanyId_fkey";

-- DropForeignKey
ALTER TABLE "Reaccion" DROP CONSTRAINT "Reaccion_PostId_fkey";

-- DropForeignKey
ALTER TABLE "Reaccion" DROP CONSTRAINT "Reaccion_StudentId_fkey";

-- AddForeignKey
ALTER TABLE "CompanyProfile" ADD CONSTRAINT "CompanyProfile_CompanyUserId_fkey" FOREIGN KEY ("CompanyUserId") REFERENCES "CompanyUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostUser" ADD CONSTRAINT "PostUser_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "CompanyProfile"("CompanyUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostUser" ADD CONSTRAINT "PostUser_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "StudentProfile"("studentUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaccion" ADD CONSTRAINT "Reaccion_PostId_fkey" FOREIGN KEY ("PostId") REFERENCES "PostUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaccion" ADD CONSTRAINT "Reaccion_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "StudentProfile"("studentUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaccion" ADD CONSTRAINT "Reaccion_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "CompanyProfile"("CompanyUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "CompanyProfile"("CompanyUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "StudentProfile"("studentUserId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_PostId_fkey" FOREIGN KEY ("PostId") REFERENCES "PostUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_PracticeId_fkey" FOREIGN KEY ("PracticeId") REFERENCES "Practice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
