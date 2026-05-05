const { listHabits, getHabit, createNewHabit, editHabit, removeHabit } = require('../services/habitService');

function index(req, res, next) {
  try {
    res.json(listHabits());
  } catch (err) { next(err); }
}

function show(req, res, next) {
  try {
    const habit = getHabit(req.params.id);
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    res.json(habit);
  } catch (err) { next(err); }
}

function create(req, res, next) {
  try {
    const { name, frequency } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    res.status(201).json(createNewHabit(name, frequency));
  } catch (err) { next(err); }
}

function update(req, res, next) {
  try {
    const habit = editHabit(req.params.id, req.body);
    if (!habit) return res.status(404).json({ error: 'Habit not found' });
    res.json(habit);
  } catch (err) { next(err); }
}

function destroy(req, res, next) {
  try {
    const ok = removeHabit(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Habit not found' });
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { index, show, create, update, destroy };
