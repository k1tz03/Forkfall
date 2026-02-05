# FORKFALL

A binary choice social app where users swipe on "Forks" (two-option prompts) and can "twist" (mutate) them to create branches.

## Stack

- **Mobile**: React Native
- **Backend**: Go
- **Database**: PostgreSQL
- **Cache**: Redis
- **Infrastructure**: Docker

## Project Structure

```
forkfall/
├── apps/
│   └── mobile/              # React Native app
├── packages/
│   └── shared/              # Shared types/constants
├── backend/
│   ├── cmd/api/             # Main entrypoint
│   ├── internal/            # Application code
│   ├── pkg/                 # Shared utilities
│   └── migrations/          # SQL migrations
├── docker-compose.yml       # Local dev environment
└── package.json             # Root workspace config
```

## Getting Started

### Prerequisites

- Node.js 18+
- Go 1.21+
- Docker & Docker Compose
- iOS Simulator (Mac) or Android Emulator

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start infrastructure**
   ```bash
   npm run docker:up
   ```

3. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

4. **Start backend**
   ```bash
   npm run backend
   ```

5. **Start mobile app**
   ```bash
   npm run mobile
   # Then press 'i' for iOS or 'a' for Android
   ```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/device | Register/auth device |
| GET | /api/v1/feed | Get personalized fork deck |
| POST | /api/v1/forks/{id}/interact | Record interaction |
| POST | /api/v1/forks | Create new fork |
| GET | /api/v1/forks/{id} | Get fork details |
| POST | /api/v1/forks/{id}/report | Report a fork |
| GET | /api/v1/intents | Get available intents |
| PUT | /api/v1/session | Update session intent |

## Testing

```bash
# Test backend health
curl http://localhost:8080/api/v1/health

# Test device auth
curl -X POST http://localhost:8080/api/v1/auth/device \
  -H "Content-Type: application/json" \
  -d '{"device_fingerprint": "test-device-123"}'
```

## License

Private - All rights reserved
