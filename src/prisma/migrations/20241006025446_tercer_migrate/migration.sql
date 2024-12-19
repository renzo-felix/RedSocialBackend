/*
  Warnings:

  - You are about to drop the `CompanyPerfil` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CompanyPerfil" DROP CONSTRAINT "CompanyPerfil_CompanyUserId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_CompanyNotiId_fkey";

-- DropForeignKey
ALTER TABLE "Offer" DROP CONSTRAINT "Offer_CompanyId_fkey";

-- DropForeignKey
ALTER TABLE "Practice" DROP CONSTRAINT "Practice_CompanyId_fkey";

-- DropTable
DROP TABLE "CompanyPerfil";

-- CreateTable
CREATE TABLE "CompanyProfile" (
    "Sunac" TEXT NOT NULL,
    "GitHub" TEXT,
    "IndustrySector" TEXT NOT NULL,
    "imageURL" TEXT,
    "PhoneNumber" TEXT,
    "CompanyUserId" INTEGER NOT NULL,

    CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("CompanyUserId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyProfile_CompanyUserId_key" ON "CompanyProfile"("CompanyUserId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_CompanyNotiId_fkey" FOREIGN KEY ("CompanyNotiId") REFERENCES "CompanyProfile"("CompanyUserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyProfile" ADD CONSTRAINT "CompanyProfile_CompanyUserId_fkey" FOREIGN KEY ("CompanyUserId") REFERENCES "CompanyUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "CompanyProfile"("CompanyUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Practice" ADD CONSTRAINT "Practice_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "CompanyProfile"("CompanyUserId") ON DELETE RESTRICT ON UPDATE CASCADE;