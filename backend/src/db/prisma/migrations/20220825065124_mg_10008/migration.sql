/*
  Warnings:

  - You are about to drop the column `loggedAt` on the `attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attendance" DROP COLUMN "loggedAt",
ADD COLUMN     "redeemdAt" TIMESTAMP(3),
ADD COLUMN     "ticketValidatorUserId" TEXT;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_ticketValidatorUserId_fkey" FOREIGN KEY ("ticketValidatorUserId") REFERENCES "ticketvalidatoruser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
