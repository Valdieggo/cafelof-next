/*
  Warnings:

  - You are about to drop the column `cart_id` on the `OrderDetail` table. All the data in the column will be lost.
  - Added the required column `price` to the `OrderDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `OrderDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `OrderDetail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderDetail" DROP CONSTRAINT "OrderDetail_cart_id_fkey";

-- DropIndex
DROP INDEX "OrderDetail_cart_id_idx";

-- AlterTable
ALTER TABLE "OrderDetail" DROP COLUMN "cart_id",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "product_id" INTEGER NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "OrderDetail_product_id_idx" ON "OrderDetail"("product_id");

-- AddForeignKey
ALTER TABLE "OrderDetail" ADD CONSTRAINT "OrderDetail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
