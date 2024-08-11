/*
  Warnings:

  - You are about to alter the column `wage` on the `Position` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `commission` on the `Position` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Position" ALTER COLUMN "wage" SET DATA TYPE INTEGER,
ALTER COLUMN "commission" SET DATA TYPE INTEGER;
