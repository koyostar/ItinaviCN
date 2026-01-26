/*
  Warnings:

  - The values [PlaceVisit] on the enum `ItineraryItemType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ItineraryItemType_new" AS ENUM ('Flight', 'Transport', 'Accommodation', 'Place', 'Food');
ALTER TABLE "ItineraryItem" ALTER COLUMN "type" TYPE "ItineraryItemType_new" USING ("type"::text::"ItineraryItemType_new");
ALTER TYPE "ItineraryItemType" RENAME TO "ItineraryItemType_old";
ALTER TYPE "ItineraryItemType_new" RENAME TO "ItineraryItemType";
DROP TYPE "public"."ItineraryItemType_old";
COMMIT;
