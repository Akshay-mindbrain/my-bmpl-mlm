/*
  Warnings:

  - A unique constraint covering the columns `[mobile]` on the table `aa_0_admin_db` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mobile` to the `aa_0_admin_db` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `aa_0_admin_db` ADD COLUMN `mobile` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `aa_0_admin_db_mobile_key` ON `aa_0_admin_db`(`mobile`);
