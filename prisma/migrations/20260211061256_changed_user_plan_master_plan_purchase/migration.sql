/*
  Warnings:

  - You are about to alter the column `status` on the `aa_0_admin_db` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1)` to `Enum(EnumId(9))`.
  - You are about to drop the column `logout_time` on the `admin_login_history` table. All the data in the column will be lost.
  - You are about to drop the column `admin_id` on the `user_activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `user_activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `user_activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `member_Id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `packages` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[memberId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adminId` to the `user_activity_logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user_activity_logs` DROP FOREIGN KEY `user_activity_logs_user_id_fkey`;

-- AlterTable
ALTER TABLE `aa_0_admin_db` MODIFY `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE `admin_login_history` DROP COLUMN `logout_time`,
    ADD COLUMN `logoutTime` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `kyc` ADD COLUMN `approvedByAdminId` INTEGER NULL,
    ADD COLUMN `createdByAdminId` INTEGER NULL,
    ADD COLUMN `updatedByAdminId` INTEGER NULL;

-- AlterTable
ALTER TABLE `user_activity_logs` DROP COLUMN `admin_id`,
    DROP COLUMN `created_at`,
    DROP COLUMN `user_id`,
    ADD COLUMN `adminId` INTEGER NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `member_Id`,
    DROP COLUMN `refresh_token`,
    ADD COLUMN `createdByAdminId` INTEGER NULL,
    ADD COLUMN `memberId` VARCHAR(191) NULL,
    ADD COLUMN `updatedByAdminId` INTEGER NULL;

-- DropTable
DROP TABLE `packages`;

-- CreateTable
CREATE TABLE `plans_master` (
    `id` VARCHAR(191) NOT NULL,
    `planName` VARCHAR(191) NOT NULL,
    `Description` VARCHAR(191) NOT NULL,
    `BV` DOUBLE NOT NULL,
    `price` DOUBLE NOT NULL,
    `dp_amount` DOUBLE NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `createdByAdminId` INTEGER NULL,
    `updatedByAdminId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminActivityLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminId` INTEGER NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `entity` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NOT NULL,
    `oldData` JSON NULL,
    `newData` JSON NULL,
    `meta` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plan_purchases` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plan_id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `BV` DOUBLE NOT NULL,
    `dp_amount` DOUBLE NOT NULL,
    `plan_amount` DOUBLE NOT NULL,
    `payment_mode` VARCHAR(191) NOT NULL,
    `payment_proof_uri` VARCHAR(191) NOT NULL,
    `is_income_generated` ENUM('0', '1') NOT NULL,
    `purchase_type` ENUM('FIRST_PURCHASE', 'REPURCHASE', 'SHARE_PURCHASE') NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `approved_by` INTEGER NULL,
    `approved_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_memberId_key` ON `users`(`memberId`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_createdByAdminId_fkey` FOREIGN KEY (`createdByAdminId`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_updatedByAdminId_fkey` FOREIGN KEY (`updatedByAdminId`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kyc` ADD CONSTRAINT `kyc_createdByAdminId_fkey` FOREIGN KEY (`createdByAdminId`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kyc` ADD CONSTRAINT `kyc_updatedByAdminId_fkey` FOREIGN KEY (`updatedByAdminId`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kyc` ADD CONSTRAINT `kyc_approvedByAdminId_fkey` FOREIGN KEY (`approvedByAdminId`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plans_master` ADD CONSTRAINT `plans_master_createdByAdminId_fkey` FOREIGN KEY (`createdByAdminId`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plans_master` ADD CONSTRAINT `plans_master_updatedByAdminId_fkey` FOREIGN KEY (`updatedByAdminId`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_activity_logs` ADD CONSTRAINT `user_activity_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_activity_logs` ADD CONSTRAINT `user_activity_logs_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminActivityLog` ADD CONSTRAINT `AdminActivityLog_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plan_purchases` ADD CONSTRAINT `plan_purchases_plan_id_fkey` FOREIGN KEY (`plan_id`) REFERENCES `plans_master`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plan_purchases` ADD CONSTRAINT `plan_purchases_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plan_purchases` ADD CONSTRAINT `plan_purchases_approved_by_fkey` FOREIGN KEY (`approved_by`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;
