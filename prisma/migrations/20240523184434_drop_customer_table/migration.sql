/*
  Warnings:

  - You are about to drop the column `customerId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_customerId_fkey";

-- DropIndex
DROP INDEX "OrderItem_customerId_idx";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "customerId";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "customerId";

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "customerId";

-- DropTable
DROP TABLE "Customer";
