/*
  Warnings:

  - You are about to drop the `attendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_attendantId_fkey";

-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_ticketValidatorUserId_fkey";

-- AlterTable
ALTER TABLE "attendant" ADD COLUMN     "redeemdAt" TIMESTAMP(3),
ADD COLUMN     "role" TEXT,
ADD COLUMN     "session1" BOOLEAN DEFAULT false,
ADD COLUMN     "session2" BOOLEAN DEFAULT false,
ADD COLUMN     "session3" BOOLEAN DEFAULT false,
ADD COLUMN     "session4" BOOLEAN DEFAULT false,
ADD COLUMN     "ticketValidatorUserId" TEXT;

-- DropTable
DROP TABLE "attendance";

-- DropTable
DROP TABLE "session";

-- AddForeignKey
ALTER TABLE "attendant" ADD CONSTRAINT "attendant_ticketValidatorUserId_fkey" FOREIGN KEY ("ticketValidatorUserId") REFERENCES "ticketvalidatoruser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
