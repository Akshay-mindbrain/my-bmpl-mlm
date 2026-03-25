/*
  Warnings:

  - You are about to drop the column `A` on the `_ConfigRoyalPlans` table. All the data in the column will be lost.
  - You are about to drop the column `B` on the `_ConfigRoyalPlans` table. All the data in the column will be lost.
  - Added the required column `id` to the `_ConfigRoyalPlans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planid` to the `_ConfigRoyalPlans` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_ConfigRoyalPlans` DROP FOREIGN KEY `_ConfigRoyalPlans_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ConfigRoyalPlans` DROP FOREIGN KEY `_ConfigRoyalPlans_B_fkey`;

-- DropIndex
DROP INDEX `_ConfigRoyalPlans_AB_unique` ON `_ConfigRoyalPlans`;

-- AlterTable
ALTER TABLE `_ConfigRoyalPlans` DROP COLUMN `A`,
    DROP COLUMN `B`,
    ADD COLUMN `id` INTEGER NOT NULL,
    ADD COLUMN `planid` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`, `planid`);

-- AddForeignKey
ALTER TABLE `_ConfigRoyalPlans` ADD CONSTRAINT `_ConfigRoyalPlans_id_fkey` FOREIGN KEY (`id`) REFERENCES `config_table`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ConfigRoyalPlans` ADD CONSTRAINT `_ConfigRoyalPlans_planid_fkey` FOREIGN KEY (`planid`) REFERENCES `plans_master`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
