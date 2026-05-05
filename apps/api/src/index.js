const express = require('express');
const cors = require('cors');
const { logger, errorHandler } = require('@repo/utils');

const taskRoutes  = require('./routes/tasks');
const habitRoutes = require('./routes/habits');
const noteRoutes  = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(logger());          // request logging

// ── Routes ───────────────────────────────────────────────────
app.use('/api/tasks',  taskRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/notes',  noteRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── Global error handler (must be last) ──────────────────────
app.use(errorHandler());

app.listen(PORT, () => {
  console.log(`\x1b[32m[INFO] \x1b[0m API server running at http://localhost:${PORT}`);
});
