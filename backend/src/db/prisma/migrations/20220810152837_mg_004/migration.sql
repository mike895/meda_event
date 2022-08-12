/*
  Warnings:

  - You are about to drop the column `eventEventScheduleId` on the `speakers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "speakers" DROP CONSTRAINT "speakers_eventEventScheduleId_fkey";

-- AlterTable
ALTER TABLE "speakers" DROP COLUMN "eventEventScheduleId",
ADD COLUMN     "eventScheduleId" TEXT;

-- AddForeignKey
ALTER TABLE "speakers" ADD CONSTRAINT "speakers_eventScheduleId_fkey" FOREIGN KEY ("eventScheduleId") REFERENCES "eventschedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
