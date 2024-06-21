/*
  Warnings:

  - Made the column `price` on table `Service` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "price" SET NOT NULL;
