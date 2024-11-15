/*
  Warnings:

  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `name` VARCHAR(191) NOT NULL,
    MODIFY `user_firstname` VARCHAR(191) NULL,
    MODIFY `user_lastname` VARCHAR(191) NULL;
