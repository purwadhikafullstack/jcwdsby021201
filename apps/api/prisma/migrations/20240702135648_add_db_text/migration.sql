/*
  Warnings:

  - Added the required column `description` to the `journal_mutations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `journal_products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `addresses` MODIFY `address` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `journal_mutations` ADD COLUMN `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `journal_products` ADD COLUMN `description` TEXT NOT NULL;
