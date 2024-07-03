/*
  Warnings:

  - You are about to drop the `shippingcost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `shippingcost` DROP FOREIGN KEY `ShippingCost_destinationCityId_fkey`;

-- DropForeignKey
ALTER TABLE `shippingcost` DROP FOREIGN KEY `ShippingCost_originCityId_fkey`;

-- DropTable
DROP TABLE `shippingcost`;
