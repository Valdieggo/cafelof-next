/*
  Warnings:

  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `OrderDetail` DROP FOREIGN KEY `OrderDetail_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `Shipment` DROP FOREIGN KEY `Shipment_order_id_fkey`;

-- AlterTable
ALTER TABLE `Order` DROP PRIMARY KEY,
    MODIFY `order_id` VARCHAR(191) NOT NULL,
    MODIFY `card_last_four` VARCHAR(191) NULL,
    MODIFY `installments_number` INTEGER NULL,
    MODIFY `payment_type_code` VARCHAR(191) NULL,
    MODIFY `response_code` INTEGER NULL,
    MODIFY `transaction_amount` INTEGER NULL,
    MODIFY `transaction_status` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`order_id`);

-- AlterTable
ALTER TABLE `OrderDetail` MODIFY `order_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Shipment` MODIFY `order_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Shipment` ADD CONSTRAINT `Shipment_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderDetail` ADD CONSTRAINT `OrderDetail_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
