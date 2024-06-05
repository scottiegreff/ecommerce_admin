-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('GOODS', 'SERVICES');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "itemType" "ItemType";
