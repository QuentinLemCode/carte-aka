# Carte AKA

Interactive address map application. Search for addresses, pin them on an OpenStreetMap view, and manage your saved locations.

## Tech Stack

- **Frontend** -- Vite + TypeScript + Leaflet.js
- **Backend** -- Express.js + TypeScript + Drizzle ORM
- **Database** -- PostgreSQL 16
- **Geocoding** -- Nominatim (OpenStreetMap)

## Local Development

### Prerequisites

- Node.js >= 22
- PostgreSQL running locally (or via Docker)

### Setup

```bash
# Install dependencies
npm install

# Start a local PostgreSQL (if needed)
docker run -d --name carte-pg \
  -e POSTGRES_USER=carte -e POSTGRES_PASSWORD=carte -e POSTGRES_DB=carte \
  -p 5432:5432 postgres:16-alpine

# Run both client and server in dev mode
npm run dev
```

The client dev server runs on `http://localhost:5173` with API requests proxied to the backend on port 3000.

### Environment Variables

| Variable       | Default                                         | Description                  |
| -------------- | ----------------------------------------------- | ---------------------------- |
| `DATABASE_URL` | `postgresql://carte:carte@localhost:5432/carte` | PostgreSQL connection string |
| `PORT`         | `3000`                                          | Server listen port           |

### Commands

| Command                | Description                            |
| ---------------------- | -------------------------------------- |
| `npm run dev`          | Start client + server in watch mode    |
| `npm run build`        | Build client and server for production |
| `npm run lint`         | Run ESLint                             |
| `npm run format`       | Format with Prettier                   |
| `npm run format:check` | Check formatting                       |
| `npm test`             | Run all tests                          |

## Production Deployment

### Docker Compose

Edit `docker-compose.yml` to set your image path and passwords, then:

```bash
docker compose up -d
```

The application will be available on port 3000. Database migrations run automatically on startup.

### Build the Docker Image

```bash
docker build -t carte-aka .
```

## License

MIT
