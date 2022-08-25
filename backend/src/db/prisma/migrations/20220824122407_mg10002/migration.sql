/*
  Warnings:

  - You are about to drop the column `subcategory` on the `attendant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attendant" DROP COLUMN "subcategory",
ADD COLUMN     "registrationDate" TIMESTAMP(3),
ADD COLUMN     "subCategory" TEXT;
