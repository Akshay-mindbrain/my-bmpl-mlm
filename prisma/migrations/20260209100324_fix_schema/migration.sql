/*
  Warnings:

  - You are about to drop the column `lastLeft` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `lastLeft`,
    ADD COLUMN `lastLeftId` INTEGER NULL;
