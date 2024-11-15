/*
  Warnings:

  - You are about to drop the column `user_firstname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_lastname` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `user_firstname`,
    DROP COLUMN `user_lastname`;
