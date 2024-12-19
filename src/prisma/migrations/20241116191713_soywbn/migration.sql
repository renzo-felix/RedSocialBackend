/*
  Warnings:

  - You are about to drop the column `CommentarioUser` on the `Comentario` table. All the data in the column will be lost.
  - Added the required column `ComentarioUser` to the `Comentario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comentario" DROP COLUMN "CommentarioUser",
ADD COLUMN     "ComentarioUser" TEXT NOT NULL;
