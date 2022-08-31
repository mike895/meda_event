/*
  Warnings:

  - The `registrationDate` column on the `attendant` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "attendant" DROP COLUMN "registrationDate",
ADD COLUMN     "registrationDate" TIMESTAMP(3);
