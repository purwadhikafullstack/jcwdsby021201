/*
  Warnings:

  - You are about to drop the column `profilePicture` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `profilePicture`,
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `provider` VARCHAR(191) NULL;
