/*
  Warnings:

  - The values [TransportNode] on the enum `LocationCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum: Replace TransportNode with Transport
BEGIN;
-- Create new enum type with the desired values
CREATE TYPE "LocationCategory_new" AS ENUM ('Place', 'Restaurant', 'Accommodation', 'Transport', 'Shop', 'Other');

-- Update the column to use the new enum type
-- First convert TransportNode to Transport via text casting
ALTER TABLE "Location" 
  ALTER COLUMN "category" TYPE "LocationCategory_new" 
  USING (
    CASE 
      WHEN "category"::text = 'TransportNode' THEN 'Transport'::text
      ELSE "category"::text
    END
  )::"LocationCategory_new";

-- Swap the enum types
ALTER TYPE "LocationCategory" RENAME TO "LocationCategory_old";
ALTER TYPE "LocationCategory_new" RENAME TO "LocationCategory";

-- Drop the old enum type
DROP TYPE "LocationCategory_old";
COMMIT;
