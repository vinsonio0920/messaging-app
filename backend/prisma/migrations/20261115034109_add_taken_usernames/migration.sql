-- AlterTable
ALTER TABLE "User" ADD COLUMN     "previousUsernames" TEXT[];

-- CreateTable
CREATE TABLE "TakenUsernames" (
    "id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "TakenUsernames_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TakenUsernames_username_key" ON "TakenUsernames"("username");
