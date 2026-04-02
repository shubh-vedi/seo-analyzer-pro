-- AlterTable
ALTER TABLE "Audit" ADD COLUMN     "bulkId" TEXT,
ADD COLUMN     "sourceText" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'url',
ALTER COLUMN "url" DROP NOT NULL;
