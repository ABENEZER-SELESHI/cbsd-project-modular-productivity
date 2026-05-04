const { randomUUID } = require('crypto');

/**
 * Create a new Task object.
 * @param {string} title
 * @param {string} [description]
 * @returns {Task}
 */
function createTask(title, description = '') {
  return {
    id: randomUUID(),
    title,
    description,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

module.exports = { createTask };
