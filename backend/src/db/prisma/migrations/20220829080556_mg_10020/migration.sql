-- CreateTable
CREATE TABLE "HoheAttendance" (
    "id" TEXT NOT NULL,
    "hoheattendantId" TEXT NOT NULL,
    "redeemdAt" TIMESTAMP(3),
    "ticketValidatorUserId" TEXT,

    CONSTRAINT "HoheAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HoheAttendant" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "HoheAttendant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HoheAttendance" ADD CONSTRAINT "HoheAttendance_hoheattendantId_fkey" FOREIGN KEY ("hoheattendantId") REFERENCES "HoheAttendant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoheAttendance" ADD CONSTRAINT "HoheAttendance_ticketValidatorUserId_fkey" FOREIGN KEY ("ticketValidatorUserId") REFERENCES "ticketvalidatoruser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
