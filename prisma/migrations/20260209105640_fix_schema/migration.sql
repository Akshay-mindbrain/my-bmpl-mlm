-- DropIndex
DROP INDEX `user_activity_logs_adminId_fkey` ON `user_activity_logs`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `refresh_token` VARCHAR(191) NULL;
