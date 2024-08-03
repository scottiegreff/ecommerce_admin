-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "cost" DECIMAL(65,30),
ADD COLUMN     "margin" DECIMAL(65,30),
ADD COLUMN     "markup" DECIMAL(65,30),
ADD COLUMN     "profit" DECIMAL(65,30),
ADD COLUMN     "quantity" INTEGER,
ADD COLUMN     "revenue" DECIMAL(65,30);
