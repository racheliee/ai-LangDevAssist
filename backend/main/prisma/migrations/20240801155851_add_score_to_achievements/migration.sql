/*
  Warnings:

  - You are about to drop the column `description` on the `achievements` table. All the data in the column will be lost.
  - Added the required column `score` to the `achievements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "achievements" DROP COLUMN "description",
ADD COLUMN     "score" INTEGER NOT NULL;
