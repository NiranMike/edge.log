/*
  Warnings:

  - A unique constraint covering the columns `[lemonSqueezyCustomerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isPro" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lemonSqueezyCustomerId" TEXT;

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lemonSqueezyId" TEXT NOT NULL,
    "lemonSqueezyCustomerId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "renewsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_lemonSqueezyId_key" ON "Subscription"("lemonSqueezyId");

-- CreateIndex
CREATE INDEX "Subscription_lemonSqueezyId_idx" ON "Subscription"("lemonSqueezyId");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_lemonSqueezyCustomerId_key" ON "User"("lemonSqueezyCustomerId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
