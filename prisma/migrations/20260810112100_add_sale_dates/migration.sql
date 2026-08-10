/*
  Warnings:

  - You are about to drop the column `salePrice` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "salePrice",
ADD COLUMN     "saleEndDate" TIMESTAMP(3),
ADD COLUMN     "saleStartDate" TIMESTAMP(3);
