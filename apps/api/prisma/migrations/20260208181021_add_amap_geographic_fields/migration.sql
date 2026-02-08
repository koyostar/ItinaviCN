/*
  Warnings:

  - You are about to drop the column `baiduPlaceId` on the `Location` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Location" DROP COLUMN "baiduPlaceId",
ADD COLUMN     "adcode" TEXT,
ADD COLUMN     "amapPoiId" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "citycode" TEXT,
ADD COLUMN     "district" TEXT,
ADD COLUMN     "province" TEXT;
