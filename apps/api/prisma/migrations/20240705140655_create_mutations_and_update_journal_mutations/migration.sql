/*
  Warnings:

  - You are about to drop the column `destinationWarehouseId` on the `journal_mutations` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `journal_mutations` table. All the data in the column will be lost.
  - You are about to drop the column `sourceWarehouseId` on the `journal_mutations` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `journal_mutations` table. All the data in the column will be lost.
  - The values [TRANSFER] on the enum `journal_mutations_transactionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `journal_products` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productWarehouseId` to the `journal_mutations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warehouseId` to the `journal_mutations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippedAt` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `journal_mutations` DROP FOREIGN KEY `journal_mutations_destinationWarehouseId_fkey`;

-- DropForeignKey
ALTER TABLE `journal_mutations` DROP FOREIGN KEY `journal_mutations_productId_fkey`;

-- DropForeignKey
ALTER TABLE `journal_mutations` DROP FOREIGN KEY `journal_mutations_sourceWarehouseId_fkey`;

-- DropForeignKey
ALTER TABLE `journal_products` DROP FOREIGN KEY `journal_products_productWarehouseId_fkey`;

-- AlterTable
ALTER TABLE `journal_mutations` DROP COLUMN `destinationWarehouseId`,
    DROP COLUMN `productId`,
    DROP COLUMN `sourceWarehouseId`,
    DROP COLUMN `status`,
    ADD COLUMN `productWarehouseId` INTEGER NOT NULL,
    ADD COLUMN `refMutationId` INTEGER NULL,
    ADD COLUMN `warehouseId` INTEGER NOT NULL,
    MODIFY `transactionType` ENUM('IN', 'OUT') NOT NULL;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `shippedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `journal_products`;

-- CreateTable
CREATE TABLE `mutations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stockRequest` INTEGER NOT NULL,
    `stockProcess` INTEGER NULL,
    `note` TEXT NULL,
    `sourceWarehouseId` INTEGER NOT NULL,
    `destinationWarehouseId` INTEGER NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mutations` ADD CONSTRAINT `mutations_sourceWarehouseId_fkey` FOREIGN KEY (`sourceWarehouseId`) REFERENCES `warehouses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mutations` ADD CONSTRAINT `mutations_destinationWarehouseId_fkey` FOREIGN KEY (`destinationWarehouseId`) REFERENCES `warehouses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journal_mutations` ADD CONSTRAINT `journal_mutations_productWarehouseId_fkey` FOREIGN KEY (`productWarehouseId`) REFERENCES `product_warehouses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journal_mutations` ADD CONSTRAINT `journal_mutations_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journal_mutations` ADD CONSTRAINT `journal_mutations_refMutationId_fkey` FOREIGN KEY (`refMutationId`) REFERENCES `mutations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
