/*
  Warnings:

  - You are about to drop the column `placeofEmp` on the `attendant` table. All the data in the column will be lost.
  - Added the required column `organization` to the `attendant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "attendant" DROP COLUMN "placeofEmp",
ADD COLUMN     "organization" TEXT NOT NULL;
