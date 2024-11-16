/*
  Warnings:

  - You are about to drop the column `product_categorie_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `ProductCategorie` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `product_category_id` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_product_categorie_id_fkey`;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `product_categorie_id`,
    ADD COLUMN `product_category_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `ProductCategorie`;

-- CreateTable
CREATE TABLE `ProductCategory` (
    `product_category_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_category_name` VARCHAR(191) NOT NULL,
    `product_category_description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `ProductCategory_product_category_name_key`(`product_category_name`),
    PRIMARY KEY (`product_category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Product_product_category_id_fkey` ON `Product`(`product_category_id`);

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_product_category_id_fkey` FOREIGN KEY (`product_category_id`) REFERENCES `ProductCategory`(`product_category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
