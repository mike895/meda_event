/*
  Warnings:

  - Added the required column `posterImg` to the `speakers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "speakers" ADD COLUMN     "posterImg" TEXT NOT NULL;
