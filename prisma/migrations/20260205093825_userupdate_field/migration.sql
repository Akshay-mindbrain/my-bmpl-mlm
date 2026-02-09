/*
  Warnings:

  - Added the required column `refresh_token` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `user_activity_logs_admin_id_fkey` ON `user_activity_logs`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `refresh_token` VARCHAR(191) NOT NULL;
