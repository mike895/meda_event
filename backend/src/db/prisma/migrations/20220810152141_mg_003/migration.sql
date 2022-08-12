-- AlterTable
ALTER TABLE "showtime" ADD COLUMN     "speakersId" TEXT;

-- CreateTable
CREATE TABLE "speakers" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "biography" TEXT NOT NULL,
    "eventEventScheduleId" TEXT,

    CONSTRAINT "speakers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "speakers" ADD CONSTRAINT "speakers_eventEventScheduleId_fkey" FOREIGN KEY ("eventEventScheduleId") REFERENCES "eventschedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "showtime" ADD CONSTRAINT "showtime_speakersId_fkey" FOREIGN KEY ("speakersId") REFERENCES "speakers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
