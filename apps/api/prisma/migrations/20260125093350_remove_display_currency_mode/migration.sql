/*
  Warnings:

  - You are about to drop the column `displayCurrencyMode` on the `Trip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "displayCurrencyMode";

-- DropEnum
DROP TYPE "DisplayCurrencyMode";
