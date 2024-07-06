/*
  Warnings:

  - Added the required column `productId` to the `mutations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `journal_mutations` DROP FOREIGN KEY `journal_mutations_warehouseId_fkey`;

-- AlterTable
ALTER TABLE `journal_mutations` MODIFY `warehouseId` INTEGER NULL;

-- AlterTable
ALTER TABLE `mutations` ADD COLUMN `productId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `mutations` ADD CONSTRAINT `mutations_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journal_mutations` ADD CONSTRAINT `journal_mutations_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
