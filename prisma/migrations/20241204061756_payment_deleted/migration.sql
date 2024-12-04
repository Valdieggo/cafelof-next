/*
  Warnings:

  - You are about to drop the column `payment_id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `order_detail_name` on the `OrderDetail` table. All the data in the column will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `card_last_four` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `installments_number` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_type_code` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `response_code` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_amount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_status` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_payment_id_fkey`;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `payment_id`,
    ADD COLUMN `authorization_code` VARCHAR(191) NULL,
    ADD COLUMN `card_last_four` VARCHAR(191) NOT NULL,
    ADD COLUMN `installments_number` INTEGER NOT NULL,
    ADD COLUMN `payment_type_code` VARCHAR(191) NOT NULL,
    ADD COLUMN `response_code` INTEGER NOT NULL,
    ADD COLUMN `transaction_amount` DOUBLE NOT NULL,
    ADD COLUMN `transaction_status` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `OrderDetail` DROP COLUMN `order_detail_name`;

-- DropTable
DROP TABLE `Payment`;
