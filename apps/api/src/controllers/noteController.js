const { listNotes, getNote, createNewNote, editNote, removeNote } = require('../services/habitService');

function index(req, res) { res.json(listNotes()); }

function show(req, res) {
  const note = getNote(req.params.id);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
}

function create(req, res) {
  const { title, content } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  res.status(201).json(createNewNote(title, content));
}

function update(req, res) {
  const note = editNote(req.params.id, req.body);
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
}

function destroy(req, res) {
  const ok = removeNote(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Note not found' });
  res.status(204).send();
}

module.exports = { index, show, create, update, destroy };
