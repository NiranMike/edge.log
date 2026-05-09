/*
  Warnings:

  - Added the required column `screenshotUrl` to the `trades` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trades" ADD COLUMN     "screenshotUrl" TEXT;
