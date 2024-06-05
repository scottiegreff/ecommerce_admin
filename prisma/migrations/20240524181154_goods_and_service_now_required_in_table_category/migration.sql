/*
  Warnings:

  - Made the column `itemType` on table `Category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "itemType" SET NOT NULL;
