/*
  Warnings:

  - You are about to drop the column `content` on the `Problems` table. All the data in the column will be lost.
  - You are about to drop the column `voice_path` on the `Problems` table. All the data in the column will be lost.
  - Added the required column `imagePath` to the `Problems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isCorrect` to the `Problems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question` to the `Problems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wholeText` to the `Problems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problems" DROP COLUMN "content",
DROP COLUMN "voice_path",
ADD COLUMN     "imagePath" TEXT NOT NULL,
ADD COLUMN     "isCorrect" BOOLEAN NOT NULL,
ADD COLUMN     "question" TEXT NOT NULL,
ADD COLUMN     "voicePath" TEXT,
ADD COLUMN     "wholeText" TEXT NOT NULL;
