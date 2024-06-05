/*
  Warnings:

  - Made the column `serviceId` on table `Booking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startTime` on table `Booking` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "serviceId" SET NOT NULL,
ALTER COLUMN "startTime" SET NOT NULL;
