/*
  Warnings:

  - A unique constraint covering the columns `[product_slug]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `product_slug` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "product_slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_product_slug_key" ON "Product"("product_slug");
