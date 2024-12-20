/*
  Warnings:

  - You are about to drop the column `date` on the `entry` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `entry` table. All the data in the column will be lost.
  - Made the column `datetime` on table `entry` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `entry` DROP COLUMN `date`,
    DROP COLUMN `time`,
    MODIFY `datetime` DATETIME(3) NOT NULL;
