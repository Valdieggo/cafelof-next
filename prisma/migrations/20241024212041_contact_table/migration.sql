/*
  Warnings:

  - The primary key for the `ContactMessage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `message` on the `ContactMessage` table. All the data in the column will be lost.
  - You are about to drop the column `message_id` on the `ContactMessage` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `ContactMessage` table. All the data in the column will be lost.
  - You are about to drop the column `user_email` on the `ContactMessage` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `ContactMessage` table. All the data in the column will be lost.
  - Added the required column `contact_form_id` to the `ContactMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contact_form_name` to the `ContactMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contact_message` to the `ContactMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contact_user_email` to the `ContactMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ContactMessage` DROP PRIMARY KEY,
    DROP COLUMN `message`,
    DROP COLUMN `message_id`,
    DROP COLUMN `subject`,
    DROP COLUMN `user_email`,
    DROP COLUMN `user_name`,
    ADD COLUMN `contact_form_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `contact_form_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `contact_message` VARCHAR(191) NOT NULL,
    ADD COLUMN `contact_user_email` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`contact_form_id`);
