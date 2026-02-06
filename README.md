# ItinaviCN

A comprehensive travel itinerary planning application with bilingual support (中文/English) and China-focused features.

## Features

### ✅ **Trip Management**

- Create and manage trips with multiple destinations
- Bilingual country/city autocomplete (Chinese + English)
- Timezone-aware scheduling
- Multi-currency support with exchange rate tracking

### ✅ **Itinerary Planning**

- 5 specialized itinerary types with custom fields:
  - ✈️ **Flights** - Flight number, airline, terminals
  - 🚌 **Transport** - Type, route, booking details
  - 🏨 **Accommodation** - Hotel search with Amap integration
  - 📍 **Places** - Cultural sites, attractions, activities
  - 🍜 **Food** - Restaurants, cuisine recommendations
- Status tracking (Planned, Booked, Done, Skipped)
- Linked locations and expenses

### ✅ **Location Management**

- 6 categories: Place, Restaurant, Accommodation, Transport Node, Shop, Other
- Amap (高德地图) autocomplete for Chinese locations
- Address and coordinates storage
- Location-based expense tracking

### ✅ **Expense Tracking**

- Multiple expense categories
- Automatic currency conversion
- Link expenses to itinerary items or locations
- Exchange rate history

### 🔧 **Technical Features**

- Type-safe with shared Zod schemas
- Real-time validation
- Responsive Material UI design
- PostgreSQL with Prisma ORM
- RESTful API with NestJS

## Prerequisites

- Node.js 18+ and pnpm
- Docker Desktop or Colima
- Amap API key (optional, for place autocomplete)

## Getting Started

### 1. Docker Setup

#### Option A: Docker Desktop

1. Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Start Docker Desktop
3. Verify installation:
   ```bash
   docker --version
   docker-compose --version
   ```

#### Option B: Colima (macOS)

1. Install Colima:
   ```bash
   brew install colima
   ```
2. Start Colima:
   ```bash
   colima start
   ```
3. Verify installation:
   ```bash
   docker --version
   docker-compose --version
   ```

### 2. Environment Configuration

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration:

   ```env
   # Database (uses Docker Compose defaults)
   DATABASE_URL="postgresql://itinavi:itinavi@localhost:5432/itinavi_cn?schema=public"

   # API Server
   PORT=3001

   # Amap API Keys (Optional - for location autocomplete)
   # Get keys from: https://console.amap.com/dev/key/app
   NEXT_PUBLIC_AMAP_WEB_SERVICE_KEY=your_key_here
   ```

   > **Note**: Amap keys are optional. The app will use mock data if not configured. See [AMAP_INTEGRATION.md](docs/AMAP_INTEGRATION.md) for details.

### 3. Start the Application

1. Start Docker services:

   ```bash
   docker-compose up -d
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Run database migrations:

   ```bash
   cd apps/api
   pnpm prisma migrate deploy
   ```

4. Start development servers:

   ```bash
   pnpm dev
   ```

   The application will be available at:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001

### 4. Stop the Application

```bash
docker-compose down
```

To stop and remove volumes:

```bash
docker-compose down -v
```

## Project Structure

```
ItinaviCN/
├── apps/
│   ├── api/                    # NestJS backend API
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── trips/      # Trip CRUD operations
│   │   │   │   ├── itinerary/  # Itinerary item management
│   │   │   │   └── locations/  # Location management
│   │   │   └── prisma/         # Database service
│   │   └── prisma/
│   │       ├── schema.prisma   # Database schema
│   │       └── migrations/     # Schema migrations
│   │
│   └── web/                    # Next.js frontend
│       ├── src/
│       │   ├── app/            # App router pages
│       │   │   └── trips/      # Trip-related pages
│       │   ├── components/
│       │   │   ├── itinerary/  # Itinerary cards & fields
│       │   │   ├── forms/      # Trip & itinerary forms
│       │   │   └── ui/         # Reusable UI components
│       │   ├── contexts/       # React contexts (preferences)
│       │   ├── hooks/          # Custom hooks
│       │   └── lib/
│       │       ├── api.ts      # API client
│       │       ├── locations.ts # Location dictionary
│       │       └── dateUtils.ts # Timezone utilities
│       └── public/
│
├── packages/
│   └── schema/                 # Shared TypeScript/Zod schemas
│       └── src/
│           ├── trip.ts         # Trip validation schemas
│           ├── itinerary.ts    # Itinerary schemas
│           ├── location.ts     # Location schemas
│           ├── expense.ts      # Expense schemas
│           └── exchangeRate.ts # Exchange rate schemas
│
├── docs/                       # Project documentation
│   ├── FEATURE_DESTINATIONS.md # Bilingual destinations feature
│   └── AMAP_INTEGRATION.md     # Amap API integration guide
│
└── tooling/                    # Shared tooling configuration
```

## Documentation

- **[Project Status](docs/PROJECT_STATUS.md)** - Complete feature overview and roadmap
- **[Destinations Feature](docs/FEATURE_DESTINATIONS.md)** - Bilingual autocomplete & localization
- **[Amap Integration](docs/AMAP_INTEGRATION.md)** - Chinese location search setup

## Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **Material UI** - Component library
- **TypeScript** - Type safety
- **Zod** - Runtime validation
- **date-fns-tz** - Timezone handling

### Backend

- **NestJS** - Node.js framework
- **Prisma** - ORM and migrations
- **PostgreSQL** - Database
- **TypeScript** - Type safety
- **Zod** - Schema validation

### DevOps

- **pnpm** - Package manager
- **Turborepo** - Monorepo build system
- **Docker** - Containerization
- **ESLint** - Code linting

## Development

### Database Management

```bash
# Generate Prisma client after schema changes
cd apps/api
pnpm prisma generate

# Create a new migration
pnpm prisma migrate dev --name your_migration_name

# Reset database (WARNING: deletes all data)
pnpm prisma migrate reset

# Open Prisma Studio to view/edit data
pnpm prisma studio
```

### Running Individual Apps

```bash
# Run only the API
pnpm --filter api dev

# Run only the web app
pnpm --filter web dev
```

### Build for Production

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter api build
pnpm --filter web build
```

## Database Schema

### Core Models

- **Trip** - Travel trips with destinations, dates, and currencies
- **Location** - Places, restaurants, hotels with coordinates
- **ItineraryItem** - Scheduled activities/bookings with 5 types
- **Expense** - Tracked expenses with currency conversion
- **ExchangeRate** - Exchange rate history for accurate conversions

See [schema.prisma](apps/api/prisma/schema.prisma) for complete schema.

## Contributing

1. Create a feature branch from `main`
2. Make your changes with proper TypeScript types
3. Ensure no ESLint errors: `pnpm lint`
4. Test your changes locally
5. Submit a pull request

## License

MIT
