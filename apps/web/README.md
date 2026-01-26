# ItinaviCN Web

Next.js frontend application for ItinaviCN travel itinerary planning.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: Material-UI (MUI) v7
- **Language**: TypeScript
- **Styling**: Emotion CSS-in-JS
- **Maps**: Baidu Maps (AMap) integration

## Features

- **Trip Management** - Create and view travel trips
- **Bilingual Support** - Toggle between Chinese (中文) and English
- **Destination Autocomplete** - Search countries and cities in both languages
- **Itinerary Planning** - Add flights, accommodations, food, and activities
- **Location Search** - Integrated with AMap for place autocomplete
- **Expense Tracking** - Track expenses with currency conversion
- **Responsive Design** - Works on desktop and mobile

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── trips/        # Trips listing and management
│   └── layout.tsx    # Root layout with theme provider
├── components/       # React components
│   ├── itinerary-cards/     # Display cards for different item types
│   └── itinerary-form/      # Forms for creating itinerary items
├── contexts/         # React contexts (user preferences, etc.)
└── lib/              # Utilities and API client
    ├── api.ts        # API client
    ├── locations.ts  # Location data dictionary (countries/cities)
    └── theme.ts      # MUI theme configuration
```

## Development

From the root of the monorepo:

```bash
# Install dependencies
pnpm install

# Start development server
cd apps/web
pnpm dev
```

The app will be available at `http://localhost:3000`.

## Environment Variables

The API URL is configured to connect to `http://localhost:3001` by default. Update `src/lib/api.ts` if needed.

## Key Features

### Bilingual Destination Support

See [docs/FEATURE_DESTINATIONS.md](../../docs/FEATURE_DESTINATIONS.md) for details on the autocomplete and language toggle functionality.

### AMap Integration

See [docs/AMAP_INTEGRATION.md](../../docs/AMAP_INTEGRATION.md) for details on the Baidu Maps integration.

## Scripts

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Type checking
pnpm typecheck

# Lint code
pnpm lint
```
