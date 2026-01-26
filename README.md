# ItinaviCN

Travel itinerary planning application.

## Prerequisites

- Node.js 18+ and pnpm
- Docker Desktop or Colima

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

### 2. Start the Application

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

### 3. Stop the Application

```bash
docker-compose down
```

To stop and remove volumes:

```bash
docker-compose down -v
```

## Project Structure

- `apps/api` - NestJS backend API
- `apps/web` - Next.js frontend
- `packages/schema` - Shared TypeScript schemas
- `docs/` - Project documentation
