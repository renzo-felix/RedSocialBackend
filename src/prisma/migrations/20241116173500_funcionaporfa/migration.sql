/*
  Warnings:

  - Added the required column `CommentarioUser` to the `Comentario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comentario" ADD COLUMN     "CommentarioUser" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reaccion" ADD COLUMN     "ReactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
