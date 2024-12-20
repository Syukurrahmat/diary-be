/*
  Warnings:

  - You are about to drop the column `locationId` on the `entry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `entry` DROP COLUMN `locationId`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `timezone` VARCHAR(191) NOT NULL DEFAULT 'Asia/Jakarta';
