const { listTasks, getTask, createNewTask, editTask, removeTask } = require('../services/taskService');

function index(req, res) {
  res.json(listTasks());
}

function show(req, res) {
  const task = getTask(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
}

function create(req, res) {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  res.status(201).json(createNewTask(title, description));
}

function update(req, res) {
  const task = editTask(req.params.id, req.body);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
}

function destroy(req, res) {
  const ok = removeTask(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Task not found' });
  res.status(204).send();
}

module.exports = { index, show, create, update, destroy };
