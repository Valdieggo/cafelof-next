/*
  Warnings:

  - A unique constraint covering the columns `[product_categorie_name]` on the table `ProductCategorie` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Cart` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `City` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Discount` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Inventory` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Order` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `OrderDetail` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Payment` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Product` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `ProductCategorie` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Region` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Shipment` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `UserAddress` MODIFY `updated_at` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ProductCategorie_product_categorie_name_key` ON `ProductCategorie`(`product_categorie_name`);
