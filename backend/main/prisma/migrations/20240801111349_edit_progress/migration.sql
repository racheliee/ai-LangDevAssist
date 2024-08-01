/*
  Warnings:

  - You are about to drop the column `count` on the `progresses` table. All the data in the column will be lost.
  - Added the required column `total` to the `progresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "progresses" DROP COLUMN "count",
ADD COLUMN     "total" INTEGER NOT NULL;
