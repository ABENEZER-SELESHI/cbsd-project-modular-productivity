// In-memory store
const tasks = [];

function getAllTasks() {
  return [...tasks];
}

function getTaskById(id) {
  return tasks.find((t) => t.id === id) || null;
}

function addTask(task) {
  tasks.push(task);
  return task;
}

function updateTask(id, updates) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
  return tasks[index];
}

function deleteTask(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}

module.exports = { getAllTasks, getTaskById, addTask, updateTask, deleteTask };
