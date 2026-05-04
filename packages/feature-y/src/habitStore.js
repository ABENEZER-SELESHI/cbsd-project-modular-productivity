// In-memory stores
const habits = [];
const notes = [];

// --- Habits ---
function getAllHabits() { return [...habits]; }
function getHabitById(id) { return habits.find((h) => h.id === id) || null; }
function addHabit(habit) { habits.push(habit); return habit; }
function updateHabit(id, updates) {
  const i = habits.findIndex((h) => h.id === id);
  if (i === -1) return null;
  habits[i] = { ...habits[i], ...updates, updatedAt: new Date().toISOString() };
  return habits[i];
}
function deleteHabit(id) {
  const i = habits.findIndex((h) => h.id === id);
  if (i === -1) return false;
  habits.splice(i, 1);
  return true;
}

// --- Notes ---
function getAllNotes() { return [...notes]; }
function getNoteById(id) { return notes.find((n) => n.id === id) || null; }
function addNote(note) { notes.push(note); return note; }
function updateNote(id, updates) {
  const i = notes.findIndex((n) => n.id === id);
  if (i === -1) return null;
  notes[i] = { ...notes[i], ...updates, updatedAt: new Date().toISOString() };
  return notes[i];
}
function deleteNote(id) {
  const i = notes.findIndex((n) => n.id === id);
  if (i === -1) return false;
  notes.splice(i, 1);
  return true;
}

module.exports = {
  getAllHabits, getHabitById, addHabit, updateHabit, deleteHabit,
  getAllNotes, getNoteById, addNote, updateNote, deleteNote,
};
