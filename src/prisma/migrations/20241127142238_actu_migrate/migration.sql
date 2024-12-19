-- DropForeignKey
ALTER TABLE "Comentario" DROP CONSTRAINT "Comentario_PostId_fkey";

-- AlterTable
ALTER TABLE "Comentario" ADD COLUMN     "PracticeId" INTEGER,
ALTER COLUMN "PostId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_PostId_fkey" FOREIGN KEY ("PostId") REFERENCES "PostUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_PracticeId_fkey" FOREIGN KEY ("PracticeId") REFERENCES "Practice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
