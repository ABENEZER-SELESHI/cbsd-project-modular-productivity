const { createTask } = require('./taskModel');
const { getAllTasks, getTaskById, addTask, updateTask, deleteTask } = require('./taskStore');

module.exports = {
  // Model
  createTask,
  // CRUD
  getAllTasks,
  getTaskById,
  addTask,
  updateTask,
  deleteTask,
};
