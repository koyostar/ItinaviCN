# ItinaviCN API

NestJS backend API for the ItinaviCN travel itinerary planning application.

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Language**: TypeScript

## API Modules

- **Trips** - Manage travel trips with destinations and dates
- **Itinerary** - Create and manage itinerary items (flights, accommodations, activities)
- **Locations** - Store and retrieve location information with coordinates
- **Health** - Health check endpoint

## Database Models

- `Trip` - Trip details with destinations, dates, and currency settings
- `ItineraryItem` - Individual items in a trip (flights, transport, accommodation, food, visits)
- `Location` - Places with coordinates and Baidu Maps integration
- `Expense` - Trip expenses with categories
- `ExchangeRate` - Currency exchange rates

## Setup

From the root of the monorepo:

```bash
# Install dependencies
pnpm install

# Start PostgreSQL database (via Docker)
docker-compose up -d

# Run migrations
cd apps/api
pnpm prisma migrate deploy

# Generate Prisma client
pnpm prisma generate
```

## Development

```bash
# Start in watch mode
pnpm dev

# Run type checking
pnpm typecheck

# Lint code
pnpm lint
```

The API will be available at `http://localhost:3001`.

## Database Management

```bash
# Create a new migration
pnpm prisma migrate dev --name migration_name

# Open Prisma Studio (database GUI)
pnpm prisma studio

# Reset database (warning: deletes all data)
pnpm prisma migrate reset
```

## Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov

# Watch mode
pnpm test:watch
```

## API Endpoints

- `GET /health` - Health check
- `GET /trips` - List all trips
- `POST /trips` - Create a new trip
- `GET /trips/:id` - Get trip details
- `PATCH /trips/:id` - Update trip
- `DELETE /trips/:id` - Delete trip
- `GET /trips/:id/itinerary` - Get trip itinerary items
- `POST /trips/:id/itinerary` - Create itinerary item
- `GET /locations/search` - Search locations via AMap

## Environment Variables

Required environment variables (see `.env` file):

```env
DATABASE_URL=postgresql://user:password@localhost:5432/itinavi
```
