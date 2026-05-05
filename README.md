# Productivity Hub — Full-Stack Monorepo

A production-ready monorepo built with **npm workspaces**, featuring a **Next.js 14** frontend and an **Express** REST API. The app lets you manage tasks, track habits, write notes, and plan your week — all from a unified dark-themed dashboard.

---

## Architecture

```
root/
├── apps/
│   ├── web/                  # Next.js 14 (App Router) — http://localhost:3000
│   └── api/                  # Express REST API       — http://localhost:4000
│
├── packages/
│   ├── ui-components/        # Shared React component library (TypeScript)
│   ├── utils/                # Shared utilities (formatDate, apiRequest, generateId…)
│   ├── feature-x/            # Task domain: model + in-memory CRUD store
│   └── feature-y/            # Habit & Note domain: models + in-memory CRUD stores
│
└── package.json              # Workspace root — defines workspaces and root scripts
```

### How the monorepo works

All packages are declared as npm workspaces in the root `package.json`. This means:

- **No publishing required** — packages are symlinked locally via `node_modules/@repo/<name>`.
- **Single `npm install`** at the root installs every dependency across all apps and packages.
- **Shared code** (utilities, UI components, business logic) lives in `packages/` and is imported by both `apps/web` and `apps/api` using the `@repo/<name>` alias.
- **Next.js** transpiles workspace packages via `transpilePackages` in `next.config.js`, so TypeScript source files in `packages/ui-components` are compiled on-the-fly without a separate build step.

### Data flow

```
Browser → Next.js page (React)
       → apiRequest() utility (fetch wrapper)
       → Express API (port 4000)
       → Service layer (thin wrapper)
       → Feature package (model + in-memory store)
```

All data is stored **in-memory** — it resets when the API server restarts. This is intentional for a demo/development setup; swap the stores for a real database to persist data.

---

## Package Descriptions

### `packages/ui-components`
A dark-first React component library written in TypeScript. Zero external UI dependencies — every component is built from scratch with Tailwind CSS.

| Component | Variants / Features |
|-----------|---------------------|
| `Button`  | 5 variants, 3 sizes, loading spinner, left/right icon slots, full-width |
| `Card`    | 4 variants (default, glass, outline, elevated), hoverable, header/footer slots |
| `Input`   | Label, error, hint, left/right adornments, character counter |
| `Modal`   | 4 sizes, Escape-to-close, scroll lock, backdrop blur, scale-in animation |
| `Navbar`  | Sticky glass effect on scroll, gradient brand, active links, mobile drawer |

### `packages/utils`
Shared utility functions used by both the frontend and the API.

| Export | Description |
|--------|-------------|
| `formatDate` | Formats a Date or ISO string into a readable locale string |
| `capitalize` | Capitalizes the first letter of a string |
| `apiRequest` | Lightweight `fetch` wrapper with JSON headers and error throwing |
| `validateEmail` | RFC 5322-inspired email validation |
| `generateId` | UUID v4 generator (`crypto.randomUUID` with fallback) |
| `logger` | Express request-logging middleware with `info/warn/error/debug` helpers |
| `errorHandler` | Express global error middleware — returns consistent JSON error responses |

### `packages/feature-x` — Task Manager
Encapsulates the Task domain.

- **`taskModel.js`** — `createTask(title, description)` factory function
- **`taskStore.js`** — In-memory CRUD: `getAllTasks`, `getTaskById`, `addTask`, `updateTask`, `deleteTask`

### `packages/feature-y` — Habits & Notes Tracker
Encapsulates the Habit and Note domains.

- **`habitModel.js`** — `createHabit(name, frequency)` and `createNote(title, content)` factories
- **`habitStore.js`** — Two in-memory arrays with full CRUD for habits and notes

---

## Feature Descriptions

### Dashboard (`/`)
The central hub. Fetches live data from all three API endpoints and displays:
- **Stat cards** — total tasks, active tasks, habit count, note count (each card links to its feature page)
- **Task completion progress bar**
- **Recent tasks** list with status indicators
- **Top habits** ranked by streak
- **Recent notes** preview
- **Quick-action cards** linking to Tasks, Habits, and Schedule
- **Welcome banner** — time-of-day greeting with a summary of active tasks and habits
- **Refresh button** in the header to re-fetch all data on demand
- **Error banner** with a Retry button if the API is unreachable

### Task Manager (`/tasks`)
A Kanban-style board with two columns: **To Do** and **Done**.
- Add tasks with a title and optional description
- Toggle completion (moves between columns)
- Delete tasks
- Live stats: total, active, completed, completion rate %
- Loading spinner in the header while fetching
- Error banner with Retry button if the API is unreachable

### Habits & Notes (`/habits`)
A two-column tracker for habits and notes side by side.
- **Habits** — track name, frequency (daily/weekly/monthly), and streak count
- **Notes** — title + optional content with a 120-character preview
- Add panel on the right with a mode toggle (Habit / Note)
- Delete with hover-reveal action buttons
- Loading spinner in the header while fetching
- Error banner with Retry button if the API is unreachable

### Weekly Schedule (`/schedule`)
A client-side weekly planner for scheduling tasks, habits, meetings, and focus blocks by day and time.
- **Day tabs** — Mon through Sun, with a blue dot on today and a badge showing entry count per day
- **Time grid** — 6 AM to 9 PM, one row per hour. The current hour is highlighted when viewing today
- **Click to add** — click any empty time slot to open an add modal
- **Add modal** — enter a title, choose a type (Task / Habit / Meeting / Focus / Break), and set duration (1–4 hours). Entries span multiple rows for multi-hour blocks
- **Entry blocks** — color-coded by type, hover to reveal a delete button
- **Type legend** — always visible above the grid
- **No API dependency** — schedule data is stored in local React state (in-memory, resets on page refresh)

> The Schedule page replaces the former UI Demo page (`/ui-demo`) which has been removed.

---

## API Endpoints

All endpoints are prefixed with `http://localhost:4000`.

| Method | Path              | Description              |
|--------|-------------------|--------------------------|
| GET    | /health           | Health check             |
| GET    | /api/tasks        | List all tasks           |
| POST   | /api/tasks        | Create a task            |
| GET    | /api/tasks/:id    | Get a single task        |
| PUT    | /api/tasks/:id    | Update a task            |
| DELETE | /api/tasks/:id    | Delete a task            |
| GET    | /api/habits       | List all habits          |
| POST   | /api/habits       | Create a habit           |
| GET    | /api/habits/:id   | Get a single habit       |
| PUT    | /api/habits/:id   | Update a habit           |
| DELETE | /api/habits/:id   | Delete a habit           |
| GET    | /api/notes        | List all notes           |
| POST   | /api/notes        | Create a note            |
| GET    | /api/notes/:id    | Get a single note        |
| PUT    | /api/notes/:id    | Update a note            |
| DELETE | /api/notes/:id    | Delete a note            |

### Request / Response examples

**Create a task**
```http
POST /api/tasks
Content-Type: application/json

{ "title": "Write unit tests", "description": "Cover the task store" }
```
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Write unit tests",
  "description": "Cover the task store",
  "completed": false,
  "createdAt": "2026-05-05T10:00:00.000Z",
  "updatedAt": "2026-05-05T10:00:00.000Z"
}
```

**Toggle task completion**
```http
PUT /api/tasks/:id
Content-Type: application/json

{ "completed": true }
```

**Create a habit**
```http
POST /api/habits
Content-Type: application/json

{ "name": "Morning run", "frequency": "daily" }
```

**Error response format**
```json
{
  "error": {
    "status": 404,
    "message": "Task not found",
    "path": "/api/tasks/bad-id",
    "timestamp": "2026-05-05T10:00:00.000Z"
  }
}
```

---

## Setup & Running

### Prerequisites
- Node.js 18+
- npm 8+ (workspaces support)

### Install all dependencies

```bash
npm install
```

Run this once from the **root** — it installs everything for all apps and packages.

### Start the API (Express — port 4000)

```bash
npm run dev:api
```

### Start the frontend (Next.js — port 3000)

```bash
npm run dev:web
```

Open both in separate terminals. The frontend expects the API on `http://localhost:4000`.

### Build for production

```bash
npm run build
```

---

## Individual Contributions

### Feature X — Task Manager (`packages/feature-x`, `apps/api` tasks routes, `apps/web/app/tasks`)
Implements the full task management feature end-to-end:
- **Data model** (`taskModel.js`) — defines the Task schema and factory function
- **In-memory store** (`taskStore.js`) — CRUD operations for the tasks collection
- **API layer** — `taskService.js` → `taskController.js` → `routes/tasks.js`
- **Frontend** (`tasks/page.jsx`) — Kanban board UI with add, toggle, and delete

### Feature Y — Habits & Notes Tracker (`packages/feature-y`, `apps/api` habits/notes routes, `apps/web/app/habits`)
Implements the habits and notes tracking feature:
- **Data models** (`habitModel.js`) — Habit and Note schema factories
- **In-memory stores** (`habitStore.js`) — separate CRUD for habits and notes
- **API layer** — `habitService.js` → `habitController.js` / `noteController.js` → `routes/habits.js` / `routes/notes.js`
- **Frontend** (`habits/page.jsx`) — two-column tracker with frequency selector and streak display

### Shared UI Components (`packages/ui-components`)
Builds the reusable component library consumed by the web app:
- Five fully typed, accessible React components (Button, Card, Input, Modal, Navbar)
- Dark-first design system with Tailwind CSS

### Shared Utilities (`packages/utils`)
Provides cross-cutting utilities used by both the API and the frontend:
- `generateId`, `formatDate`, `capitalize`, `apiRequest`, `validateEmail`
- Express `logger` and `errorHandler` middleware

### Integration & Dashboard (`apps/web/app/page.jsx`, `apps/api/src/index.js`)
Ties all features together:
- Dashboard aggregates data from all three API endpoints
- Unified sidebar navigation across all pages (Dashboard, Tasks, Habits, Schedule)
- Consistent dark theme, loading states, and error handling UI across all pages
- API server wires all routes with CORS, logging, and error handling middleware

### Weekly Schedule (`apps/web/app/schedule/page.jsx`)
A client-side weekly planner added as a replacement for the UI Demo page:
- Day/time grid covering Mon–Sun, 6 AM–9 PM
- Five entry types: Task, Habit, Meeting, Focus, Break — each color-coded
- Multi-hour entry support (1–4 hours), blocking overlapping slots
- Add modal with title, type selector, and duration picker
- No backend required — state is managed locally in React

---

## Design Decisions

- **In-memory storage** keeps the setup dependency-free. Replace the store arrays with a database client (e.g., Prisma + SQLite) to persist data.
- **No build step for packages** — Next.js transpiles workspace TypeScript directly, keeping the dev loop fast.
- **Inline styles + Tailwind** — pages use inline styles for layout/theming (avoids Tailwind purge issues with dynamic values), while UI components use Tailwind utility classes.
- **Optimistic UI** — the frontend updates local state immediately after a successful API call rather than re-fetching, keeping interactions snappy.
