-- CreateTable
CREATE TABLE `aa_0_admin_db` (
    `admin_id` INTEGER NOT NULL AUTO_INCREMENT,
    `admin_fname` VARCHAR(50) NULL,
    `admin_lname` VARCHAR(50) NULL,
    `mob_one` VARCHAR(20) NULL,
    `mob_two` VARCHAR(20) NULL,
    `email_id` VARCHAR(100) NULL,
    `pinno` VARCHAR(20) NULL,
    `country_name` VARCHAR(100) NULL,
    `state_name` VARCHAR(100) NULL,
    `address` TEXT NULL,
    `admin_username` VARCHAR(30) NOT NULL,
    `admin_password` VARCHAR(255) NOT NULL,
    `profile_img` TEXT NULL,
    `admin_type` ENUM('SUPERADMIN', 'ADMIN', 'MANAGER') NOT NULL,
    `access_token` TEXT NULL,
    `refresh_token` TEXT NULL,
    `status` VARCHAR(1) NOT NULL DEFAULT '1',
    `insert_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `insert_user` VARCHAR(50) NULL,
    `update_date` DATETIME(3) NOT NULL,
    `update_user` VARCHAR(50) NULL,

    UNIQUE INDEX `aa_0_admin_db_email_id_key`(`email_id`),
    UNIQUE INDEX `aa_0_admin_db_admin_username_key`(`admin_username`),
    PRIMARY KEY (`admin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `sponsorId` INTEGER NULL,
    `parentId` INTEGER NULL,
    `legPosition` ENUM('LEFT', 'RIGHT') NULL,
    `leftChildId` INTEGER NULL,
    `rightChildId` INTEGER NULL,
    `lastLeftId` INTEGER NULL,
    `lastRightId` INTEGER NULL,
    `lineagePath` VARCHAR(255) NULL,
    `directCount` INTEGER NOT NULL DEFAULT 0,
    `kycStatus` ENUM('PENDING', 'APPROVED', 'REJECT') NOT NULL DEFAULT 'PENDING',
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `refresh_token` TEXT NULL,
    `adminId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,

    UNIQUE INDEX `User_mobile_key`(`mobile`),
    INDEX `User_lineagePath_idx`(`lineagePath`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_activity_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `admin_id` INTEGER NOT NULL,
    `action` VARCHAR(50) NOT NULL,
    `details` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_login_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminId` INTEGER NOT NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `loginTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `logout_time` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_activity_logs` ADD CONSTRAINT `user_activity_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_activity_logs` ADD CONSTRAINT `user_activity_logs_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `admin_login_history` ADD CONSTRAINT `admin_login_history_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `aa_0_admin_db`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
