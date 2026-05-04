const { createTask, getAllTasks, getTaskById, addTask, updateTask, deleteTask } = require('@repo/feature-x');

function listTasks() {
  return getAllTasks();
}

function getTask(id) {
  return getTaskById(id);
}

function createNewTask(title, description) {
  const task = createTask(title, description);
  return addTask(task);
}

function editTask(id, updates) {
  return updateTask(id, updates);
}

function removeTask(id) {
  return deleteTask(id);
}

module.exports = { listTasks, getTask, createNewTask, editTask, removeTask };
