const { listNotes, getNote, createNewNote, editNote, removeNote } = require('../services/habitService');

function index(req, res, next) {
  try {
    res.json(listNotes());
  } catch (err) { next(err); }
}

function show(req, res, next) {
  try {
    const note = getNote(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) { next(err); }
}

function create(req, res, next) {
  try {
    const { title, content } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    res.status(201).json(createNewNote(title, content));
  } catch (err) { next(err); }
}

function update(req, res, next) {
  try {
    const note = editNote(req.params.id, req.body);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) { next(err); }
}

function destroy(req, res, next) {
  try {
    const ok = removeNote(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Note not found' });
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { index, show, create, update, destroy };
