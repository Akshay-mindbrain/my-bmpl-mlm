/*
  Warnings:

  - You are about to drop the column `adminId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `user_activity_logs` DROP FOREIGN KEY `user_activity_logs_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_adminId_fkey`;

-- DropIndex
DROP INDEX `users_username_key` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `adminId`,
    DROP COLUMN `refresh_token`,
    DROP COLUMN `username`,
    ADD COLUMN `createdBy` VARCHAR(191) NULL,
    ADD COLUMN `member_Id` VARCHAR(191) NULL,
    ADD COLUMN `updatedBy` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_leftChildId_fkey` FOREIGN KEY (`leftChildId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_rightChildId_fkey` FOREIGN KEY (`rightChildId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
