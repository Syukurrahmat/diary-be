/*
  Warnings:

  - You are about to drop the `_Entrytotag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Entrytotag" DROP CONSTRAINT "_Entrytotag_A_fkey";

-- DropForeignKey
ALTER TABLE "_Entrytotag" DROP CONSTRAINT "_Entrytotag_B_fkey";

-- DropTable
DROP TABLE "_Entrytotag";

-- CreateTable
CREATE TABLE "_EntrytoTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EntrytoTag_AB_unique" ON "_EntrytoTag"("A", "B");

-- CreateIndex
CREATE INDEX "_EntrytoTag_B_index" ON "_EntrytoTag"("B");

-- AddForeignKey
ALTER TABLE "_EntrytoTag" ADD CONSTRAINT "_EntrytoTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntrytoTag" ADD CONSTRAINT "_EntrytoTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
