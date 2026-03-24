/*
  Warnings:

  - A unique constraint covering the columns `[userId,childId]` on the table `royal_qualifier` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `royal_qualifier_userId_childId_key` ON `royal_qualifier`(`userId`, `childId`);
