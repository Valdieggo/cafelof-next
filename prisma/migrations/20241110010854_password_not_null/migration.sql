/*
  Warnings:

  - Made the column `user_password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `user_password` VARCHAR(191) NOT NULL;
