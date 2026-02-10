/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `aa_0_admin_db` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `aa_0_admin_db` ADD COLUMN `email` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `admin_login_history` ADD COLUMN `logoutTime` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `lastLeftId` INTEGER NULL,
    ADD COLUMN `lastRightId` INTEGER NULL,
    ADD COLUMN `leftChildId` INTEGER NULL,
    ADD COLUMN `rightChildId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `aa_0_admin_db_email_key` ON `aa_0_admin_db`(`email`);
