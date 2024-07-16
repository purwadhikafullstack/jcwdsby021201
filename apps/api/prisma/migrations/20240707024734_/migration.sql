/*
  Warnings:

  - The values [COMPLETED] on the enum `mutations_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `mutations` MODIFY `status` ENUM('PENDING', 'CANCELED', 'APPROVED', 'REJECTED') NOT NULL;
