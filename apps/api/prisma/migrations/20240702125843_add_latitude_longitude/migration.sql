/*
  Warnings:

  - You are about to drop the column `city` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `cityId` on the `cities` table. All the data in the column will be lost.
  - You are about to drop the column `provinceId` on the `provinces` table. All the data in the column will be lost.
  - Added the required column `cityId` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provinceId` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Made the column `latitude` on table `addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `latitude` on table `warehouses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `warehouses` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `cities` DROP FOREIGN KEY `cities_provinceId_fkey`;

-- DropIndex
DROP INDEX `cities_cityId_key` ON `cities`;

-- DropIndex
DROP INDEX `provinces_provinceId_key` ON `provinces`;

-- AlterTable
ALTER TABLE `addresses` DROP COLUMN `city`,
    DROP COLUMN `province`,
    ADD COLUMN `cityId` INTEGER NOT NULL,
    ADD COLUMN `provinceId` INTEGER NOT NULL,
    MODIFY `latitude` DOUBLE NOT NULL,
    MODIFY `longitude` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `cities` DROP COLUMN `cityId`,
    MODIFY `id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `provinces` DROP COLUMN `provinceId`,
    MODIFY `id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `warehouses` MODIFY `latitude` DOUBLE NOT NULL,
    MODIFY `longitude` DOUBLE NOT NULL;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `provinces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addresses` ADD CONSTRAINT `addresses_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `cities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cities` ADD CONSTRAINT `cities_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `provinces`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
