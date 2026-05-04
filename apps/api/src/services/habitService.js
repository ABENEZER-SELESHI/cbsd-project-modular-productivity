const {
  createHabit, createNote,
  getAllHabits, getHabitById, addHabit, updateHabit, deleteHabit,
  getAllNotes, getNoteById, addNote, updateNote, deleteNote,
} = require('@repo/feature-y');

// Habits
function listHabits() { return getAllHabits(); }
function getHabit(id) { return getHabitById(id); }
function createNewHabit(name, frequency) { return addHabit(createHabit(name, frequency)); }
function editHabit(id, updates) { return updateHabit(id, updates); }
function removeHabit(id) { return deleteHabit(id); }

// Notes
function listNotes() { return getAllNotes(); }
function getNote(id) { return getNoteById(id); }
function createNewNote(title, content) { return addNote(createNote(title, content)); }
function editNote(id, updates) { return updateNote(id, updates); }
function removeNote(id) { return deleteNote(id); }

module.exports = {
  listHabits, getHabit, createNewHabit, editHabit, removeHabit,
  listNotes, getNote, createNewNote, editNote, removeNote,
};
