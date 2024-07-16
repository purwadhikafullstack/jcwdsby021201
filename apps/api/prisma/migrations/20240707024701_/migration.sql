/*
  Warnings:

  - The values [CANCELED] on the enum `mutations_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `mutations` MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') NOT NULL;
