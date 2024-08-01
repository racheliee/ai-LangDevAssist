/*
  Warnings:

  - You are about to drop the column `type` on the `progresses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "progresses" DROP COLUMN "type";

-- DropEnum
DROP TYPE "TestType";
