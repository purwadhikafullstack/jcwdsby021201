/*
  Warnings:

  - Made the column `shippedAt` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `orders` MODIFY `shippedAt` DATETIME(3) NOT NULL;
