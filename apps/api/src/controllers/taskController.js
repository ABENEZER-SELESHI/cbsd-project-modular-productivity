const { listTasks, getTask, createNewTask, editTask, removeTask } = require('../services/taskService');

function index(req, res, next) {
  try {
    res.json(listTasks());
  } catch (err) { next(err); }
}

function show(req, res, next) {
  try {
    const task = getTask(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) { next(err); }
}

function create(req, res, next) {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    res.status(201).json(createNewTask(title, description));
  } catch (err) { next(err); }
}

function update(req, res, next) {
  try {
    const task = editTask(req.params.id, req.body);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) { next(err); }
}

function destroy(req, res, next) {
  try {
    const ok = removeTask(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Task not found' });
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { index, show, create, update, destroy };
