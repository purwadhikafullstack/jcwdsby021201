/*
  Warnings:

  - A unique constraint covering the columns `[productId,warehouseId]` on the table `product_warehouses` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `product_warehouses` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `product_warehouses_productId_warehouseId_key` ON `product_warehouses`(`productId`, `warehouseId`);
