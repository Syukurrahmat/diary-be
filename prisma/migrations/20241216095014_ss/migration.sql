/*
  Warnings:

  - You are about to drop the column `datetime` on the `entry` table. All the data in the column will be lost.
  - Added the required column `date` to the `entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `entry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `entry` DROP COLUMN `datetime`,
    ADD COLUMN `date` DATE NOT NULL,
    ADD COLUMN `time` TIME(0) NOT NULL;

-- RenameIndex
ALTER TABLE `_entrytotag` RENAME INDEX `_EntryToTag_AB_unique` TO `_entrytotag_AB_unique`;

-- RenameIndex
ALTER TABLE `_entrytotag` RENAME INDEX `_EntryToTag_B_index` TO `_entrytotag_B_index`;
