/*
  Warnings:

  - You are about to drop the `HoheAttendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HoheAttendant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HoheAttendance" DROP CONSTRAINT "HoheAttendance_hoheattendantId_fkey";

-- DropForeignKey
ALTER TABLE "HoheAttendance" DROP CONSTRAINT "HoheAttendance_ticketValidatorUserId_fkey";

-- DropTable
DROP TABLE "HoheAttendance";

-- DropTable
DROP TABLE "HoheAttendant";

-- CreateTable
CREATE TABLE "hoheAttendance" (
    "id" TEXT NOT NULL,
    "hoheattendantId" TEXT NOT NULL,
    "redeemdAt" TIMESTAMP(3),
    "ticketValidatorUserId" TEXT,

    CONSTRAINT "hoheAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hoheAttendant" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "hoheAttendant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "hoheAttendance" ADD CONSTRAINT "hoheAttendance_hoheattendantId_fkey" FOREIGN KEY ("hoheattendantId") REFERENCES "hoheAttendant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hoheAttendance" ADD CONSTRAINT "hoheAttendance_ticketValidatorUserId_fkey" FOREIGN KEY ("ticketValidatorUserId") REFERENCES "ticketvalidatoruser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
