-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "Message" TEXT NOT NULL,
    "TypeNotification" TEXT NOT NULL,
    "CreateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CompanyNotiId" INTEGER,
    "PracticeNotiId" INTEGER,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyUser" (
    "id" SERIAL NOT NULL,
    "Username" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "CompanyUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyPerfil" (
    "Sunac" TEXT NOT NULL,
    "GitHub" TEXT,
    "IndustrySector" TEXT NOT NULL,
    "imageURL" TEXT,
    "PhoneNumber" TEXT,
    "CompanyUserId" INTEGER NOT NULL,

    CONSTRAINT "CompanyPerfil_pkey" PRIMARY KEY ("CompanyUserId")
);

-- CreateTable
CREATE TABLE "StudentUser" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "StudentUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentProfile" (
    "Institute" TEXT NOT NULL,
    "GitHub" TEXT,
    "Linkedin" TEXT,
    "imageURL" TEXT,
    "PhoneNumber" TEXT,
    "studentUserId" INTEGER NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("studentUserId")
);

-- CreateTable
CREATE TABLE "Fields" (
    "id" SERIAL NOT NULL,
    "FieldName" TEXT NOT NULL,
    "Description" TEXT,

    CONSTRAINT "Fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" SERIAL NOT NULL,
    "DateLimite" TIMESTAMP(3) NOT NULL,
    "DateInit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Vacancies" INTEGER NOT NULL,
    "RequireHours" INTEGER NOT NULL,
    "CompanyId" INTEGER NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectUsers" (
    "id" SERIAL NOT NULL,
    "NameProject" TEXT NOT NULL,
    "Description" TEXT,
    "Repository" TEXT NOT NULL,
    "UserProjectId" INTEGER NOT NULL,

    CONSTRAINT "ProjectUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Practice" (
    "id" SERIAL NOT NULL,
    "Finalized" BOOLEAN NOT NULL DEFAULT false,
    "InitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CompanyId" INTEGER NOT NULL,

    CONSTRAINT "Practice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentOnPractice" (
    "UserId" INTEGER NOT NULL,
    "PracticeId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentOnPractice_pkey" PRIMARY KEY ("UserId","PracticeId")
);

-- CreateTable
CREATE TABLE "StudentOnOffers" (
    "UserId" INTEGER NOT NULL,
    "OffersId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentOnOffers_pkey" PRIMARY KEY ("UserId","OffersId")
);

-- CreateTable
CREATE TABLE "OfferOnFields" (
    "FieldId" INTEGER NOT NULL,
    "OffersId" INTEGER NOT NULL,

    CONSTRAINT "OfferOnFields_pkey" PRIMARY KEY ("FieldId","OffersId")
);

-- CreateTable
CREATE TABLE "StudentOnField" (
    "UserId" INTEGER NOT NULL,
    "FieldId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentOnField_pkey" PRIMARY KEY ("UserId","FieldId")
);

-- CreateTable
CREATE TABLE "Follows" (
    "FollowedById" INTEGER NOT NULL,
    "FollowingId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follows_pkey" PRIMARY KEY ("FollowedById","FollowingId")
);

-- CreateTable
CREATE TABLE "StudentOnNotification" (
    "StudentId" INTEGER NOT NULL,
    "NotificationId" INTEGER NOT NULL,

    CONSTRAINT "StudentOnNotification_pkey" PRIMARY KEY ("StudentId","NotificationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanyPerfil_CompanyUserId_key" ON "CompanyPerfil"("CompanyUserId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_studentUserId_key" ON "StudentProfile"("studentUserId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_CompanyNotiId_fkey" FOREIGN KEY ("CompanyNotiId") REFERENCES "CompanyPerfil"("CompanyUserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_PracticeNotiId_fkey" FOREIGN KEY ("PracticeNotiId") REFERENCES "Practice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyPerfil" ADD CONSTRAINT "CompanyPerfil_CompanyUserId_fkey" FOREIGN KEY ("CompanyUserId") REFERENCES "CompanyUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_studentUserId_fkey" FOREIGN KEY ("studentUserId") REFERENCES "StudentUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "CompanyPerfil"("CompanyUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUsers" ADD CONSTRAINT "ProjectUsers_UserProjectId_fkey" FOREIGN KEY ("UserProjectId") REFERENCES "StudentProfile"("studentUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Practice" ADD CONSTRAINT "Practice_CompanyId_fkey" FOREIGN KEY ("CompanyId") REFERENCES "CompanyPerfil"("CompanyUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentOnPractice" ADD CONSTRAINT "StudentOnPractice_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "StudentProfile"("studentUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentOnPractice" ADD CONSTRAINT "StudentOnPractice_PracticeId_fkey" FOREIGN KEY ("PracticeId") REFERENCES "Practice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentOnOffers" ADD CONSTRAINT "StudentOnOffers_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "StudentProfile"("studentUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentOnOffers" ADD CONSTRAINT "StudentOnOffers_OffersId_fkey" FOREIGN KEY ("OffersId") REFERENCES "Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferOnFields" ADD CONSTRAINT "OfferOnFields_FieldId_fkey" FOREIGN KEY ("FieldId") REFERENCES "Fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferOnFields" ADD CONSTRAINT "OfferOnFields_OffersId_fkey" FOREIGN KEY ("OffersId") REFERENCES "Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentOnField" ADD CONSTRAINT "StudentOnField_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "StudentProfile"("studentUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentOnField" ADD CONSTRAINT "StudentOnField_FieldId_fkey" FOREIGN KEY ("FieldId") REFERENCES "Fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_FollowedById_fkey" FOREIGN KEY ("FollowedById") REFERENCES "StudentProfile"("studentUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follows" ADD CONSTRAINT "Follows_FollowingId_fkey" FOREIGN KEY ("FollowingId") REFERENCES "StudentProfile"("studentUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentOnNotification" ADD CONSTRAINT "StudentOnNotification_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "StudentProfile"("studentUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentOnNotification" ADD CONSTRAINT "StudentOnNotification_NotificationId_fkey" FOREIGN KEY ("NotificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;