-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "image" TEXT,
ALTER COLUMN "message" DROP NOT NULL;
