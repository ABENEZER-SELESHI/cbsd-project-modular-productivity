const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const habitRoutes = require('./routes/habits');
const noteRoutes = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/notes', noteRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
