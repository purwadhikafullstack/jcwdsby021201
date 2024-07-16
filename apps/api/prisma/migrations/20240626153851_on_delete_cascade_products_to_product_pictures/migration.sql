-- DropForeignKey
ALTER TABLE `product_pictures` DROP FOREIGN KEY `product_pictures_productId_fkey`;

-- AddForeignKey
ALTER TABLE `product_pictures` ADD CONSTRAINT `product_pictures_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
