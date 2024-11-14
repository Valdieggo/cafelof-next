/*
  Warnings:

  - You are about to drop the column `user_email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_firstname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `user_lastname` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `User_user_email_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `user_email`,
    DROP COLUMN `user_firstname`,
    DROP COLUMN `user_lastname`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);
