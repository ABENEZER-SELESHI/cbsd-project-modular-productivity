const { randomUUID } = require('crypto');

/**
 * Create a new Habit object.
 * @param {string} name
 * @param {string} [frequency] - e.g. 'daily', 'weekly'
 * @returns {Habit}
 */
function createHabit(name, frequency = 'daily') {
  return {
    id: randomUUID(),
    name,
    frequency,
    streak: 0,
    completedDates: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Create a new Note object.
 * @param {string} title
 * @param {string} [content]
 * @returns {Note}
 */
function createNote(title, content = '') {
  return {
    id: randomUUID(),
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

module.exports = { createHabit, createNote };
