/*
  Warnings:

  - The `session1` column on the `attendant` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `session2` column on the `attendant` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `session3` column on the `attendant` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `session4` column on the `attendant` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "attendant" DROP COLUMN "session1",
ADD COLUMN     "session1" TIMESTAMP(3),
DROP COLUMN "session2",
ADD COLUMN     "session2" TIMESTAMP(3),
DROP COLUMN "session3",
ADD COLUMN     "session3" TIMESTAMP(3),
DROP COLUMN "session4",
ADD COLUMN     "session4" TIMESTAMP(3);
