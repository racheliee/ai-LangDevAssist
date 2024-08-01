/*
  Warnings:

  - You are about to drop the column `progress` on the `progresses` table. All the data in the column will be lost.
  - Added the required column `correct` to the `progresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `count` to the `progresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "progresses" DROP COLUMN "progress",
ADD COLUMN     "correct" INTEGER NOT NULL,
ADD COLUMN     "count" INTEGER NOT NULL;
