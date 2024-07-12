-- AlterTable
ALTER TABLE `orders` ADD COLUMN `cancellationSource` ENUM('USER', 'SYSTEM') NULL;
