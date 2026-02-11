/*
  Warnings:

  - You are about to drop the column `access_token` on the `aa_0_admin_db` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `aa_0_admin_db` DROP COLUMN `access_token`,
    MODIFY `admin_username` VARCHAR(191) NULL;
