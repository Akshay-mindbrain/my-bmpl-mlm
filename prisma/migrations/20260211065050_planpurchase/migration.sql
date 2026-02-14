/*
  Warnings:

  - You are about to alter the column `status` on the `plan_purchases` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(5))` to `Enum(EnumId(9))`.

*/
-- AlterTable
ALTER TABLE `plan_purchases` MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';
