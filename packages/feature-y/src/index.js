const { createHabit, createNote } = require('./habitModel');
const {
  getAllHabits, getHabitById, addHabit, updateHabit, deleteHabit,
  getAllNotes, getNoteById, addNote, updateNote, deleteNote,
} = require('./habitStore');

module.exports = {
  // Models
  createHabit,
  createNote,
  // Habit CRUD
  getAllHabits,
  getHabitById,
  addHabit,
  updateHabit,
  deleteHabit,
  // Note CRUD
  getAllNotes,
  getNoteById,
  addNote,
  updateNote,
  deleteNote,
};
