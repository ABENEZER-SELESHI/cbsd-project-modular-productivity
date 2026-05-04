# Monorepo

A scalable monorepo using npm workspaces, Next.js (frontend), and Express (backend).

## Structure

```
root/
├── apps/
│   ├── web/          # Next.js 14 App Router frontend
│   └── api/          # Express REST API
├── packages/
│   ├── ui-components/ # Shared React components (Button, Card, Input)
│   ├── utils/         # Shared utilities (formatDate, capitalize, apiRequest)
│   ├── feature-x/     # Task Manager logic + in-memory CRUD
│   └── feature-y/     # Habit & Notes logic + in-memory CRUD
└── package.json       # Workspace root
```

## Package Relationships

- `apps/web` imports from all four packages
- `apps/api` imports from `feature-x`, `feature-y`, and `utils`
- Packages are referenced as `@repo/<name>` via npm workspaces (no publishing needed)

## Setup

```bash
# Install all dependencies from the root
npm install
```

## Running

### Frontend (Next.js — http://localhost:3000)

```bash
npm run dev:web
```

### Backend (Express — http://localhost:4000)

```bash
npm run dev:api
```

### Build all

```bash
npm run build
```

## API Endpoints

| Method | Path              | Description       |
|--------|-------------------|-------------------|
| GET    | /api/tasks        | List tasks        |
| POST   | /api/tasks        | Create task       |
| PATCH  | /api/tasks/:id    | Update task       |
| DELETE | /api/tasks/:id    | Delete task       |
| GET    | /api/habits       | List habits       |
| POST   | /api/habits       | Create habit      |
| PATCH  | /api/habits/:id   | Update habit      |
| DELETE | /api/habits/:id   | Delete habit      |
| GET    | /api/notes        | List notes        |
| POST   | /api/notes        | Create note       |
| PATCH  | /api/notes/:id    | Update note       |
| DELETE | /api/notes/:id    | Delete note       |
| GET    | /health           | Health check      |

> Storage is in-memory — data resets on server restart.
