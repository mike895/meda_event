/*
  Warnings:

  - You are about to drop the column `sideevents` on the `attendant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attendant" DROP COLUMN "sideevents",
ADD COLUMN     "sideEvents" TEXT;
