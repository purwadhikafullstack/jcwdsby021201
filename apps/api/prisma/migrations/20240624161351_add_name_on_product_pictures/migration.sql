/*
  Warnings:

  - Added the required column `name` to the `product_pictures` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product_pictures` ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `products` MODIFY `description` TEXT NULL;
