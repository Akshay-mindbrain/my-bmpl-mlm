-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_lastLeftId_fkey` FOREIGN KEY (`lastLeftId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_lastRightId_fkey` FOREIGN KEY (`lastRightId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
