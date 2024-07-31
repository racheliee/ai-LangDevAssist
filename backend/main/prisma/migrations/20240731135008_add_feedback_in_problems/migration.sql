/*
  Warnings:

  - Added the required column `feedback` to the `Problems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problems" ADD COLUMN     "feedback" TEXT NOT NULL;
