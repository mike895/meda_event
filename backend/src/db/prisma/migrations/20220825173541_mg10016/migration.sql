/*
  Warnings:

  - You are about to drop the column `session` on the `attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attendance" DROP COLUMN "session",
ADD COLUMN     "sessionEvent" TEXT;
