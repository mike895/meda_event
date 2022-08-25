-- CreateTable
CREATE TABLE "attendant" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "memberCountry" TEXT,
    "observerCountry" TEXT,
    "signatoryCountry" TEXT,
    "prospectiveCountry" TEXT,
    "title" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "placeofEmp" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "participationMode" TEXT NOT NULL,
    "sideevents" TEXT,

    CONSTRAINT "attendant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "attendantId" TEXT NOT NULL,
    "loggedAt" TIMESTAMP(3) NOT NULL,
    "sessionName" TEXT NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_attendantId_fkey" FOREIGN KEY ("attendantId") REFERENCES "attendant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
