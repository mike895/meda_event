/*
  Warnings:

  - You are about to drop the column `redeemdAt` on the `attendant` table. All the data in the column will be lost.
  - You are about to drop the column `session1` on the `attendant` table. All the data in the column will be lost.
  - You are about to drop the column `session2` on the `attendant` table. All the data in the column will be lost.
  - You are about to drop the column `session3` on the `attendant` table. All the data in the column will be lost.
  - You are about to drop the column `session4` on the `attendant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attendant" DROP COLUMN "redeemdAt",
DROP COLUMN "session1",
DROP COLUMN "session2",
DROP COLUMN "session3",
DROP COLUMN "session4";

-- CreateTable
CREATE TABLE "attendance" (
    "id" TEXT NOT NULL,
    "attendantId" TEXT NOT NULL,
    "redeemdAt" TIMESTAMP(3),
    "ticketValidatorUserId" TEXT,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_attendantId_fkey" FOREIGN KEY ("attendantId") REFERENCES "attendant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_ticketValidatorUserId_fkey" FOREIGN KEY ("ticketValidatorUserId") REFERENCES "ticketvalidatoruser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
