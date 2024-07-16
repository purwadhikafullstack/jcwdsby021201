-- CreateTable
CREATE TABLE `ShippingCost` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `originCityId` INTEGER NOT NULL,
    `destinationCityId` INTEGER NOT NULL,
    `service` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `cost` INTEGER NOT NULL,
    `etd` VARCHAR(191) NULL,

    INDEX `ShippingCost_originCityId_idx`(`originCityId`),
    INDEX `ShippingCost_destinationCityId_idx`(`destinationCityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ShippingCost` ADD CONSTRAINT `ShippingCost_originCityId_fkey` FOREIGN KEY (`originCityId`) REFERENCES `cities`(`cityId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShippingCost` ADD CONSTRAINT `ShippingCost_destinationCityId_fkey` FOREIGN KEY (`destinationCityId`) REFERENCES `cities`(`cityId`) ON DELETE RESTRICT ON UPDATE CASCADE;
