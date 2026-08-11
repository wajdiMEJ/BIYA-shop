/*
  Warnings:

  - You are about to drop the column `comparePrice` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "comparePrice",
ADD COLUMN     "salePrice" DECIMAL(10,2);
