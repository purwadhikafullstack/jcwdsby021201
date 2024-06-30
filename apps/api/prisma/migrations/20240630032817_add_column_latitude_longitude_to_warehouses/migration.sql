/*
  Warnings:

  - You are about to drop the column `city` on the `warehouses` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `warehouses` table. All the data in the column will be lost.
  - Added the required column `cityId` to the `warehouses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `warehouses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `warehouses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provinceId` to the `warehouses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `addresses` MODIFY `address` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `warehouses` DROP COLUMN `city`,
    DROP COLUMN `province`,
    ADD COLUMN `cityId` INTEGER NOT NULL,
    ADD COLUMN `latitude` DOUBLE NOT NULL,
    ADD COLUMN `longitude` DOUBLE NOT NULL,
    ADD COLUMN `provinceId` INTEGER NOT NULL,
    MODIFY `address` TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE `warehouses` ADD CONSTRAINT `warehouses_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `provinces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `warehouses` ADD CONSTRAINT `warehouses_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `cities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
