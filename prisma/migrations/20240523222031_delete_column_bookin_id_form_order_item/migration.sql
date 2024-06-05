/*
  Warnings:

  - You are about to drop the column `bookingId` on the `OrderItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_bookingId_fkey";

-- DropIndex
DROP INDEX "OrderItem_bookingId_idx";

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "bookingId";
