-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_user_address_id_fkey`;

-- AlterTable
ALTER TABLE `User` MODIFY `user_address_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_user_address_id_fkey` FOREIGN KEY (`user_address_id`) REFERENCES `UserAddress`(`user_address_id`) ON DELETE SET NULL ON UPDATE CASCADE;
