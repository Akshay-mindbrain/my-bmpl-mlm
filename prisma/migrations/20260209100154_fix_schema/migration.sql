/*
  Warnings:

  - You are about to drop the column `lastLeftId` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `lastLeftId`,
    ADD COLUMN `lastLeft` INTEGER NULL;
