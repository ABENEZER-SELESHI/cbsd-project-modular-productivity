const { listHabits, getHabit, createNewHabit, editHabit, removeHabit } = require('../services/habitService');

function index(req, res) { res.json(listHabits()); }

function show(req, res) {
  const habit = getHabit(req.params.id);
  if (!habit) return res.status(404).json({ error: 'Habit not found' });
  res.json(habit);
}

function create(req, res) {
  const { name, frequency } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  res.status(201).json(createNewHabit(name, frequency));
}

function update(req, res) {
  const habit = editHabit(req.params.id, req.body);
  if (!habit) return res.status(404).json({ error: 'Habit not found' });
  res.json(habit);
}

function destroy(req, res) {
  const ok = removeHabit(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Habit not found' });
  res.status(204).send();
}

module.exports = { index, show, create, update, destroy };
