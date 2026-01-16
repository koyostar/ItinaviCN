-- CreateEnum
CREATE TYPE "DisplayCurrencyMode" AS ENUM ('DestinationOnly', 'OriginOnly', 'Both');

-- CreateEnum
CREATE TYPE "LocationCategory" AS ENUM ('Place', 'Restaurant', 'Accommodation', 'TransportNode', 'Shop', 'Other');

-- CreateEnum
CREATE TYPE "ItineraryItemType" AS ENUM ('Flight', 'Transport', 'Accommodation', 'PlaceVisit', 'Food');

-- CreateEnum
CREATE TYPE "ItineraryStatus" AS ENUM ('Planned', 'Booked', 'Done', 'Skipped');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('Accommodation', 'Transport', 'Food', 'Shop', 'Attraction', 'Other');

-- CreateEnum
CREATE TYPE "ExchangeRateSource" AS ENUM ('Manual', 'Provider');

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "destination" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "destinationCurrency" TEXT NOT NULL DEFAULT 'CNY',
    "originCurrency" TEXT NOT NULL DEFAULT 'SGD',
    "displayCurrencyMode" "DisplayCurrencyMode" NOT NULL DEFAULT 'Both',
    "defaultExchangeRate" DECIMAL(65,30),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "LocationCategory" NOT NULL,
    "address" TEXT,
    "latitude" DECIMAL(65,30),
    "longitude" DECIMAL(65,30),
    "baiduPlaceId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItineraryItem" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "type" "ItineraryItemType" NOT NULL,
    "title" TEXT NOT NULL,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3),
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Shanghai',
    "status" "ItineraryStatus" NOT NULL DEFAULT 'Planned',
    "locationId" TEXT,
    "bookingRef" TEXT,
    "url" TEXT,
    "notes" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItineraryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeRate" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "baseCurrency" TEXT NOT NULL DEFAULT 'CNY',
    "quoteCurrency" TEXT NOT NULL DEFAULT 'SGD',
    "rate" DECIMAL(65,30) NOT NULL,
    "rateDate" TIMESTAMP(3) NOT NULL,
    "source" "ExchangeRateSource" NOT NULL DEFAULT 'Manual',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "ExpenseCategory" NOT NULL,
    "expenseDateTime" TIMESTAMP(3) NOT NULL,
    "amountDestinationMinor" INTEGER NOT NULL,
    "destinationCurrency" TEXT NOT NULL,
    "exchangeRateUsed" DECIMAL(65,30),
    "linkedItineraryItemId" TEXT,
    "linkedLocationId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Location_tripId_idx" ON "Location"("tripId");

-- CreateIndex
CREATE INDEX "ItineraryItem_tripId_idx" ON "ItineraryItem"("tripId");

-- CreateIndex
CREATE INDEX "ItineraryItem_locationId_idx" ON "ItineraryItem"("locationId");

-- CreateIndex
CREATE INDEX "ExchangeRate_tripId_idx" ON "ExchangeRate"("tripId");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeRate_tripId_rateDate_key" ON "ExchangeRate"("tripId", "rateDate");

-- CreateIndex
CREATE INDEX "Expense_tripId_idx" ON "Expense"("tripId");

-- CreateIndex
CREATE INDEX "Expense_linkedItineraryItemId_idx" ON "Expense"("linkedItineraryItemId");

-- CreateIndex
CREATE INDEX "Expense_linkedLocationId_idx" ON "Expense"("linkedLocationId");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryItem" ADD CONSTRAINT "ItineraryItem_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItineraryItem" ADD CONSTRAINT "ItineraryItem_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExchangeRate" ADD CONSTRAINT "ExchangeRate_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_linkedItineraryItemId_fkey" FOREIGN KEY ("linkedItineraryItemId") REFERENCES "ItineraryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_linkedLocationId_fkey" FOREIGN KEY ("linkedLocationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
