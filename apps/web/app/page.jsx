'use client';

import { useState } from 'react';
import { Button, Card, Input } from '@repo/ui-components';
import { capitalize, formatDate } from '@repo/utils';
import { createTask } from '@repo/feature-x';
import { createNote } from '@repo/feature-y';

export default function HomePage() {
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [noteInput, setNoteInput] = useState('');

  function handleAddTask() {
    if (!taskInput.trim()) return;
    setTasks((prev) => [...prev, createTask(capitalize(taskInput))]);
    setTaskInput('');
  }

  function handleAddNote() {
    if (!noteInput.trim()) return;
    setNotes((prev) => [...prev, createNote(capitalize(noteInput))]);
    setNoteInput('');
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  return (
    <main style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
          Monorepo Dashboard
        </h1>
        <a href="/ui-demo" style={{ fontSize: '0.875rem', color: '#2563eb', textDecoration: 'none' }}>
          → UI Component Demo
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Task Manager */}
        <Card title="Task Manager (feature-x)">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <Input
              placeholder="New task..."
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
            />
            <Button onClick={handleAddTask}>Add</Button>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {tasks.map((task) => (
              <li
                key={task.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.4rem 0',
                  borderBottom: '1px solid #f0f0f0',
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? '#9ca3af' : '#111827',
                }}
              >
                <span>{task.title}</span>
                <Button variant="ghost" onClick={() => toggleTask(task.id)}>
                  {task.completed ? 'Undo' : 'Done'}
                </Button>
              </li>
            ))}
            {tasks.length === 0 && (
              <li style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No tasks yet.</li>
            )}
          </ul>
        </Card>

        {/* Notes */}
        <Card title="Notes (feature-y)">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <Input
              placeholder="New note..."
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
            />
            <Button onClick={handleAddNote}>Add</Button>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {notes.map((note) => (
              <li
                key={note.id}
                style={{ padding: '0.4rem 0', borderBottom: '1px solid #f0f0f0' }}
              >
                <span style={{ fontWeight: 500 }}>{note.title}</span>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: '0.5rem' }}>
                  {formatDate(note.createdAt)}
                </span>
              </li>
            ))}
            {notes.length === 0 && (
              <li style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No notes yet.</li>
            )}
          </ul>
        </Card>
      </div>
    </main>
  );
}
