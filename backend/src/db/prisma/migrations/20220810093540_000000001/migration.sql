-- CreateEnum
CREATE TYPE "ColumnType" AS ENUM ('SEATMAP', 'PADDING');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('REDEEMED', 'ACTIVE');

-- CreateEnum
CREATE TYPE "SeatType" AS ENUM ('REGULAR', 'VIP');

-- CreateEnum
CREATE TYPE "ReceiptStatus" AS ENUM ('ISSUED', 'NOTISSUED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAYED', 'CANCELED', 'PENDING', 'TOBERETURNED');

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "normalizedUsername" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "accountLockedOut" BOOLEAN NOT NULL DEFAULT false,
    "accessFailedCount" INTEGER NOT NULL DEFAULT 0,
    "phoneNumber" TEXT NOT NULL,
    "phoneNumberConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "registrantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userRoleId" INTEGER NOT NULL,
    "address" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticketvalidatoruser" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "normalizedUsername" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "accountLockedOut" BOOLEAN NOT NULL DEFAULT false,
    "accessFailedCount" INTEGER NOT NULL DEFAULT 0,
    "phoneNumber" TEXT NOT NULL,
    "phoneNumberConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "registrantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address" TEXT,

    CONSTRAINT "ticketvalidatoruser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "synopsis" TEXT NOT NULL,
    "tags" TEXT[],
    "runtime" INTEGER NOT NULL,
    "posterImg" TEXT NOT NULL,
    "eventOrganizer" TEXT NOT NULL,
    "eventAdderId" TEXT NOT NULL,
    "trailerLink" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventhall" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "eventhall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seatcolumn" (
    "id" TEXT NOT NULL,
    "columnName" TEXT NOT NULL,
    "columnOrder" INTEGER NOT NULL,
    "columnType" "ColumnType" NOT NULL,
    "eventHallRegularId" TEXT,

    CONSTRAINT "seatcolumn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seat" (
    "id" TEXT NOT NULL,
    "seatName" TEXT NOT NULL,
    "seatColumnId" TEXT NOT NULL,
    "seatType" "SeatType" NOT NULL,

    CONSTRAINT "seat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "showtime" (
    "id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "eventHallId" TEXT NOT NULL,
    "eventEventScheduleId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "showtime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventschedule" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "eventId" TEXT NOT NULL,
    "regularTicketPrice" DOUBLE PRECISION NOT NULL DEFAULT 80,

    CONSTRAINT "eventschedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventticket" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referenceNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT,
    "paymentStatus" "PaymentStatus" NOT NULL,
    "showTimeId" TEXT,

    CONSTRAINT "eventticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ticketsonseats" (
    "eventTicketId" TEXT NOT NULL,
    "seatId" TEXT NOT NULL,
    "ticketKey" TEXT NOT NULL,
    "ticketStatus" "TicketStatus" NOT NULL DEFAULT E'ACTIVE',
    "redeemdAt" TIMESTAMP(3),
    "ticketValidatorUserId" TEXT,
    "receiptStatus" "ReceiptStatus" NOT NULL DEFAULT E'NOTISSUED',
    "fsNumber" TEXT,

    CONSTRAINT "ticketsonseats_pkey" PRIMARY KEY ("eventTicketId","seatId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_normalizedUsername_key" ON "users"("normalizedUsername");

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ticketvalidatoruser_username_key" ON "ticketvalidatoruser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ticketvalidatoruser_normalizedUsername_key" ON "ticketvalidatoruser"("normalizedUsername");

-- CreateIndex
CREATE UNIQUE INDEX "ticketvalidatoruser_phoneNumber_key" ON "ticketvalidatoruser"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "event_title_key" ON "event"("title");

-- CreateIndex
CREATE UNIQUE INDEX "eventticket_referenceNumber_key" ON "eventticket"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ticketsonseats_ticketKey_key" ON "ticketsonseats"("ticketKey");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_userRoleId_fkey" FOREIGN KEY ("userRoleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_registrantId_fkey" FOREIGN KEY ("registrantId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticketvalidatoruser" ADD CONSTRAINT "ticketvalidatoruser_registrantId_fkey" FOREIGN KEY ("registrantId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_eventAdderId_fkey" FOREIGN KEY ("eventAdderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seatcolumn" ADD CONSTRAINT "seatcolumn_eventHallRegularId_fkey" FOREIGN KEY ("eventHallRegularId") REFERENCES "eventhall"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seat" ADD CONSTRAINT "seat_seatColumnId_fkey" FOREIGN KEY ("seatColumnId") REFERENCES "seatcolumn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "showtime" ADD CONSTRAINT "showtime_eventHallId_fkey" FOREIGN KEY ("eventHallId") REFERENCES "eventhall"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "showtime" ADD CONSTRAINT "showtime_eventEventScheduleId_fkey" FOREIGN KEY ("eventEventScheduleId") REFERENCES "eventschedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventschedule" ADD CONSTRAINT "eventschedule_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventticket" ADD CONSTRAINT "eventticket_showTimeId_fkey" FOREIGN KEY ("showTimeId") REFERENCES "showtime"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticketsonseats" ADD CONSTRAINT "ticketsonseats_ticketValidatorUserId_fkey" FOREIGN KEY ("ticketValidatorUserId") REFERENCES "ticketvalidatoruser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticketsonseats" ADD CONSTRAINT "ticketsonseats_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ticketsonseats" ADD CONSTRAINT "ticketsonseats_eventTicketId_fkey" FOREIGN KEY ("eventTicketId") REFERENCES "eventticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
