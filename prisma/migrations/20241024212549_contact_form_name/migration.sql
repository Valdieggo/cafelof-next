/*
  Warnings:

  - You are about to drop the `ContactMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `ContactMessage`;

-- CreateTable
CREATE TABLE `ContactForm` (
    `contact_form_id` INTEGER NOT NULL AUTO_INCREMENT,
    `contact_form_name` VARCHAR(191) NOT NULL,
    `contact_form_message` VARCHAR(191) NOT NULL,
    `contact_form_email` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`contact_form_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
